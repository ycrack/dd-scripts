import { sift, GtfsRealtimeBindings } from "../../deps.ts";

const apikey = Deno.env.get("ODPT_TC_KEY");

const availableOperators = new Map([
  ["vehicle", ["tobus", "seibubus", "hamabus"]],
  ["trip_update", ["seibubus", "hamabus"]],
  ["alert", ["hamabus"]],
]);

const odptOperators = new Map([
  ["tobus", "ToeiBus"],
  ["seibubus", "SeibuBus"],
  ["hamabus", "YokohamaMunicipalBus"],
]);

const decodePB = (data: ArrayBuffer) => GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(data));

export const odptGtfsRtHandler: sift.Handler = async (req, params) => {
  const dataType = params.type as string;
  const operator = params.operator as string;

  switch (dataType) {
    case "alert":
    case "trip_update":
    case "vehicle": {
      const isAvailable = availableOperators.get(dataType)!.includes(operator);
      if (!isAvailable) {
        return new Response(
          JSON.stringify({ status: 500, message: "operator not supported for this data type." }),
          { status: 500, headers: { "content-type": "application/json; charset=UTF-8" } }
        );
      } else {
        const odptOperatorName = odptOperators.get(operator);
        const res = await fetch(`https://api-tokyochallenge.odpt.org/api/v4/gtfs/realtime/${odptOperatorName}_${dataType}?acl:consumerKey=${apikey}`);
        if (res.ok) {
          const feed = decodePB(await res.arrayBuffer());
          return sift.json(feed);
        } else {
          return new Response(
            JSON.stringify({ status: 500, message: "Getting data failed." }),
            { status: 500, headers: { "content-type": "application/json; charset=UTF-8" } }
          );
        }
      }
    }
    default: return new Response(
      JSON.stringify({ status: 500, message: "Invalid data type specified." }),
      { status: 500, headers: { "content-type": "application/json; charset=UTF-8" } }
    );
  }
}
