import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
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

const columns: ODataGridColDef[] = [
  {
    field: "products.product_name",
    headerName: "Name",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "products.cost_price",
    headerName: "Cost Price",
    editable: true,
    headerClassName: "grid-header",
    type: "number",
    flex: 1,
    caseSensitive: true,
    filterOperators: NumberOrDateFilterOperators(),
  },
  {
    field: "types.type_name",
    headerName: "Type",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "categories.category_name",
    headerName: "Category",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "products.barcode",
    headerName: "Bar Code",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "products.imei",
    headerName: "IMEI",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "vendors.vendor_name",
    headerName: "Vendor",
    editable: true,
    headerClassName: "grid-header",
    type: "singleSelect",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "physical_qc.qc_name",
    headerName: "Physical QC",
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "screen_qc.qc_name",
    headerName: "Screen QC",
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "products.ram",
    headerName: "RAM (GB)",
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "products.storage",
    headerName: "Storage (GB)",
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "locations.location_name",
    headerName: "Location",
    editable: true,
    headerClassName: "grid-header",
    type: "singleSelect",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "users_created_by.user_name",
    headerName: "Created By",
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "users_modified_by.user_name",
    headerName: "Modified By",
    headerClassName: "grid-header",
    type: "string",
    flex: 1,
    caseSensitive: true,
  },
  {
    field: "products.created_at",
    headerName: "Created On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "datetime",
    flex: 1,
    caseSensitive: true,
    filterOperators: NumberOrDateFilterOperators(),
  },
  {
    field: "products.updated_at",
    headerName: "Updated On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "datetime",
    flex: 1,
    caseSensitive: true,
    filterOperators: NumberOrDateFilterOperators(),
  },
];

const columnVisibilityModel = {
  "products.product_name": true,
  "products.cost_price": false,
  "types.type_name": false,
  "categories.category_name": false,
  "products.barcode": { xs: false, md: false },
  "products.imei": { xs: false, xl: false },
  "vendors.vendor_name": { xs: false, md: true },
  "physical_qc.qc_name": { xs: false, xl: false },
  "screen_qc.qc_name": { xs: false, xl: false },
  "products.ram": { xs: false, xl: false },
  "products.storage": { xs: false, xl: false },
  "locations.location_name": true,
  "users_created_by.user_name": { xs: false, xl: false },
  "users_modified_by.user_name": true,
  "products.created_at": { xs: false, sm: false },
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

const updateSelectColumns = (
  colOptions: {
    [field: string]: {
      dbField: string;
      data: {
        [dbField: string]: string;
      }[];
    };
  },
  setCols: Dispatch<SetStateAction<ODataGridColDef[]>>,
  setFilterBuilderCols: Dispatch<SetStateAction<ODataGridColDef[]>>
) => {
  const updatedColumns = columns.reduce(
    (columnsDef: ODataGridColDef[], col: ODataGridColDef) => {
      const colDef = { ...col };
      if (col.field in colOptions) {
        const colOptionsMap = colOptions[col.field];
        colDef.valueOptions = colOptions[col.field].data.map(
          (row) => row[colOptionsMap.dbField]
        );
      }
      return [...columnsDef, colDef];
    },
    []
  );
  setCols(updatedColumns);
  setFilterBuilderCols(updatedColumns);
};

function ProductsList() {
  const [refreshData, setRefreshData] = useState(false);
  const [dialogs, setDialogs] = useState({
    addDialog: false,
    editDialog: false,
    sellDialog: false,
    bulkAddDialog: false,
    bulkMoveDialog: false,
    bulkSellDialog: false,
  });
  const [dataLoaded, setDataLoaded] = useState({
    locations: false,
    vendors: false,
  });
  const [masterData, setMasterData] = useState({
    locations: [],
    vendors: [],
  });
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [currentSorting, setCurrentSorting] = useState<string>("");

  const [cols, setCols] = useState(columns);
  const [filterBuilderCols, setFilterBuilderCols] = useState(columns);

  useEffect(() => {
    const isReady = dataLoaded.locations && dataLoaded.vendors;
    if (isReady) {
      updateSelectColumns(
        {
          "locations.location_name": {
            dbField: "location_name",
            data: masterData.locations,
          },
          "vendors.vendor_name": {
            dbField: "vendor_name",
            data: masterData.vendors,
          },
        },
        setCols,
        setFilterBuilderCols
      );
    }
  }, [dataLoaded, masterData]);

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
      bulkAddDialog: false,
      bulkMoveDialog: false,
      bulkSellDialog: false,
    });
  };

  const refreshGrid = () => {
    setCols((prev) => [...prev]);
    setRefreshData(true);
  };

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
                    {!dialogs.bulkAddDialog && (
                      <span
                        onClick={() =>
                          setDialogs((prev) => ({
                            ...prev,
                            bulkAddDialog: true,
                          }))
                        }
                      >
                        Add
                      </span>
                    )}
                    {dialogs.bulkAddDialog && (
                      <ImportExcel<BulkAddProducts>
                        name="Add"
                        submitUrl="/products/import"
                        successCallback={refreshGrid}
                        resetDialogs={resetDialogs}
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
                    )}
                  </MenuItem>
                  <MenuItem>
                    {!dialogs.bulkMoveDialog && (
                      <span
                        onClick={() =>
                          setDialogs((prev) => ({
                            ...prev,
                            bulkMoveDialog: true,
                          }))
                        }
                      >
                        Move
                      </span>
                    )}
                    {dialogs.bulkMoveDialog && (
                      <ImportExcel<BulkMoveProducts>
                        name="Move"
                        submitUrl="/products/bulkmove"
                        successCallback={refreshGrid}
                        resetDialogs={resetDialogs}
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
                    )}
                  </MenuItem>
                  <MenuItem>
                    {!dialogs.bulkSellDialog && (
                      <span
                        onClick={() =>
                          setDialogs((prev) => ({
                            ...prev,
                            bulkSellDialog: true,
                          }))
                        }
                      >
                        Sell
                      </span>
                    )}
                    {dialogs.bulkSellDialog && (
                      <ImportExcel<BulkSellProducts>
                        name="Sell"
                        submitUrl="/products/bulksell"
                        successCallback={refreshGrid}
                        resetDialogs={resetDialogs}
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
                    )}
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

  useEffect(() => {
    const loadLocations = async () => {
      const locations = await getData("/locations");
      setMasterData((prev) => ({
        ...prev,
        locations,
      }));
      setDataLoaded((prev) => ({
        ...prev,
        locations: true,
      }));
    };
    loadLocations();
  }, []);

  useEffect(() => {
    const loadVendors = async () => {
      const vendors = await getData("/vendors");
      setMasterData((prev) => ({
        ...prev,
        vendors,
      }));
      setDataLoaded((prev) => ({
        ...prev,
        vendors: true,
      }));
    };
    loadVendors();
  }, []);

  return (
    <CommonDataGrid
      header={component}
      url={`${ODATA_URL}/products`}
      columns={cols}
      refreshData={refreshData}
      fixedColumns={filterBuilderCols}
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
