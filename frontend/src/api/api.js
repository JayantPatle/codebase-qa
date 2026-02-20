import axios from "axios";

const api = axios.create({
  baseURL: "https://codebase-qa-ozcn.onrender.com/api"
});

export default api;