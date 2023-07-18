import { saveAs } from "file-saver";
import { Operation } from "o-data-grid";

export const NumberFieldFilterOperators = () =>
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
