import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    try {
      // Try to serve the asset from KV
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
          cacheControl: {
            browserTTL: 60 * 60 * 24 * 365, // 1 year
            edgeTTL: 60 * 60 * 24 * 30, // 30 days
            bypassCache: DEBUG,
          },
        }
      );
    } catch (e) {
      // If the asset is not found, try to serve index.html for SPA routing
      if (e.status === 404) {
        try {
          const notFoundResponse = await getAssetFromKV(
            {
              request: new Request(`${url.origin}/index.html`, request),
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
            }
          );

          return new Response(notFoundResponse.body, {
            ...notFoundResponse,
            status: 200,
          });
        } catch (e) {}
      }

      // If an error is thrown, return a custom error page
      return new Response(DEBUG ? e.message || e.toString() : "Not Found", {
        status: 404,
      });
    }
  },
};
