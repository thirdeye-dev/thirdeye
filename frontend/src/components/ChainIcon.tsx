import Image from "next/image";

import { Chain } from "@/models/contract";
import { FaEthereum } from "react-icons/fa";

export default function ChainIcon({ chain }: { chain: Chain }) {
  switch (chain) {
    case Chain.ETH:
      // @ts-ignore
      return <FaEthereum />;

    case Chain.SOL:
      // @ts-ignore
      return (
        <Image
          src="https://cryptologos.cc/logos/solana-sol-logo.svg"
          alt="Solana"
          width={12}
          height={12}
        />
      );
    default:
      // @ts-ignore
      return <FaEthereum />;
  }
}
