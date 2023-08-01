import { updateById } from "@/services/shared.service";
import { saveAs } from "file-saver";
import { Operation } from "o-data-grid";

export const NumberOrDateFilterOperators = () =>
  ["eq", "ne", "lt", "gt", "le", "ge", "null", "notnull"] as Operation[];

export const ExportToExcel = (
  component: string,
  file_type: string,
  data: Array<Object>
) => {
  const exportToExcel: Worker = new Worker(
    new URL("../workers/ExportToExcel.ts", import.meta.url)
  );
  exportToExcel.postMessage({
    action: "export",
    file_type: file_type,
    sheet_name: component,
    json_data: data,
  });
  exportToExcel.onmessage = (message) => {
    const { data } = message;
    const { err, msg, blob } = data;
    switch (msg) {
      case "success":
        saveAs(blob, `${component}.${file_type}`);
        break;
      case "error":
        console.log(err);
        break;
    }
    exportToExcel.terminate();
  };
};

export const saveGrid = async (
  id: number,
  nextData: {
    [key: string]: any;
  },
  resource: string
) => {
  const updatedValues: any = {};
  for (let field in nextData) {
    const dbField = field.substring(field.indexOf(".") + 1);
    updatedValues[dbField] = nextData[field];
  }
  if (Object.keys(updatedValues)) {
    const result = await updateById(id as number, updatedValues, resource);
    if (result?.data?.[0]) return true;
    return false;
  }
};
