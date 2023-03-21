import axios from "@/axios";
import Contract from "@/models/contract";

export async function fetchContracts() {
  const response = await axios.get<Contract[]>("/smart/contract");

  return response.data;
}

export async function createContract(contract: Partial<Contract>) {
  const response = await axios.post<Contract>(
    "/smart/contract",
    JSON.stringify(contract)
  );

  return response.data;
}
