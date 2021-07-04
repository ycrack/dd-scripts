import { sift } from "../deps.ts";
import { headers } from "./headers.ts";

const index: sift.Handler = _ => sift.json(Object.keys(routes));

const routes: sift.Routes = {
  "/": index,
  "/headers": headers,
};

sift.serve(routes);
