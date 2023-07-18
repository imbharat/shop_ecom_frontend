import { useState, useCallback } from "react";
import {
  ArrowUpOnSquareIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

import styles from "./OrdersList.module.css";
import { useRouter } from "next/router";
import {
  GridSelectionModel,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { ODataGridColDef, FilterParameters } from "o-data-grid";
import CommonDataGrid from "../CommonDataGrid/CommonDataGrid";
import { ODATA_URL } from "@/custom-hooks/useAxios";
import {
  ExportToExcel,
  NumberFieldFilterOperators,
} from "@/utils/UtilFunctions";
import { downloadToExcel } from "@/services/shared.service";

const getFormattedDate = (date: string) => new Date(date).toDateString();

let columns: ODataGridColDef[] = [
  {
    field: "orders.order_id",
    headerName: "Invoice",
    valueFormatter: (params) =>
      `IN${"0".repeat(10 - params.value.toString().length)}${params.value}`,
    headerClassName: "grid-header",
    type: "number",
    filterOperators: NumberFieldFilterOperators(),
    align: "left",
    headerAlign: "left",
  },
  {
    field: "customers.customer_name",
    headerName: "Customer",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "orders.net",
    headerName: "Net",
    headerClassName: "grid-header",
    cellClassName: (params) => (params.value > 0 ? "profit" : "loss"),
    type: "number",
    filterOperators: NumberFieldFilterOperators(),
  },
  {
    field: "orders.quantity",
    headerName: "Quantity",
    headerClassName: "grid-header",
    type: "number",
    filterOperators: NumberFieldFilterOperators(),
  },
  {
    field: "orders.type",
    headerName: "Type",
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
    field: "orders.created_at",
    headerName: "Created On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "date",
  },
  {
    field: "orders.updated_at",
    headerName: "Updated On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "date",
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
  "orders.order_id": true,
  "customers.customer_name": true,
  "orders.net": true,
  "orders.quantity": false,
  "orders.type": { xs: false, md: true },
  "users_created_by.user_name": { xs: false, xl: true },
  "users_modified_by.user_name": false,
  "orders.created_at": { xs: false, sm: true },
  "orders.updated_at": false,
};

const alwaysSelect = ["orders.order_id"];

const component = "Orders";

function OrdersList() {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [cols] = useState(columns);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [currentSorting, setCurrentSorting] = useState<string>("");

  const viewDetails = async () => {
    const id = selectedRows as unknown as number;
    router.push(`/orders/${id}`, undefined, {
      shallow: true,
    });
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
              <span className={styles.options} onClick={exportToExcel}>
                <ArrowUpOnSquareIcon className="w-5" />
                Export to Excel
              </span>
            </>
          )}
          {selectedRows.length === 1 && (
            <>
              <span className={styles.options} onClick={viewDetails}>
                <DocumentMagnifyingGlassIcon className="w-5" />
                View Details
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
      url={`${ODATA_URL}/orders`}
      columns={cols}
      selectedRows={selectedRows}
      alwaysSelect={alwaysSelect}
      setSelectedRows={setSelectedRows}
      CustomToolbar={CustomToolbar}
      columnVisibilityModel={columnVisibilityModel}
      onFilterSubmit={onFilterSubmit}
      onSortingChange={onSortingChange}
    />
  );
}

export default OrdersList;
