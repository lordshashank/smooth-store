"use client";

import merge from "lodash.merge";
import {
  RainbowKitProvider,
  getDefaultConfig,
  Theme,
  midnightTheme,
} from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider } from "wagmi";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import {
  filecoinCalibration,
  polygonMumbai,
  arbitrumSepolia,
  fantomTestnet,
  optimismSepolia,
  avalancheFuji,
  moonbaseAlpha,
  celoAlfajores,
  mantleTestnet,
  scrollSepolia,
  baseSepolia,
  blastSepolia,
} from "wagmi/chains";

const projectId = "7ab7ac25d652c1675ac0a89cf2042275";

const appName = "SmoothStore";

const wagmiConfig = getDefaultConfig({
  appName,
  projectId,
  chains: [
    filecoinCalibration,
    polygonMumbai,
    arbitrumSepolia,
    fantomTestnet,
    optimismSepolia,
    avalancheFuji,
    moonbaseAlpha,
    celoAlfajores,
    mantleTestnet,
    scrollSepolia,
    baseSepolia,
    blastSepolia,
  ],
  ssr: true,
});

const customTheme: Theme = merge(midnightTheme(), {
  colors: {
    accentColor: "#9090DC",
    accentColorForeground: "white",
    connectButtonText: "#ffffff",
    connectButtonBackground: "#000235",
  },
  radii: {
    actionButton: 50,
  },
});

const queryClient = new QueryClient();

export default function RainbowProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
