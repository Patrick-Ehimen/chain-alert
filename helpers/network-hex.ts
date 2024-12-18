// Network Chain IDs in hexadecimal format
export const NETWORK_HEX = {
  ETH_MAINNET: "0x1", // Ethereum Mainnet
  ZKSYNC_MAINNET: "0x144", // zkSync Era Mainnet
  OPTIMISM_MAINNET: "0xa", // Optimism Mainnet
  POLYGON_POS_MAINNET: "0x89", // Polygon PoS Mainnet
  ARBITRUM_MAINNET: "0xa4b1", // Arbitrum One Mainnet
  BASE_MAINNET: "0x2105", // Base Mainnet
  // Note: Starknet and Solana use different address formats and don't follow EVM hex chain IDs
  STARKNET_MAINNET: "SN_MAINNET", // Starknet uses different chain representation
  SOLANA_MAINNET: "mainnet-beta", // Solana uses different network naming
} as const;

// Type for network names
export type NetworkName = keyof typeof NETWORK_HEX;

// Function to get hex chain ID
export const getNetworkHex = (network: NetworkName): string => {
  return NETWORK_HEX[network];
};

// Function to validate if a chain ID is supported
export const isSupportedNetwork = (chainId: string): boolean => {
  return (Object.values(NETWORK_HEX) as string[]).includes(chainId);
};
