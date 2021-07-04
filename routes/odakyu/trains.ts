import { sift } from "../../deps.ts";

const apikey = Deno.env.get("ODAKYU_API_KEY")!;

export const odakyuTrains: sift.Handler = async () => {
  const res = await fetch(
    "https://d1s70nqacx30p8.cloudfront.net/prod/v1/trains",
    { headers: { "x-api-key": apikey } }
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
