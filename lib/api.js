import axios from "axios";

const createAPI = (token,params) => {
  // let host = "192.168.2.24:7777";
  // let host = "192.168.5.16:8000";
  let host = "pmpr.sysdevpghc.net";

  return axios.create({
    baseURL: `https://${host}/api`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    params : params
  });
};

export default createAPI;
