import Image from "next/image";

import { Chain } from "@/models/contract";
import { FaEthereum } from "react-icons/fa";

export default function ChainIcon({ chain }: { chain: Chain }) {

  switch (chain) {
    case Chain.ETH:
      return <FaEthereum />;
    case Chain.ARB:
      return <Image src="https://cryptologos.cc/logos/arbitrum-arb-logo.svg" alt="Arbitrum" width={24} height={24} />;
    default:
      return <FaEthereum />;
  }
}
