import { HEADER } from "@std/http/unstable-header";
import { contentType } from "@std/media-types";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import { json, type Handler } from "sift";
import { gettingDataFailedResponse } from "../../utils.ts";

const links = [
  // https://members-portal.odpt.org/api/v1/resources
  {
    id: "kyoto-bus",
    type: "restricted",
    vp: "odpt_KyotoBus_AllLines_vehicle",
    tu: "odpt_KyotoBus_AllLines_trip_update",
    al: "odpt_KyotoBus_AllLines_alert",
  },
  {
    id: "nagaibus",
    type: "public",
    vp: "odpt_NagaiTransportation_AllLines_vehicle",
    tu: "odpt_NagaiTransportation_AllLines_trip_update",
    al: "odpt_NagaiTransportation_AllLines_alert",
  },
  {
    id: "aomori-city",
    type: "public",
    vp: "odpt_AomoriCity_AllLines_vehicle",
    tu: "odpt_AomoriCity_AllLines_trip_update",
    al: "odpt_AomoriCity_AllLines_alert",
  },
  {
    id: "izuhakone-bus",
    type: "restricted",
    vp: "odpt_IzuhakoneBus_IZHB_vehicle",
    tu: "odpt_IzuhakoneBus_IZHB_trip_update",
    al: "odpt_IzuhakoneBus_IZHB_alert",
  },
  {
    id: "gunma-bus",
    type: "public",
    vp: "odpt_GunmaBus_AllLines_vehicle",
    tu: "odpt_GunmaBus_AllLines_trip_update",
    al: "odpt_GunmaBus_AllLines_alert",
  },
  {
    id: "unobus",
    type: "public",
    vp: "odpt_UnoBus_AllLines_vehicle",
    tu: "odpt_UnoBus_AllLines_trip_update",
    al: "odpt_UnoBus_AllLines_alert",
  },
  {
    id: "kiyobus",
    type: "public",
    vp: "odpt_KiyoseCity_KiyoBus_vehicle",
    tu: "odpt_KiyoseCity_KiyoBus_trip_update",
  },
  {
    id: "rinko-bus",
    type: "restricted",
    vp: "odpt_KawasakiTsurumiRinkoBus_allrinko_vehicle",
    tu: "odpt_KawasakiTsurumiRinkoBus_allrinko_trip_update",
    al: "odpt_KawasakiTsurumiRinkoBus_allrinko_alert",
  },
  {
    id: "keifuku-bus",
    type: "public",
    vp: "odpt_KeifukuBus_keifuku_rosen_vehicle",
    tu: "odpt_KeifukuBus_keifuku_rosen_trip_update",
    al: "odpt_KeifukuBus_keifuku_rosen_alert",
  },
  {
    id: "keisei-transit-bus",
    type: "public",
    vp: "odpt_KeiseiTransitBus_AllLines_vehicle",
    tu: "odpt_KeiseiTransitBus_AllLines_trip_update",
    al: "odpt_KeiseiTransitBus_AllLines_alert",
  },
  {
    id: "ncb",
    type: "public",
    vp: "odpt_NipponChuoBus_Maebashi_Area_vehicle",
    tu: "odpt_NipponChuoBus_Maebashi_Area_trip_update",
    al: "odpt_NipponChuoBus_Maebashi_Area_alert",
  },
  {
    id: "ncb-okutano",
    type: "public",
    al: "odpt_NipponChuoBus_Okutano_Area_alert",
  },
  {
    id: "keio-bus",
    type: "restricted",
    vp: "odpt_KeioBus_AllLines_vehicle",
    tu: "odpt_KeioBus_AllLines_trip_update",
  },
  {
    id: "hakodate-city",
    type: "public",
    vp: "odpt_HakodateCity_Alllines_vehicle",
    tu: "odpt_HakodateCity_Alllines_trip_update",
    al: "odpt_HakodateCity_Alllines_alert",
  },
  {
    id: "takushoku-bus",
    type: "restricted",
    vp: "odpt_HokkaidoTakushokuBus_Takusyoku_regular_line_vehicle",
    tu: "odpt_HokkaidoTakushokuBus_Takusyoku_regular_line_trip_update",
  },
  {
    id: "kanto-bus",
    type: "restricted",
    vp: "odpt_KantoBus_AllLines_vehicle",
    tu: "odpt_KantoBus_AllLines_trip_update",
    al: "odpt_KantoBus_AllLines_alert",
  },
  {
    id: "tokai-kisen",
    type: "restricted",
    al: "odpt_TokaiKisen_AllLines_alert",
  },
  {
    id: "ntb",
    type: "restricted",
    vp: "odpt_NishiTokyoBus_NTB_vehicle",
    tu: "odpt_NishiTokyoBus_NTB_trip_update",
    al: "odpt_NishiTokyoBus_NTB_alert",
  },
  {
    id: "sentetsu-bus",
    type: "public",
    vp: "odpt_SentetsuBus_AllLines_vehicle",
    tu: "odpt_SentetsuBus_AllLines_trip_update",
    al: "odpt_SentetsuBus_AllLines_alert",
  },
  {
    id: "kawasaki-city",
    type: "restricted",
    vp: "odpt_TransportationBureau_CityOfKawasaki_AllLines_vehicle",
    tu: "odpt_TransportationBureau_CityOfKawasaki_AllLines_trip_update",
    al: "odpt_TransportationBureau_CityOfKawasaki_AllLines_alert",
  },

  {
    id: "toei",
    type: "public",
    vp: "toei_odpt_train_vehicle",
    tu: "toei_odpt_train_trip_update",
    al: "toei_odpt_train_alert",
  },
  {
    id: "mir",
    type: "restricted",
    al: "mir_odpt_train_alert",
  },
  {
    id: "tama-monorail",
    type: "restricted",
    al: "tamamonorail_odpt_train_alert",
  },
  {
    id: "tokyometro",
    type: "restricted",
    al: "tokyometro_odpt_train_alert",
  },
  {
    id: "twr",
    type: "restricted",
    al: "twr_odpt_train_alert",
  },

  {
    id: "tobus",
    type: "public",
    vp: "ToeiBus",
  },
  {
    id: "hamabus",
    type: "restricted",
    vp: "YokohamaMunicipalBus_vehicle",
    tu: "YokohamaMunicipalBus_trip_update",
    al: "YokohamaMunicipalBus_alert",
  },
  {
    id: "yokohama-subway",
    type: "restricted",
    vp: "YokohamaMunicipalTrain_vehicle",
    tu: "YokohamaMunicipalTrain_trip_update",
    al: "YokohamaMunicipalTrain_alert",
  },
  {
    id: "seibubus",
    type: "restricted",
    vp: "SeibuBus_vehicle",
    tu: "SeibuBus_trip_update",
  },

  // challenge
  {
    id: "jreast",
    type: "challenge",
    vp: "jreast_odpt_train_vehicle",
    tu: "jreast_odpt_train_trip_update",
    al: "jreis_odpt_train_alert",
  },
  {
    id: "tobu",
    type: "challenge",
    vp: "tobu_odpt_train_vehicle",
    tu: "tobu_odpt_train_trip_update",
    al: "tobu_odpt_train_alert",
  },
] satisfies {
  id: string;
  type: "public" | "restricted" | "challenge";
  vp?: string;
  tu?: string;
  al?: string;
}[];

const decodePB = (data: ArrayBuffer) =>
  GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(data));

export const odptGtfsRtHandler: Handler = async (_req, _conn, params) => {
  if (!params?.type || !params?.operator) {
    return new Response(
      JSON.stringify({ status: 400, message: "'type' and 'operator' parameter is required" }),
      { status: 400, headers: { [HEADER.ContentType]: contentType("json") } },
    );
  }

  const {
    type: dataType,
    operator,
  } = params;

  if (!["vp", "tu", "al"].includes(dataType)) {
    return new Response(
      JSON.stringify({ status: 400, message: "'type' parameter must in 'vp', 'tu', 'al'." }),
      { status: 400, headers: { [HEADER.ContentType]: contentType("json") } },
    );
  }

  const op = links.find((o) => operator == o.id);

  if (!op) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: "Specified 'operator' not found.",
        available: links.map((o) => o.id),
      }),
      { status: 400, headers: { [HEADER.ContentType]: contentType("json") } },
    );
  }

  const lastPath = op[dataType as "vp" | "tu" | "al"];

  if (!lastPath) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: `This dataType of operator (${operator}) is not supported.`,
      }),
      { status: 400, headers: { [HEADER.ContentType]: contentType("json") } },
    );
  }

  const res = await fetch(
    `https://api${op.type === "public" ? "-public" : op.type === "challenge" ? "-challenge2024" : ""
    }.odpt.org/api/v4/gtfs/realtime/${lastPath}${op.type === "public" ? "" : `?acl:consumerKey=${Deno.env.get(op.type === "challenge" ? "ODPT_CHALLENGE_KEY" : "ODPT_KEY")}`}`,
  );
  return res.ok ? json(decodePB(await res.arrayBuffer())) : gettingDataFailedResponse;
};
