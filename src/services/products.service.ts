import { API_URL } from "@/custom-hooks/useAxios";
import axios from "axios";

export const deleteById = async (id: number) => {
  return await axios.delete(`${API_URL}/products/${id}`);
};
