import { API_URL, ODATA_URL } from "@/custom-hooks/useAxios";
import axios from "axios";

export const getById = async (uri: string, filter?: string) => {
  return await axios.get(
    `${ODATA_URL}${uri}${filter ? `${filter}&` : "?"}$count=false`
  );
};

export const postFormData = async (payload: any, uri: string) => {
  return await axios.post(`${API_URL}${uri}`, payload);
};

export const updateById = async (id: number, payload: Object, uri: string) => {
  return await axios.put(`${API_URL}${uri}/${id}`, payload);
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
