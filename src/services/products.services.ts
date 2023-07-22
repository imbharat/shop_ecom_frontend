import { API_URL } from "@/custom-hooks/useAxios";
import axios from "axios";

export const returnProductsById = async (
  payload: {
    product_id: number[];
  },
  uri: string
) => {
  return await axios.post(`${API_URL}${uri}`, payload);
};
