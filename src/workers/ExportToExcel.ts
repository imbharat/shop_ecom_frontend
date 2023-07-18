import { Workbook } from "exceljs";

const createFile = async (
  sheet_name: string,
  file_type: string,
  json_data: Array<Object>
) => {
  try {
    switch (file_type) {
      case "xlsx":
        const columns = [];
        for (let col in json_data?.[0]) {
          columns.push({ header: col, key: col });
        }
        const workbook = new Workbook();
        const sheet = workbook.addWorksheet(sheet_name);
        sheet.columns = columns;
        sheet.addRows(json_data);
        const xlsx_buffer = await workbook.xlsx.writeBuffer();
        const xlsx_blob = new Blob([xlsx_buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
        });
        self.postMessage({
          msg: "success",
          blob: xlsx_blob,
        });
        break;
      case "csv":
        self.postMessage({
          msg: "success",
          blob: Blob,
        });
        break;
    }
  } catch (ex) {
    self.postMessage({
      msg: "error",
      err: ex as string,
    });
  }
};

self.onmessage = (message) => {
  const { data } = message;
  const { action, sheet_name, file_type, json_data } = data;
  switch (action) {
    case "export":
      createFile(sheet_name, file_type, json_data);
      break;
    default:
      console.log("Invalid Operation");
      break;
  }
};

export default Object;
