import React, { Dispatch, SetStateAction, useState } from "react";

import {
  ODataGrid,
  ODataGridColDef,
  ODataColumnVisibilityModel,
} from "o-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PreventSSR from "../PreventSSR/PreventSSR";
import { GridRowEditStopParams, GridSelectionModel } from "@mui/x-data-grid";

type Props = {
  url: string;
  columns: ODataGridColDef[];
  selectedRows: GridSelectionModel;
  alwaysSelect: string[];
  setSelectedRows: Dispatch<SetStateAction<GridSelectionModel>>;
  CustomToolbar: () => JSX.Element;
  columnVisibilityModel: ODataColumnVisibilityModel;
  saveChanges: (params: GridRowEditStopParams) => void;
};

function CommonDataGrid({
  url,
  columns,
  alwaysSelect,
  saveChanges,
  selectedRows,
  CustomToolbar,
  setSelectedRows,
  columnVisibilityModel,
}: Props) {
  const rowSelection = (selectionModel: GridSelectionModel) => {
    setSelectedRows(selectionModel);
  };
  return (
    <div className="grid-container">
      <h3
        className="mb-4"
        style={{
          borderBottom: "0.15rem solid var(--primary-color)",
        }}
      >
        Products
      </h3>
      <PreventSSR>
        <ODataGrid
          url={url}
          checkboxSelection
          disableColumnMenu
          editMode="row"
          density="compact"
          sx={{ overflowX: "auto" }}
          getRowId={(row) => row.product_id}
          columns={columns}
          defaultPageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onSelectionModelChange={rowSelection}
          selectionModel={selectedRows}
          alwaysSelect={alwaysSelect}
          columnVisibilityModel={columnVisibilityModel}
          onRowEditStop={saveChanges}
          components={{
            Toolbar: CustomToolbar,
          }}
          filterBuilderProps={{
            textFieldProps: {
              size: "small",
              style: {
                background: "var(--form-input-color)",
              },
              inputProps: {
                style: {
                  fontFamily: "system-ui",
                },
              },
              InputLabelProps: {
                style: {
                  fontFamily: "system-ui",
                },
              },
            },
            selectProps: {
              size: "small",
              style: {
                background: "var(--form-input-color)",
              },
              inputProps: {
                style: {
                  fontFamily: "system-ui",
                },
              },
              SelectDisplayProps: {
                style: {
                  fontFamily: "system-ui",
                },
              },
            },
            localizationProviderProps: {
              dateAdapter: AdapterDayjs,
              adapterLocale: "en-gb",
            },
          }}
        />
      </PreventSSR>
    </div>
  );
}

export default CommonDataGrid;
