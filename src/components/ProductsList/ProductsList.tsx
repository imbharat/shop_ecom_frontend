import { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";

import styles from "./ProductsList.module.css";
import { useRouter } from "next/router";
import {
  GridRowEditStopParams,
  GridSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { ODataGridColDef } from "o-data-grid";
import AddEditProduct from "@/dialogs/Product/AddEditProduct";
import CommonDataGrid from "../CommonDataGrid/CommonDataGrid";
import ImportFromExcel from "@/dialogs/Shared/ImportFromExcel";
import { ODATA_URL } from "@/custom-hooks/useAxios";
import { deleteById } from "@/services/products.service";

const getFormattedDate = (date: string) => new Date(date).toDateString();

let columns: ODataGridColDef[] = [
  {
    field: "products.product_name",
    headerName: "Name",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "products.price",
    headerName: "Price",
    editable: true,
    headerClassName: "grid-header",
    type: "number",
  },
  {
    field: "types.type_name",
    headerName: "Type",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "categories.category_name",
    headerName: "Category",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "products.barcode",
    headerName: "Bar Code",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "products.imei",
    headerName: "IMEI",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "vendors.vendor_name",
    headerName: "Vendor",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "qc.qc_type",
    headerName: "QC Status",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "locations.location_name",
    headerName: "Location",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users_created_by.user_name",
    headerName: "Created By",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users_modified_by.user_name",
    headerName: "Modified By",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "products.created_at",
    headerName: "Created On",
    valueFormatter: (params) => getFormattedDate(params.value),
    editable: true,
    headerClassName: "grid-header",
    type: "date",
  },
  {
    field: "products.updated_at",
    headerName: "Updated On",
    valueFormatter: (params) => getFormattedDate(params.value),
    editable: true,
    headerClassName: "grid-header",
    type: "date",
  },
];

columns = columns.map((col) => {
  return {
    flex: 1,
    // minWidth: "4rem",
    // maxWidth: "6rem",
    ...col,
  };
});

const columnVisibilityModel = {
  "products.product_name": true,
  "products.price": true,
  "types.type_name": false,
  "categories.category_name": false,
  "products.barcode": { xs: false, md: true },
  "products.imei": { xs: false, xl: true },
  "vendors.vendor_name": { xs: false, md: true },
  "qc.qc_type": { xs: false, sm: true },
  "locations.location_name": true,
  "users_created_by.user_name": { xs: false, xl: true },
  "users_modified_by.user_name": false,
  "products.created_at": { xs: false, sm: true },
  "products.updated_at": false,
};

const alwaysSelect = ["product_id"];

function ProductsList() {
  const path = useRouter().asPath;
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [cols, setCols] = useState(columns);

  const deleteProduct = async () => {
    const id = selectedRows as unknown as number;
    const result = await deleteById(id);
    if (result?.data?.count === 1) {
      setSelectedRows([]);
      refreshGrid();
    }
  };

  const refreshGrid = () => setCols((prev) => [...prev]);

  useEffect(() => {
    console.log("rendered");
  });

  const saveChanges = async (params: GridRowEditStopParams) => {
    const { product_id, result, ...product } = params.row;
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
                <PlusCircleIcon className="w-5 h-5" />
                <AddEditProduct isEdit={false} successCallback={refreshGrid} />
              </span>
              <span className={styles.options}>
                <ArrowDownOnSquareIcon className="w-5 h-5" />
                <ImportFromExcel
                  submitUrl="/products/import"
                  initialValues={[]}
                  successCallback={refreshGrid}
                />
              </span>
            </>
          )}
          {selectedRows.length === 1 && (
            <>
              <span className={styles.options}>
                <PencilSquareIcon className="w-5 h-5" />
                <AddEditProduct isEdit={true} />
              </span>
              <span className={styles.options} onClick={deleteProduct}>
                <TrashIcon className="w-5 h-5" />
                Delete Product
              </span>
            </>
          )}
          {selectedRows.length >= 1 && (
            <>
              <span className={styles.options} onClick={() => {}}>
                <TrashIcon className="w-5 h-5" />
                Sell {selectedRows.length > 1 ? `Products` : `Product`}
              </span>
              <span className={styles.options}>
                <ArrowUpOnSquareIcon className="w-5 h-5" />
                Export to Excel
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

  return (
    <CommonDataGrid
      url={`${ODATA_URL}/products`}
      columns={cols}
      selectedRows={selectedRows}
      alwaysSelect={alwaysSelect}
      setSelectedRows={setSelectedRows}
      CustomToolbar={CustomToolbar}
      columnVisibilityModel={columnVisibilityModel}
      saveChanges={saveChanges}
    />
  );
}

export default ProductsList;
