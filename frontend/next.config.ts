// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;



import type { NextConfig } from 'next'

const backendURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
const parsedBackendUrl = (() => {
  try {
    return new URL(backendURL);
  } catch {
    return null;
  }
})();

const dynamicBackendPattern = parsedBackendUrl
  ? {
      protocol: parsedBackendUrl.protocol.replace(":", "") as "http" | "https",
      hostname: parsedBackendUrl.hostname,
      port: parsedBackendUrl.port || (parsedBackendUrl.protocol === "https:" ? "443" : "80"),
      pathname: "/uploads/**",
    }
  : null;

const config: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5050',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5050',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '10.0.2.2',
        port: '5050',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.7',
        port: '5050',
        pathname: '/uploads/**',
      },
      ...(dynamicBackendPattern ? [dynamicBackendPattern] : []),
    ]
  },
}

export default config