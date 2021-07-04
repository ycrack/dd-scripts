import { sift } from "../deps.ts";
import { headers } from "./headers.ts";
import { odakyuTrains } from "./odakyu/trains.ts";
import { odptGtfsRtHandler } from "./odpt/gtfs-rt.ts";
import { shinkeiseiTrains } from "./shinkeisei/trains.ts";

const index: sift.Handler = _ => sift.json(Object.keys(routes));

const routes: sift.Routes = {
  "/": index,
  "/headers": headers,
  "/odakyu/trains": odakyuTrains,
  "/odpt/bus/gtfsrt/:type/:operator": odptGtfsRtHandler,
  "/shinkeisei/trains": shinkeiseiTrains,
};

sift.serve(routes);
