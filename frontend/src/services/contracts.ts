import axios from "@/axios";
import Contract from "@/models/contract";

export async function fetchContracts() {
  const response = await axios.get<Contract[]>("/smartcontract/list");

  return response.data;
}

export async function createContract(contract: Partial<Contract>) {
  const response = await axios.post<Contract>(
    "/smartcontract/create",
    JSON.stringify(contract)
  );

  return response.data;
}
