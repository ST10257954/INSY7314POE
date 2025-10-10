import axios from "axios";
const BASE = "https://localhost:3443/v1";

export async function makePayment(data) {
  const token = localStorage.getItem("token");
  return axios.post("https://localhost:3443/v1/payments", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
