export function shortenWalletAddress(walletAddress) {
  if (!walletAddress || typeof walletAddress !== "string") {
    return "Invalid wallet address";
  }

  const prefix = walletAddress.slice(0, 3);

  const suffix = walletAddress.slice(-3);

  return `${prefix}...${suffix}`;
}
