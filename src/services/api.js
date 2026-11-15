import axios from "axios";

const api = axios.create({
  baseURL: "https://hotelbooking-backend-2-zjyw.onrender.com",
});

export default api;