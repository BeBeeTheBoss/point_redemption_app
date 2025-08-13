import axios from "axios";

const createAPI = (token,params) => {
  let host = "192.168.2.24:7777";

  return axios.create({
    baseURL: `http://${host}/api`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    params : params
  });
};

export default createAPI;
