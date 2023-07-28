import { json, type Handler } from "sift";

export const tokyoMetroTrains: Handler = async (req, _, params) => {
  const res = await (await fetch(`https://firestore.googleapis.com/v1/projects/${Deno.env.get("TOKYOMETRO_FIREBASE_PROJECTID")}/databases/(default)/documents/tokyometro${params?.line && `/${params.line}`}`)).json();
  return json(JSON.parse(res.fields.trainList.stringValue));
};
