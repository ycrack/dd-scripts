import { json, type Handler } from "sift";
import { gettingDataFailedResponse } from "../../utils.ts";

const apikey = Deno.env.get("ODAKYU_API_KEY")!;

export const odakyuTrains: Handler = async () => {
  const res = await fetch(
    "https://d1s70nqacx30p8.cloudfront.net/prod/v1/trains",
    { headers: { "x-api-key": apikey } }
  );

  return res.ok ? json(await res.json()) : gettingDataFailedResponse;
};
