import { sift } from "../../deps.ts";

const appkey = Deno.env.get("SHINKEISEI_API_KEY")!;

export const shinkeiseiTrains: sift.Handler = async () => {
  const res = await fetch(
    'https://trainposinfo.shinkeisei.co.jp/ShinkeiseiMobileWeb/webresources/jp.co.shinkeisei.entity.trainpositioninfo',
    { headers: { appkey } }
  );
  if (!res.ok) {
    return new Response(
      JSON.stringify({ status: 500, message: "Getting data failed." }),
      { status: 500, headers: { "content-type": "application/json; charset=UTF-8" } }
    );
  } else {
    return sift.json(await res.json());
  }
};
