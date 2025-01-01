import axios from "axios";
const request = axios.create({
  baseURL: "https://my-course-project-25cbbc9b712d.herokuapp.com/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
export { request };
