import { intersect, literal, number, object, string, union, type InferOutput } from "valibot";
import { decode } from "monoidentity";
import { SC_KEY_A1, SC_SECRET_A1 } from "$env/static/private";

const tokenSchema = object({ key: string(), secret: string() });
export const authBase = object({
  token: tokenSchema,
  appToken: union([literal("token"), literal("a1")]),
});
export const fullAuth = intersect([authBase, object({ userId: number() })]);
export type AuthBase = InferOutput<typeof authBase>;
export type FullAuth = InferOutput<typeof fullAuth>;

const internalCreateSchoology = (
  appKey: string,
  appSecret: string,
  userKey?: string,
  userSecret?: string,
) => {
  const createBaseString = (method: string, url: string, params: Record<string, string>) => {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(params[key])}`);
    return `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams.join("&"))}`;
  };

  const sign = async (
    method: string,
    url: string,
    params: Record<string, string>,
    tokenSecret = "",
  ) => {
    const baseString = createBaseString(method, url, params);
    const signingKey = `${encodeURIComponent(appSecret)}&${encodeURIComponent(tokenSecret)}`;

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
  };

  return async function makeRequest(req: Request): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID().replaceAll("-", "");

    // Parse URL to separate base URL from query parameters
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}${url.pathname}`;

    const params: Record<string, string> = {
      oauth_consumer_key: appKey,
      oauth_nonce: nonce,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_version: "1.0",
    };

    // Add query parameters to OAuth parameters
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    if (userKey) {
      params.oauth_token = userKey;
    }

    const signature = await sign(req.method, baseUrl, params, userSecret ?? "");
    params.oauth_signature = signature;

    const authHeader =
      "OAuth " +
      Object.keys(params)
        .map((key) => `${key}="${encodeURIComponent(params[key])}"`)
        .join(", ");

    const response = await fetch(req.url, {
      method: req.method,
      body: req.body,
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
        return await makeRequest(new Request(location));
      }
    }

    if (!response.ok) {
      throw new Error(`Schoology is ${response.status}ing`, { cause: await response.text() });
    }

    if (response.headers.get("content-type")?.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  };
};
export const createSchoology = (auth: AuthBase) => {
  let appKey: string;
  let appSecret: string;
  let userKey: string | undefined;
  let userSecret: string | undefined;

  const key = decode(auth.token.key);
  const secret = decode(auth.token.secret);
  if (auth.appToken == "token") {
    appKey = key;
    appSecret = secret;
  } else if (auth.appToken == "a1") {
    appKey = SC_KEY_A1;
    appSecret = SC_SECRET_A1;
    userKey = key;
    userSecret = secret;
  } else {
    throw new Error("Invalid appToken");
  }
  return internalCreateSchoology(appKey, appSecret, userKey, userSecret);
};
