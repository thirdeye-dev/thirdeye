/* eslint-disable consistent-return */

import { getToken } from "../../lib/token";

// Note for hardik
// Please send in the Authorization header with the token
// That is the reason why it stopped working. 
// Please change the function names as well.

// Maybe write a middleware that automatically does what we are doing.
// Also, maybe find a way to remove the ugly box that comes up when authorization fails.

var SMART_CONTRACT_BASE = "/api/smartcontract"

const fetchServers = async () => {
  try {
    const resp = await fetch(`${SMART_CONTRACT_BASE}/list`, {
      method: "GET",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `JWT ${getToken()}`,
      },
    });
    return await resp.json();
  } catch (e) {
    console.error(e);
  }
  return null;
};

const fetchServer = async (id) => {
  try {
    const resp = await fetch(`${SMART_CONTRACT_BASE}/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `JWT ${getToken()}`,
      },
    });
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

export { fetchServers, fetchServer, fetchHistory };
