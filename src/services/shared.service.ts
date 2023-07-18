import { API_URL, ODATA_URL } from "@/custom-hooks/useAxios";
import axios from "axios";

export const postFormData = async (payload: any, uri: string) => {
  return await axios.post(`${API_URL}${uri}`, payload);
};

export const deleteById = async (resource: string, id: number) => {
  return await axios.delete(`${API_URL}/${resource}/${id}`);
};

export const downloadToExcel = async (
  resource: string,
  filter: string,
  sort: string
) => {
  return await axios.get(
    `${ODATA_URL}/${resource}/export?$filter=${filter}&$orderby=${sort}`
  );
};
