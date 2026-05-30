import axios from "axios";

// ✅ Base URL de ton backend Django
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
