// Service: Handles secure payment requests from the frontend to the backend API (Gillis, et al., 2024).
import axios from "axios";
const BASE = "https://localhost:3443/v1";

// Create a new payment using the authenticated user's token
export async function makePayment(data) {
  const token = localStorage.getItem("token"); // Retrieve JWT from browser storage (Ibrahim, 2024)
  return axios.post("https://localhost:3443/v1/payments", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/*References
Ibrahim, M., 2024. What is a JWT? Understanding JSON Web Tokens. [Online] 
Available at: https://supertokens.com/blog/what-is-jwt
[Accessed 20 August 2025].

Gillis, A. S., Lutkevich, B. & Nolle, T., 2024. What is an API (application programming interface)?. [Online] 
Available at: https://www.techtarget.com/searchapparchitecture/definition/application-program-interface-API
[Accessed 24 August 2025].

*/