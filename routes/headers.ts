import { sift } from "../deps.ts";

export const headers: sift.Handler = req => {
  const {
    cache,
    credentials,
    destination,
    url,
    headers,
    integrity,
    method,
    mode,
    redirect,
    referrer,
    referrerPolicy,
  } = req;

  const {
    args,
    build,
    env,
    mainModule,
    noColor,
    pid,
    version
  } = Deno;

  return sift.json({
    request: {
      cache, credentials, destination,
      headers: Object.fromEntries(headers.entries()),
      integrity,
      method,
      mode,
      redirect,
      referrer,
      referrerPolicy,
      url,
    },
    runtime: {
      args,
      build,
      env: {
        DENO_DEPLOYMENT_ID: env.get("DENO_DEPLOYMENT_ID"),
      },
      mainModule,
      noColor,
      pid,
      version,
    }
  });
}
