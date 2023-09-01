import { Chain } from "@/models/contract";
import { FaEthereum } from "react-icons/fa";

export default function ChainIcon({ chain }: { chain: Chain }) {

  switch (chain) {
    case Chain.ETH:
      return <FaEthereum />;
    default:
      return <FaEthereum />;
  }
}
