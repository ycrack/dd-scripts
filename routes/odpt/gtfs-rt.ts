import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import { json, type Handler } from "sift";
import { gettingDataFailedResponse } from "../../utils.ts";

const apikey = Deno.env.get("ODPT_KEY");

const links: {
  id: string;
  public: boolean;
  vp?: string;
  tu?: string;
  al?: string;
}[] = [
  {
    id: "seibubus",
    public: false,
    vp: "SeibuBus_vehicle",
    tu: "SeibuBus_trip_update",
  },
  {
    id: "hamabus",
    public: false,
    vp: "YokohamaMunicipalBus_vehicle",
    tu: "YokohamaMunicipalBus_trip_update",
    al: "YokohamaMunicipalBus_alert",
  },
  {
    id: "nagaibus",
    public: true,
    vp: "odpt_NagaiTransportation_AllLines_vehicle",
    tu: "odpt_NagaiTransportation_AllLines_trip_update",
    al: "odpt_NagaiTransportation_AllLines_alert",
  },
  {
    id: "tamarin",
    public: true,
    al: "odpt_NagaiTransportation_Tamarin_alert",
  },
  {
    id: "aomoricitybus",
    public: true,
    vp: "odpt_AomoriCity_AllLines_vehicle",
    tu: "odpt_AomoriCity_AllLines_trip_update",
    al: "odpt_AomoriCity_AllLines_alert",
  },
  {
    id: "unobus",
    public: true,
    vp: "odpt_UnoBus_AllLines_vehicle",
    tu: "odpt_UnoBus_AllLines_trip_update",
    al: "odpt_UnoBus_AllLines_alert",
  },
  {
    id: "tobus",
    public: true,
    vp: "ToeiBus",
  },
  {
    id: "kyotobus",
    public: false,
    vp: "odpt_KyotoBus_AllLines_vehicle",
  },
  {
    id: "yokohama-subway",
    public: false,
    vp: "YokohamaMunicipalTrain_vehicle",
    tu: "YokohamaMunicipalTrain_trip_update",
    al: "YokohamaMunicipalTrain_alert",
  },
];

const decodePB = (data: ArrayBuffer) => GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(data));

export const odptGtfsRtHandler: Handler = async (req, _, params) => {
  if (!params?.type || !params?.operator) {
    return new Response(
      JSON.stringify({ status: 400, message: "'type' and 'operator' parameter is required" }),
      { status: 400, headers: { "content-type": "application/json; charset=UTF-8" } }
    );
  }

  const {
    type: dataType,
    operator
  } = params;

  if (!["vp", "tu", "al"].includes(dataType)) {
    return new Response(
      JSON.stringify({ status: 400, message: "'type' parameter must in 'vp', 'tu', 'al'." }),
      { status: 400, headers: { "content-type": "application/json; charset=UTF-8" } }
    );
  }

  const op = links.find(o => operator == o.id);

  if (!op) {
    return new Response(
      JSON.stringify({ status: 400, message: "Specified 'operator' not found.", available: links.map(o => o.id) }),
      { status: 400, headers: { "content-type": "application/json; charset=UTF-8" } }
    );
  }

  const lastPath = op[dataType as "vp" | "tu" | "al"];

  if (!lastPath) {
    return new Response(
      JSON.stringify({ status: 400, message: `This dataType of operator (${operator}) is not supported.` }),
      { status: 400, headers: { "content-type": "application/json; charset=UTF-8" } }
    );
  }

  const res = await fetch(`https://api${op.public ? "-public" : ""}.odpt.org/api/v4/gtfs/realtime/${lastPath}${op.public ? "" : `?acl:consumerKey=${apikey}`}`);
  return res.ok ? json(decodePB(await res.arrayBuffer())) : gettingDataFailedResponse;
};
