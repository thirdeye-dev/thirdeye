import useSWR from "swr";

import Contract from "@/models/contract";
import { fetchContract } from "@/services/contracts";

export default function useContract(contractId: string, orgId: string) {
  const { data, ...swr } = useSWR<Contract>(
    ["/smartcontract/my", contractId, orgId],
    ([_key, contractId, orgId]: string[]) => fetchContract(contractId, orgId),
    {}
  );

  return {
    contract: data,
    ...swr,
  };
}
