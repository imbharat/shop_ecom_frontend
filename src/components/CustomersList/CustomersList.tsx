import { useState, useCallback } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";

import styles from "./CustomersList.module.css";
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
import AddEditCustomer from "@/dialogs/Customer/AddEditCustomer";
import CommonDataGrid from "../CommonDataGrid/CommonDataGrid";
import { ODATA_URL } from "@/custom-hooks/useAxios";
import {
  deleteById,
  downloadToExcel,
  updateById,
} from "@/services/shared.service";
import {
  ExportToExcel,
  NumberOrDateFilterOperators,
  saveGrid,
} from "@/utils/UtilFunctions";

const getFormattedDate = (date: string) => new Date(date).toDateString();

let columns: ODataGridColDef[] = [
  {
    field: "customers.customer_name",
    headerName: "Name",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "customers.address",
    headerName: "Address",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "customers.city",
    headerName: "City",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "customers.pincode",
    headerName: "Pincode",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "customers.state",
    headerName: "State",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "customers.country",
    headerName: "Country",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "customers.email",
    headerName: "Email",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "customers.phone",
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
    field: "customers.created_at",
    headerName: "Created On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "datetime",
    filterOperators: NumberOrDateFilterOperators(),
  },
  {
    field: "customers.updated_at",
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
  "customers.customer_name": true,
  "customers.address": false,
  "customers.city": true,
  "customers.pincode": true,
  "customers.state": true,
  "customers.country": { xs: false, md: true },
  "customers.email": { xs: false, xl: true },
  "customers.phone": { xs: false, md: true },
  "users_created_by.user_name": { xs: false, xl: true },
  "users_modified_by.user_name": false,
  "customers.created_at": { xs: false, sm: true },
  "customers.updated_at": false,
};

const alwaysSelect = ["customers.customer_id"];

const component = "Customers";

function CustomersList() {
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [cols, setCols] = useState(columns);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [currentSorting, setCurrentSorting] = useState<string>("");

  const deleteCustomer = async () => {
    const id = selectedRows as unknown as number;
    const result = await deleteById("customers", id);
    if (result?.data?.count === 1) {
      refreshGrid();
    }
  };

  const refreshGrid = () => setCols((prev) => [...prev]);

  const saveChanges = async (params: GridRowEditStopParams) => {
    saveGrid(params, "/customers", refreshGrid);
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
                <AddEditCustomer isEdit={false} successCallback={refreshGrid} />
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
                <AddEditCustomer isEdit={true} successCallback={refreshGrid} />
              </span>
              <span className={styles.options} onClick={deleteCustomer}>
                <TrashIcon className="w-5" />
                Delete Customer
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
      url={`${ODATA_URL}/customers`}
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

export default CustomersList;
