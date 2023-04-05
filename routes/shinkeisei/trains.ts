import { json, type Handler } from "sift";
import { gettingDataFailedResponse } from "../../utils.ts";

const appkey = Deno.env.get("SHINKEISEI_API_KEY")!;

export const shinkeiseiTrains: Handler = async () => {
  const res = await fetch(
    'https://trainposinfo.shinkeisei.co.jp/ShinkeiseiMobileWeb/webresources/jp.co.shinkeisei.entity.trainpositioninfo',
    { headers: { appkey } }
  );
  return res.ok ? json(await res.json()) : gettingDataFailedResponse;
};
