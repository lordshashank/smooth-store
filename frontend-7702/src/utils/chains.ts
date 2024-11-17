import {
  arbitrium,
  avalanche,
  bnb,
  celo,
  centrifuge,
  fantom,
  filecoin,
  immutable,
  mantle,
  moonbase,
  optimism,
  polygon,
  sepolia,
} from "../../public";

export const chains = [
  {
    src: filecoin,
    name: "Filecoin",
    chainId: 314159,
    gasLimit: 6000000,
  },
  {
    src: arbitrium,
    name: "ARBITRUM_SEPOLIA",
    chainId: 421614,
    gasLimit: 21000,
  },
  {
    src: filecoin,
    name: "BASE_SEPOLIA",
    chainId: 84532,
    gasLimit: 21000,
  },
  {
    src: polygon,
    name: "Polygon",
    chainId: 80001,
    gasLimit: 200000,
  },
  {
    src: filecoin,
    name: "Scroll",
    chainId: 534351,
    gasLimit: 21000,
  },
  {
    src: fantom,
    name: "Fantom",
    chainId: 4002,
    gasLimit: 21000,
  },
  {
    src: optimism,
    name: "OPTIMISM_SEPOLIA",
    chainId: 11155420,
    gasLimit: 21000,
  },
  {
    src: filecoin,
    name: "BLAST_SEPOLIA",
    chainId: 168587773,
    gasLimit: 21000,
  },
  {
    src: avalanche,
    name: "Avalanche",
    chainId: 43113,
    gasLimit: 21000,
  },
  {
    src: moonbase,
    name: "Moonbase",
    chainId: 1287,
    gasLimit: 21000,
  },
  {
    src: celo,
    name: "Celo",
    chainId: 44787,
    gasLimit: 21000,
  },
  {
    src: mantle,
    name: "Mantle",
    chainId: 5001,
    gasLimit: 21000,
  },
  {
    src: filecoin,
    name: "KAVA",
    chainId: 2221,
    gasLimit: 21000,
  },
];