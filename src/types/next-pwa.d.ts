declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface PWAConfig {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    sw?: string;
    scope?: string;
    runtimeCaching?: object[];
    buildExcludes?: (string | RegExp)[];
    fallbacks?: {
      image?: string;
      document?: string;
      font?: string;
      audio?: string;
      video?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
  }

  function withPWAInit(
    config: PWAConfig
  ): (nextConfig: NextConfig) => NextConfig;

  export = withPWAInit;
}
