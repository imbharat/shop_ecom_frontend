import { useState, useCallback, useEffect, useMemo } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  Bars4Icon,
  ArrowUpOnSquareIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import styles from "./ProductsList.module.css";
import {
  GridCallbackDetails,
  GridRowParams,
  GridSelectionModel,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridValueOptionsParams,
  MuiEvent,
  ValueOptions,
} from "@mui/x-data-grid";
import { ODataGridColDef, FilterParameters, ODataRowModel } from "o-data-grid";
import AddEditProduct from "@/dialogs/Product/AddEditProduct";
import CommonDataGrid from "../CommonDataGrid/CommonDataGrid";
import ImportExcel from "@/dialogs/Shared/ImportExcel";
import { ODATA_URL } from "@/custom-hooks/useAxios";
import {
  deleteById,
  downloadToExcel,
  getById,
} from "@/services/shared.service";
import SellProduct from "@/dialogs/Product/SellProducts";
import {
  ExportToExcel,
  NumberOrDateFilterOperators,
  saveGrid,
} from "@/utils/UtilFunctions";
import {
  Autocomplete,
  Button,
  Fade,
  Grid,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  BulkAddProducts,
  BulkMoveProducts,
  BulkSellProducts,
} from "@/types/Types";
import CustomAutocompleteCell from "../CustomAutocompleteCell/CustomAutocompleteCell";

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
    field: "products.cost_price",
    headerName: "Cost Price",
    editable: true,
    headerClassName: "grid-header",
    type: "number",
    filterOperators: NumberOrDateFilterOperators(),
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
    field: "locations.location_name",
    headerName: "Location",
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
    field: "products.created_at",
    headerName: "Created On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "datetime",
    filterOperators: NumberOrDateFilterOperators(),
  },
  {
    field: "products.updated_at",
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
  "products.product_name": true,
  "products.cost_price": true,
  "types.type_name": false,
  "categories.category_name": false,
  "products.barcode": { xs: false, md: true },
  "products.imei": { xs: false, xl: true },
  "vendors.vendor_name": { xs: false, md: true },
  "physical_qc.qc_name": { xs: false, xl: true },
  "screen_qc.qc_name": { xs: false, xl: true },
  "products.ram": { xs: false, xl: true },
  "products.storage": { xs: false, xl: true },
  "locations.location_name": true,
  "users_created_by.user_name": { xs: false, xl: true },
  "users_modified_by.user_name": false,
  "products.created_at": { xs: false, sm: true },
  "products.updated_at": false,
};

const alwaysSelect = ["products.product_id"];

const component = "Products";

const getData = async (uri: string) => {
  const response = await getById(uri);
  return response?.data?.value;
};

const exportToExcel = async (currentFilter: string, currentSorting: string) => {
  const result = await downloadToExcel(
    component.toLowerCase(),
    currentFilter,
    currentSorting
  );
  if (result?.data?.value?.length) {
    ExportToExcel(component, "xlsx", result.data.value);
  }
};

function ProductsList() {
  const [dialogs, setDialogs] = useState({
    addDialog: false,
    editDialog: false,
    sellDialog: false,
  });
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [currentSorting, setCurrentSorting] = useState<string>("");
  const [cols, setCols] = useState(columns);
  const [fixedCols] = useState(columns);

  const deleteProduct = async () => {
    const id = selectedRows as unknown as number;
    const result = await deleteById(component.toLowerCase(), id);
    if (result?.data?.count === 1) {
      refreshGrid();
    }
  };

  const resetDialogs = () => {
    setDialogs({
      addDialog: false,
      editDialog: false,
      sellDialog: false,
    });
  };

  const refreshGrid = () => setCols((prev) => [...prev]);

  const saveChanges = async (
    newRow: ODataRowModel<any>,
    oldRow: ODataRowModel<any>
  ) => {
    const { result: n, ...nextData } = newRow;
    const { "products.product_id": id } = oldRow;
    const updated = await saveGrid(id, nextData, "/products");
    return updated ? newRow : oldRow;
  };

  const CustomToolbar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

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
                <>
                  {!dialogs.addDialog && (
                    <span
                      onClick={() =>
                        setDialogs((prev) => ({
                          ...prev,
                          addDialog: true,
                        }))
                      }
                    >
                      Add Product
                    </span>
                  )}
                  {dialogs.addDialog && (
                    <AddEditProduct
                      isEdit={false}
                      successCallback={refreshGrid}
                      resetDialogs={resetDialogs}
                    />
                  )}
                </>
              </span>
              <span className={styles.options}>
                <Bars4Icon className="w-5" />
                <Button
                  disableRipple
                  id="bulk-action-button"
                  aria-controls={open ? "bulk-action-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  Bulk Actions
                </Button>
                <Menu
                  id="bulk-action-menu"
                  MenuListProps={{
                    "aria-labelledby": "bulk-action-button",
                  }}
                  sx={{
                    position: "absolute",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem>
                    <ImportExcel<BulkAddProducts>
                      name="Add"
                      submitUrl="/products/import"
                      successCallback={refreshGrid}
                      initialValues={{
                        data: [
                          {
                            product_name: "",
                            cost_price: 0,
                            barcode: "",
                            imei: "",
                            vendor: "",
                          },
                        ],
                        errors: [],
                      }}
                    />
                  </MenuItem>
                  <MenuItem>
                    <ImportExcel<BulkMoveProducts>
                      name="Move"
                      submitUrl="/products/bulkmove"
                      successCallback={refreshGrid}
                      initialValues={{
                        data: [
                          {
                            product_id: 0,
                            product_name: "",
                            barcode: "",
                            imei: "",
                            location: "",
                          },
                        ],
                        errors: [],
                      }}
                    />
                  </MenuItem>
                  <MenuItem>
                    <ImportExcel<BulkSellProducts>
                      name="Sell"
                      submitUrl="/products/bulksell"
                      successCallback={refreshGrid}
                      initialValues={{
                        data: [
                          {
                            product_id: 0,
                            product_name: "",
                            barcode: "",
                            imei: "",
                            cost_price: 0,
                            sell_price: 0,
                            customer_name: "",
                            location: "",
                          },
                        ],
                        errors: [],
                      }}
                    />
                  </MenuItem>
                </Menu>
              </span>

              <span
                className={styles.options}
                onClick={() => exportToExcel(currentFilter, currentSorting)}
              >
                <ArrowUpOnSquareIcon className="w-5" />
                Export to Excel
              </span>
            </>
          )}
          {selectedRows.length === 1 && (
            <>
              <span className={styles.options}>
                <PencilSquareIcon className="w-5" />
                <>
                  {!dialogs.editDialog && (
                    <span
                      onClick={() =>
                        setDialogs((prev) => ({
                          ...prev,
                          editDialog: true,
                        }))
                      }
                    >
                      Edit Product
                    </span>
                  )}
                  {dialogs.editDialog && (
                    <AddEditProduct
                      isEdit={true}
                      successCallback={refreshGrid}
                      resetDialogs={resetDialogs}
                      idArray={selectedRows as unknown as number[]}
                    />
                  )}
                </>
              </span>
              <span className={styles.options} onClick={deleteProduct}>
                <TrashIcon className="w-5" />
                Delete Product
              </span>
            </>
          )}
          {selectedRows.length >= 1 && (
            <>
              <span className={styles.options} onClick={() => {}}>
                <CreditCardIcon className="w-5" />
                <>
                  {!dialogs.sellDialog && (
                    <span
                      onClick={() =>
                        setDialogs((prev) => ({
                          ...prev,
                          sellDialog: true,
                        }))
                      }
                    >
                      {`Sell ${
                        selectedRows.length > 1 ? "Products" : "Product"
                      }`}
                    </span>
                  )}
                  {dialogs.sellDialog && (
                    <SellProduct
                      initialValues={{
                        customer_name: "",
                        products: [],
                      }}
                      successCallback={refreshGrid}
                      resetDialogs={resetDialogs}
                      idArray={selectedRows as unknown as number[]}
                    />
                  )}
                </>
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

  // useEffect(() => {
  //   const loadLocations = async () => {
  //     const locations = await getData("/locations");
  //     setMasterData((prev) => ({
  //       ...prev,
  //       locations,
  //     }));
  //   };
  //   loadLocations();
  // }, []);

  // useEffect(() => {
  //   const loadVendors = async () => {
  //     const vendors = await getData("/vendors");
  //     setMasterData((prev) => ({
  //       ...prev,
  //       vendors,
  //     }));
  //   };
  //   loadVendors();
  // }, []);

  return (
    <CommonDataGrid
      header={component}
      url={`${ODATA_URL}/products`}
      columns={cols}
      fixedColumns={columns}
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

export default ProductsList;
