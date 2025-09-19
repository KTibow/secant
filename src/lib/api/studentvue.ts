import districts from "school-districts";
import { XMLParser } from "fast-xml-parser";
import { getLogin } from "monoidentity";

const build = (object: Record<string, string>) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(object)) {
    params.set(key, value);
  }
  return params;
};
const parser = new XMLParser({ ignoreAttributes: false });

export default async (name: string, params: Record<string, string> = {}) => {
  const { email, password } = getLogin();

  const domain = email.split("@")[1];
  const district = districts[domain];
  if (!district) {
    throw new Error("Unknown district");
  }
  const host = district.apps.find((a) => a.app == "StudentVue")?.host;
  if (!host) {
    throw new Error("District does not use StudentVue");
  }

  const userID = email.split("@")[0];

  const request = build({
    userID,
    password,
    skipLoginLog: "true",
    parent: "false",
    webServiceHandleName: "PXPWebServices",
    methodName: name,
    paramStr: `<Parms>${Object.keys(params)
      .map((key) => `<${key}>${params[key]}</${key}>`)
      .join("")}</Parms>`,
  });

  const response = await fetch(
    `https://${host}/Service/PXPCommunication.asmx/ProcessWebServiceRequest`,
    {
      method: "POST",
      body: request,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    },
  );
  const dataWrap = await response.text();
  const data = dataWrap
    .split(`<string xmlns="http://edupoint.com/webservices/">`)[1]
    .split("</string>")[0]
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  const xml = parser.parse(data);
  const err = xml.RT_ERROR;
  if (err) {
    if (err["@_ERROR_MESSAGE"].startsWith("Invalid user id or password")) {
      throw new Error("Invalid auth");
    }
    throw new Error("StudentVue error");
  }

  return xml;
};
