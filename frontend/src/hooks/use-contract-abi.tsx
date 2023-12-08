import useSWR from "swr";

import { fetchContractABI } from "@/services/contracts";

export default function useContractABI(contractId: string | undefined) {
  const { data, ...swr } = useSWR(
    ["/smartcontract/get_abi", contractId],
    ([_key, contractId]: string[]) => fetchContractABI(parseInt(contractId)),
    {}
  );

  return {
    abi: data,
    ...swr,
  };
}
