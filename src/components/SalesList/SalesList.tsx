import { useState, useCallback } from "react";
import {
  ArrowUturnLeftIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";
import styles from "./SalesList.module.css";
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
import { downloadToExcel } from "@/services/shared.service";
import {
  ExportToExcel,
  NumberOrDateFilterOperators,
} from "@/utils/UtilFunctions";
import { returnProductsById } from "@/services/products.services";

const getFormattedDate = (date: string) => new Date(date).toDateString();

let columns: ODataGridColDef[] = [
  {
    field: "orders.order_id",
    headerName: "Invoice",
    valueFormatter: (params) =>
      `IN${"0".repeat(10 - params.value.toString().length)}${params.value}`,
    headerClassName: "grid-header",
    type: "number",
    filterOperators: NumberOrDateFilterOperators(),
    align: "left",
    headerAlign: "left",
  },
  {
    field: "products.product_name",
    headerName: "Name",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "customers.customer_name",
    headerName: "Customer",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "products.cost_price",
    headerName: "Cost Price",
    headerClassName: "grid-header",
    type: "number",
    filterOperators: NumberOrDateFilterOperators(),
  },
  {
    field: "products.sell_price",
    headerName: "Sell Price",
    headerClassName: "grid-header",
    type: "number",
    filterOperators: NumberOrDateFilterOperators(),
  },
  {
    field: "profit.loss.ui.field",
    headerName: "Profit/Loss",
    valueGetter: (params) =>
      params?.row["products.sell_price"] - params?.row["products.cost_price"] ||
      "",
    headerClassName: "grid-header",
    cellClassName: (params) => (params.value > 0 ? "profit" : "loss"),
    type: "number",
    select: "''",
    filterable: false,
    sortable: false,
  },
  {
    field: "types.type_name",
    headerName: "Type",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "categories.category_name",
    headerName: "Category",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "products.barcode",
    headerName: "Bar Code",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "products.imei",
    headerName: "IMEI",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.vendor_name",
    headerName: "Vendor",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "physical_qc.qc_name",
    headerName: "Physical QC",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "screen_qc.qc_name",
    headerName: "Screen QC",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "products.ram",
    headerName: "RAM",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "products.storage",
    headerName: "Storage",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users.user_name",
    headerName: "Sold By",
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "orders.created_at",
    headerName: "Sold On",
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
  "orders.order_id": true,
  "products.product_name": true,
  "customers.customer_name": true,
  "products.cost_price": { xl: true },
  "products.sell_price": true,
  "profit.loss.ui.field": true,
  "types.type_name": false,
  "categories.category_name": false,
  "products.barcode": { xs: false, md: true },
  "products.imei": { xs: false, xl: true },
  "vendors.vendor_name": false,
  "physical_qc.qc_name": false,
  "screen_qc.qc_name": false,
  "products.ram": false,
  "products.storage": false,
  "users.user_name": { xs: false, xl: true },
  "orders.created_at": { xs: false, sm: true },
};

const alwaysSelect = ["products.product_id"];

const component = "Sales";

function SalesList() {
  const [refreshData, setRefreshData] = useState(false);
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [cols, setCols] = useState(columns);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [currentSorting, setCurrentSorting] = useState<string>("");

  const refreshGrid = () => {
    setCols((prev) => [...prev]);
    setRefreshData(true);
  };

  const exportToExcel = async () => {
    const result = await downloadToExcel(
      `products/${component.toLowerCase()}`,
      currentFilter,
      currentSorting
    );
    if (result?.data?.value?.length) {
      ExportToExcel(component, "xlsx", result.data.value);
    }
  };

  const returnProducts = async () => {
    const ids = selectedRows as unknown as number[];
    const result = await returnProductsById(
      {
        product_id: [...ids],
      },
      "/products/return"
    );
    if (result?.data) {
      refreshGrid();
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
          {selectedRows.length >= 1 && (
            <>
              <span className={styles.options} onClick={returnProducts}>
                <ArrowUturnLeftIcon className="w-5" />
                Return {selectedRows.length > 1 ? `Products` : `Product`}
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
      url={`${ODATA_URL}/products/sales`}
      columns={cols}
      refreshData={refreshData}
      fixedColumns={columns}
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

export default SalesList;
