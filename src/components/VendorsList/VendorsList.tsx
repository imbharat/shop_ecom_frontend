import { useState, useCallback } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";

import styles from "./VendorsList.module.css";
import {
  GridRowEditStopParams,
  GridSelectionModel,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { ODataGridColDef, FilterParameters } from "o-data-grid";
import AddEditVendor from "@/dialogs/Vendor/AddEditVendor";
import CommonDataGrid from "../CommonDataGrid/CommonDataGrid";
import { ODATA_URL } from "@/custom-hooks/useAxios";
import { deleteById, downloadToExcel } from "@/services/shared.service";
import {
  ExportToExcel,
  NumberOrDateFilterOperators,
  saveGrid,
} from "@/utils/UtilFunctions";

const getFormattedDate = (date: string) => new Date(date).toDateString();

let columns: ODataGridColDef[] = [
  {
    field: "vendors.vendor_name",
    headerName: "Name",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.address",
    headerName: "Address",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.city",
    headerName: "City",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.pincode",
    headerName: "Pincode",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.state",
    headerName: "State",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.country",
    headerName: "Country",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.email",
    headerName: "Email",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.phone",
    headerName: "Phone",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users_created_by.user_name",
    headerName: "Created By",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users_modified_by.user_name",
    headerName: "Modified By",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.created_at",
    headerName: "Created On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "datetime",
    filterOperators: NumberOrDateFilterOperators(),
  },
  {
    field: "vendors.updated_at",
    headerName: "Updated On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "datetime",
    filterOperators: NumberOrDateFilterOperators(),
  },
];

columns = columns.map((col) => {
  return {
    flex: 1,
    caseSensitive: true,
    // minWidth: "4rem",
    // maxWidth: "6rem",
    ...col,
  };
});

const columnVisibilityModel = {
  "vendors.vendor_name": true,
  "vendors.address": false,
  "vendors.city": true,
  "vendors.pincode": true,
  "vendors.state": true,
  "vendors.country": { xs: false, md: true },
  "vendors.email": { xs: false, xl: true },
  "vendors.phone": { xs: false, md: true },
  "users_created_by.user_name": { xs: false, xl: true },
  "users_modified_by.user_name": false,
  "vendors.created_at": { xs: false, sm: true },
  "vendors.updated_at": false,
};

const alwaysSelect = ["vendors.vendor_id"];

const component = "Vendors";

function VendorsList() {
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [cols, setCols] = useState(columns);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [currentSorting, setCurrentSorting] = useState<string>("");

  const deleteVendor = async () => {
    const id = selectedRows as unknown as number;
    const result = await deleteById("vendors", id);
    if (result?.data?.count === 1) {
      refreshGrid();
    }
  };

  const refreshGrid = () => setCols((prev) => [...prev]);

  const saveChanges = async (params: GridRowEditStopParams) => {
    saveGrid(params, "/vendors", refreshGrid);
  };

  const exportToExcel = async () => {
    const result = await downloadToExcel(
      component.toLowerCase(),
      currentFilter,
      currentSorting
    );
    if (result?.data?.value?.length) {
      ExportToExcel(component, "xlsx", result.data.value);
    }
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer
        style={{
          justifyContent: "space-between",
          padding: "0.5rem 1rem 0.5rem 0.1rem",
          borderBottom: "0.05rem solid var(--form-input-color)",
          background: "var(--form-input-color)",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {selectedRows.length === 0 && (
            <>
              <span className={styles.options}>
                <PlusCircleIcon className="w-5" />
                <AddEditVendor isEdit={false} successCallback={refreshGrid} />
              </span>
              <span className={styles.options} onClick={exportToExcel}>
                <ArrowUpOnSquareIcon className="w-5" />
                Export to Excel
              </span>
            </>
          )}
          {selectedRows.length === 1 && (
            <>
              <span className={styles.options}>
                <PencilSquareIcon className="w-5" />
                <AddEditVendor isEdit={true} successCallback={refreshGrid} />
              </span>
              <span className={styles.options} onClick={deleteVendor}>
                <TrashIcon className="w-5" />
                Delete Vendor
              </span>
            </>
          )}
        </div>
        <div
          style={{
            margin: "auto 0.5rem",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </div>
      </GridToolbarContainer>
    );
  };

  const onSortingChange = (model: GridSortModel) => {
    if (model?.length) {
      setCurrentSorting(`${model[0].field} ${model[0].sort}`);
    } else {
      setCurrentSorting("");
    }
  };

  const onFilterSubmit = useCallback((params: FilterParameters) => {
    setCurrentFilter(params.filter);
  }, []);

  return (
    <CommonDataGrid
      header={component}
      url={`${ODATA_URL}/vendors`}
      columns={cols}
      selectedRows={selectedRows}
      alwaysSelect={alwaysSelect}
      setSelectedRows={setSelectedRows}
      CustomToolbar={CustomToolbar}
      columnVisibilityModel={columnVisibilityModel}
      saveChanges={saveChanges}
      onFilterSubmit={onFilterSubmit}
      onSortingChange={onSortingChange}
    />
  );
}

export default VendorsList;
