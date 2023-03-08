/* eslint-disable consistent-return */
const fetchContracts = async () => {
  try {
    const resp = await fetch("/api/smartcontract/list");
    return await resp.json();
  } catch (e) {
    console.error(e);
  }
  return null;
};

const fetchContract = async (id) => {
  try {
    const resp = await fetch(`/api/smartcontract/${id}`);
    return await resp.json();
  } catch (e) {
    console.error(e);
  }
};

const fetchHistory = async (id, date, mode) => {
  try {
    const resp = await fetch(`/api/servers/history?server_id=${id}&date=${date}&mode=${mode}`);
    return await resp.json();
  } catch (e) {
    console.error(e);
  }
};

export { fetchContracts, fetchContract, fetchHistory };
