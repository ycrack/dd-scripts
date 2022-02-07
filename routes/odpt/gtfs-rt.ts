import { sift, GtfsRealtimeBindings } from "../../deps.ts";
import { gettingDataFailedResponse } from "../../utils.ts";

const apikey = Deno.env.get("ODPT_KEY");

const availableOperators = new Map([
  ["vehicle",     ["tobus", "seibubus", "hamabus"]],
  ["trip_update", ["seibubus", "hamabus"]],
  ["alert",       ["hamabus"]],
]);

const odptOperators = new Map([
  ["tobus",    "ToeiBus"],
  ["seibubus", "SeibuBus"],
  ["hamabus",  "YokohamaMunicipalBus"],
]);

const decodePB = (data: ArrayBuffer) => GtfsRealtimeBindings.default.transit_realtime.FeedMessage.decode(new Uint8Array(data));

export const odptGtfsRtHandler: sift.Handler = async (_, params) => {
  const dataType = params?.type as string;
  const operator = params?.operator as string;

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
        const res = await fetch(`https://api.odpt.org/api/v4/gtfs/realtime/${odptOperatorName}${operator == "tobus" ? "" : `_${dataType}`}?acl:consumerKey=${apikey}`);
        return res.ok ? sift.json(decodePB(await res.arrayBuffer())) : gettingDataFailedResponse;
      }
    }
    default: return new Response(
      JSON.stringify({ status: 500, message: "Invalid data type specified." }),
      { status: 500, headers: { "content-type": "application/json; charset=UTF-8" } }
    );
  }
}
