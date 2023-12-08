import Contract from "@/models/contract";
import { fetchContracts } from "@/services/contracts";
import useSWR from "swr";

export default function useContracts(orgId: string) {
  const { data, ...swr } = useSWR<Contract[]>(
    ["/smartcontract/my", orgId],
    ([_key, orgId]: string[]) => fetchContracts(orgId),
    {}
  );

  return {
    contracts: data,
    ...swr,
  };
}
