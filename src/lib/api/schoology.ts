export type Tokens = {
  key: string;
  secret: string;
};

export default class {
  constructor(
    private consumerKey: string,
    private consumerSecret: string,
  ) {}

  private async sign(
    method: string,
    url: string,
    params: Record<string, string>,
    tokenSecret = "",
  ) {
    const baseString = this.createBaseString(method, url, params);
    const signingKey = `${encodeURIComponent(this.consumerSecret)}&${encodeURIComponent(
      tokenSecret,
    )}`;

    const keyData = new TextEncoder().encode(signingKey);
    const data = new TextEncoder().encode(baseString);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"],
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  private createBaseString(method: string, url: string, params: Record<string, string>) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(params[key])}`);
    return `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams.join("&"))}`;
  }

  async makeRequest(request: Request, token?: Tokens): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID().replaceAll("-", "");

    const params: Record<string, string> = {
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: nonce,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_version: "1.0",
    };

    if (token) {
      params.oauth_token = token.key;
    }

    const signature = await this.sign(request.method, request.url, params, token?.secret);
    params.oauth_signature = signature;

    const authHeader =
      "OAuth " +
      Object.keys(params)
        .map((key) => `${key}="${encodeURIComponent(params[key])}"`)
        .join(", ");

    const response = await fetch(request.url, {
      method: request.method,
      body: request.body,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      redirect: "manual",
    });

    // Rerequest if redirect
    if ([301, 302, 303].includes(response.status)) {
      const location = response.headers.get("location");
      if (location) {
        return await this.makeRequest(new Request(location), token);
      }
    }

    if (!response.ok) {
      throw new Error(`Schoology is ${response.status}ing`);
    }

    if (response.headers.get("content-type")?.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  }
}
