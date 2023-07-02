import { API_URL } from "@/custom-hooks/useAxios";
import axios from "axios";

export const getTopLocations = async () => {
  const response = await axios.get(`${API_URL}/locations/top`);
  return response.data;
};
