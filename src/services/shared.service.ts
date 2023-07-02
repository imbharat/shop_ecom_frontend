import { API_URL } from "@/custom-hooks/useAxios";
import axios from "axios";

export const postFormData = async (payload: any, uri: string) => {
  return await axios.post(`${API_URL}${uri}`, payload);
};
