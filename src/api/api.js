import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend URL
});

export const getTemplates = () => API.get("/templates");
export const createTemplate = (data) => API.post("/templates", data);

export const getFormsByTemplate = (templateId) => 
  API.get(`/forms/template/${templateId}`);
export const submitForm = (data) => API.post("/forms", data);

export default API;
