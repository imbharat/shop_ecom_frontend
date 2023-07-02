import axios from "axios";
import { useRouter } from "next/router";

export const API_URL = "http://192.168.29.126:4000/api/v1";
export const ODATA_URL = "http://192.168.29.126:4000/odata/v1";

function useAxios() {
  const router = useRouter();

  axios.interceptors.request.use((config) => {
    //   const token = localStorageService.getAccessToken();
    //   if (token) {
    //     config.headers["Authorization"] = "Bearer " + token;
    //   }
    config.headers["Content-Type"] = "application/json";
    return config;
  });

  //   server.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       const originalRequest = error.config;

  //       if (
  //         error.response.status === 401 &&
  //         originalRequest.url === "http://127.0.0.1:3000/v1/auth/token"
  //       ) {
  //         router.push("/login");
  //         return Promise.reject(error);
  //       }

  //       if (error.response.status === 401 && !originalRequest._retry) {
  //         originalRequest._retry = true;
  //         const refreshToken = localStorageService.getRefreshToken();
  //         return axios
  //           .post("/auth/token", {
  //             refresh_token: refreshToken,
  //           })
  //           .then((res) => {
  //             if (res.status === 201) {
  //               localStorageService.setToken(res.data);
  //               axios.defaults.headers.common["Authorization"] =
  //                 "Bearer " + localStorageService.getAccessToken();
  //               return axios(originalRequest);
  //             }
  //           });
  //       }
  //       return Promise.reject(error);
  //     }
  //   );
}

export default useAxios;
