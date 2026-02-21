import axios from "axios";

const api = axios.create({
  baseURL: "https://codebase-qa-ozcn.onrender.com/api/repos"
});

export default api;