import axios from "@/axios";
import Contract from "@/models/contract";

export async function fetchContracts(orgId: string): Promise<Contract[]> {
  const resp = await axios.get<Contract[]>("/smartcontract/my", {
    params: {
      owner_organization: orgId,
    },
  });

  return resp.data;
}

export async function createContract(
  contract: Partial<Contract>,
  orgId: string
) {
  // FIXME: Refacter backend to use a query param later
  // @ts-ignore
  contract.owner_organization = orgId;

  const response = await axios.post<Contract>(
    "/smartcontract/my",
    JSON.stringify(contract)
  );

  return response.data;
}

export async function fetchContract(
  contractId: string,
  orgId: string
): Promise<Contract> {
  const resp = await axios.get<Contract>(`/smartcontract/my/${contractId}`, {
    params: {
      owner_organization: orgId,
    },
  });

  return resp.data;
}

export async function deleteContract(contractId: number, orgId: string) {
  const response = await axios.delete(`/smartcontract/my/${contractId}`, {
    params: {
      owner_organization: orgId,
    },
  });

  return response.data;
}

// TODO: the response should be typed to an ABI interface
export async function fetchContractABI(contractId: number) {
  const resp = await axios.get(`/smartcontract/get_abi`, {
    params: {
      smart_contract: contractId,
    },
  });

  return resp.data;
}

// TODO: the ABI input should be typed
export async function addContractABI(contractId: number, abi: string) {
  const resp = await axios.post(
    `/smartcontract/add_abi`,
    JSON.stringify({
      abi: abi,
    }),
    {
      params: {
        smart_contract: contractId,
      },
    }
  );

  return resp.data;
}

export async function deleteContractABI(contractId: number) {
  const resp = await axios.delete(`/smartcontract/delete_abi`, {
    params: {
      smart_contract: contractId,
    },
  });

  return resp.data;
}
