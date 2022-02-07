import { sift } from "../../deps.ts";
import { gettingDataFailedResponse } from "../../utils.ts";

const appkey = Deno.env.get("SHINKEISEI_API_KEY")!;

export const shinkeiseiTrains: sift.Handler = async () => {
  const res = await fetch(
    'https://trainposinfo.shinkeisei.co.jp/ShinkeiseiMobileWeb/webresources/jp.co.shinkeisei.entity.trainpositioninfo',
    { headers: { appkey } }
  );
  return res.ok ? sift.json(await res.json()) : gettingDataFailedResponse;
};
