import axios from "axios";

const domain = "http://localhost:8080";

export const callAPI = async (path, method, data = {}, config = {}) => {
  try {
    if (method === "GET") {
      const response = await axios.get(domain + path, config);
      if (response.status === 200) {
        return response.data;
      }
    } else if (method === "POST") {
      const response = await axios.post(domain + path, data, config);
      if (response.status === 201) {
        return response.data;
      }
    } else if (method === "DELETE") {
      const response = await axios.delete(domain + path, config);
      if (response.status === 200) {
        return response.data;
      }
    } else if (method === "PUT") {
      const response = await axios.put(domain + path, data, config);
      if (response.status === 200) {
        return response.data;
      }
    }
    return;
  } catch (error) {
    console.error(error);
  }
};
