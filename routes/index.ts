import { sift } from "../deps.ts";
import { headers } from "./headers.ts";
import { odptGtfsRtHandler } from "./odpt/gtfs-rt.ts";
import { shinkeiseiTrains } from "./shinkeisei/trains.ts";

const index: sift.Handler = _ => sift.json(Object.keys(routes));

const routes: sift.Routes = {
  "/": index,
  "/headers": headers,
  "/shinkeisei/trains": shinkeiseiTrains,
  "/odpt/bus/gtfsrt/:type/:operator": odptGtfsRtHandler,
};

sift.serve(routes);
