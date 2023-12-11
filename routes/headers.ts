import { json, type Handler } from "sift";

export const headers: Handler = (req, conn, params) => {
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

  const localAddr = conn.localAddr as Deno.NetAddr;
  const remoteAddr = conn.remoteAddr as Deno.NetAddr;

  const {
    args,
    build,
    env,
    noColor,
    pid,
    version,
  } = Deno;

  return json({
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
    connInfo: {
      server: {
        ip: localAddr.hostname,
        port: localAddr.port,
      },
      browser: {
        ip: remoteAddr.hostname,
        port: remoteAddr.port,
      },
    },
    runtime: {
      args,
      build,
      env: {
        DENO_REGION: env.get("DENO_REGION"),
        DENO_DEPLOYMENT_ID: env.get("DENO_DEPLOYMENT_ID"),
      },
      noColor,
      pid,
      version,
    }
  });
}
