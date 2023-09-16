import { Chain } from "@/models/contract";

const ethContractAddressRegex = new RegExp(/^0x([A-Fa-f0-9]{40})$/);

export const toSentenceCase = (str: string) => {
  const words = str.split("_");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  return capitalizedWords.join(" ");
};

export const getColorByTag = (tag: string) => {
  switch (tag) {
    case "success":
      return "green";
    case "warn":
      return "yellow";
    case "error":
      return "red";
    default:
      return "gray";
  }
};

export const getColorByChain = (chain: Chain) => {
  if (chain === Chain.ETH) {
    return "blue";
  }

  return "gray";
}

export const gradientByChain = (chain: Chain) => {
  switch (chain.toLowerCase()) {
    case Chain.ETH:
      return {from: "indigo", to: "cyan"}
    default:
      return {from: "gray", to: "gray"} 
  }
}

export const validateEthereumAddress = (address: string) => {
  return ethContractAddressRegex.test(address);
}
