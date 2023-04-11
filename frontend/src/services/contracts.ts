import axios from "@/axios";
import Contract from "@/models/contract";

export async function fetchContracts(orgId: string) {
  const response = await axios.get<Contract[]>("/smart/contract", {
    params: {
      owner_organization: orgId,
    },
  });

  return response.data;
}

export async function createContract(
  contract: Partial<Contract>,
  orgId: string
) {
  // FIXME: Refacter backend to use a query param later
  // @ts-ignore
  contract.owner_organization = orgId;

  const response = await axios.post<Contract>(
    "/smart/contract",
    JSON.stringify(contract)
  );

  return response.data;
}

export async function fetchContract(contractId: string, orgId: string) {
  const response = await axios.get<Contract>(`/smart/contract/${contractId}`, {
    params: {
      owner_organization: orgId,
    },
  });

  return response.data;
}

export async function deleteContract(contractId: number, orgId: string) {
  const response = await axios.delete(`/smart/contract/${contractId}`, {
    params: {
      owner_organization: orgId,
    },
  });

  return response.data;
}
