import {
  json, serve,
  type Handler, type Routes
} from "sift";
import { headers } from "./headers.ts";
import { odakyuTrains } from "./odakyu/trains.ts";
import { odptGtfsRtHandler } from "./odpt/gtfs-rt.ts";
import { seibuTrains, seibuOdptTrains } from "./seibu/trains.ts";
import { shinkeiseiTrains } from "./shinkeisei/trains.ts";

const index: Handler = _ => json(Object.keys(routes));

const routes: Routes = {
  "/": index,
  "/headers": headers,
  "/odakyu/trains": odakyuTrains,
  "/odpt/bus/gtfsrt/:type/:operator": odptGtfsRtHandler,
  "/seibu/odpt/trains/:line": seibuOdptTrains,
  "/seibu/trains/:line": seibuTrains,
  "/shinkeisei/trains": shinkeiseiTrains,
};

serve(routes);
