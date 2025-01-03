import axios from "axios";
const request = axios.create({
  baseURL: "http://localhost:3306/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
export { request };
