import { json, type Handler } from "sift";
import { gettingDataFailedResponse } from "../../utils.ts";

const domain = Deno.env.get("ODAKYU_API_HOST")!;
const apikey = Deno.env.get("ODAKYU_API_KEY")!;

export const odakyuTrains: Handler = async () => {
  const res = await fetch(
    `https://${domain}/trains`,
    { headers: { "x-api-key": apikey } }
  );

  return res.ok ? json(await res.json()) : gettingDataFailedResponse;
};
