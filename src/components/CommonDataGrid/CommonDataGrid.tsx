import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  ODataGrid,
  ODataGridColDef,
  ODataRowModel,
  ODataColumnVisibilityModel,
  FilterParameters,
  ExternalBuilderProps,
} from "o-data-grid";
import PreventSSR from "../PreventSSR/PreventSSR";
import {
  GridCallbackDetails,
  GridRowParams,
  GridSelectionModel,
  GridSortModel,
  MuiEvent,
} from "@mui/x-data-grid";

const filterBuilderProps: ExternalBuilderProps<any> = {
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
        color: "var(--form-placeholder-color)",
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
    adapterLocale: "en",
  },
  onSubmit: (params: FilterParameters) => {},
};

type Props = {
  url: string;
  columns: ODataGridColDef[];
  refreshData: boolean;
  fixedColumns: ODataGridColDef[];
  header: string;
  selectedRows: GridSelectionModel;
  alwaysSelect: string[];
  onFilterSubmit: (params: FilterParameters) => void;
  setSelectedRows: (selectedRows: GridSelectionModel) => void;
  CustomToolbar: () => JSX.Element;
  columnVisibilityModel: ODataColumnVisibilityModel;
  onSortingChange: (model: GridSortModel) => void;
  saveChanges?:
    | ((
        newRow: ODataRowModel<any>,
        oldRow: ODataRowModel<any>
      ) => ODataRowModel<any> | Promise<ODataRowModel<any>>)
    | undefined;
};

function CommonDataGrid({
  url,
  columns,
  refreshData,
  fixedColumns,
  header,
  alwaysSelect,
  saveChanges,
  onFilterSubmit,
  selectedRows,
  CustomToolbar,
  setSelectedRows,
  onSortingChange,
  columnVisibilityModel,
}: Props) {
  const rowSelection = (selectionModel: GridSelectionModel) => {
    setSelectedRows(selectionModel);
  };

  // adding prop on same object instead of shallow copy, to prevent re-render of filter builder
  filterBuilderProps.onSubmit = onFilterSubmit;

  return (
    <div className="grid-container">
      <h3
        className="mb-4"
        style={{
          borderBottom: "0.15rem solid var(--primary-color)",
        }}
      >
        {header}
      </h3>
      <PreventSSR>
        <ODataGrid
          url={url}
          refreshData={refreshData}
          checkboxSelection
          disableColumnMenu
          editMode="row"
          sx={{
            overflowX: "auto",
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "var(--secondary-color)",
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "white",
            },
            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: "var(--secondary-color)",
            },
          }}
          getRowId={(row) => row[alwaysSelect[0]]}
          columns={columns}
          fixedColumns={fixedColumns}
          defaultPageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onSelectionModelChange={rowSelection}
          selectionModel={selectedRows}
          alwaysSelect={alwaysSelect}
          columnVisibilityModel={columnVisibilityModel}
          processRowUpdate={saveChanges}
          experimentalFeatures={{ newEditingApi: true }}
          onSortModelChange={onSortingChange}
          components={{
            Toolbar: CustomToolbar,
          }}
          filterBuilderProps={filterBuilderProps}
        />
      </PreventSSR>
    </div>
  );
}

export default CommonDataGrid;
