import { useState, useCallback } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";

import styles from "./LocationsList.module.css";
import {
  GridSelectionModel,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { ODataGridColDef, FilterParameters, ODataRowModel } from "o-data-grid";
import AddEditLocation from "@/dialogs/Location/AddEditLocation";
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
    field: "locations.location_name",
    headerName: "Name",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "locations.address",
    headerName: "Address",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "locations.city",
    headerName: "City",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "locations.pincode",
    headerName: "Pincode",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "locations.state",
    headerName: "State",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "locations.country",
    headerName: "Country",
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
    field: "locations.created_at",
    headerName: "Created On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "datetime",
    filterOperators: NumberOrDateFilterOperators(),
  },
  {
    field: "locations.updated_at",
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
  "locations.location_name": true,
  "locations.address": false,
  "locations.city": true,
  "locations.pincode": true,
  "locations.state": true,
  "locations.country": { xs: false, md: true },
  "users_created_by.user_name": { xs: false, xl: true },
  "users_modified_by.user_name": false,
  "locations.created_at": { xs: false, sm: true },
  "locations.updated_at": false,
};

const alwaysSelect = ["locations.location_id"];

const component = "Locations";

function LocationsList() {
  const [dialogs, setDialogs] = useState({
    addDialog: false,
    editDialog: false,
  });
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [cols, setCols] = useState(columns);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [currentSorting, setCurrentSorting] = useState<string>("");

  const deleteLocation = async () => {
    const id = selectedRows as unknown as number;
    const result = await deleteById("locations", id);
    if (result?.data?.count === 1) {
      refreshGrid();
    }
  };

  const resetDialogs = () => {
    setDialogs({
      addDialog: false,
      editDialog: false,
    });
  };

  const refreshGrid = () => setCols((prev) => [...prev]);

  const saveChanges = async (
    newRow: ODataRowModel<any>,
    oldRow: ODataRowModel<any>
  ) => {
    const { result: n, ...nextData } = newRow;
    const { "locations.location_id": id } = oldRow;
    const updated = await saveGrid(id, nextData, "/locations");
    return updated ? newRow : oldRow;
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
                      Add Location
                    </span>
                  )}
                  {dialogs.addDialog && (
                    <AddEditLocation
                      isEdit={false}
                      successCallback={refreshGrid}
                      resetDialogs={resetDialogs}
                    />
                  )}
                </>
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
                      Edit Location
                    </span>
                  )}
                  {dialogs.editDialog && (
                    <AddEditLocation
                      isEdit={true}
                      successCallback={refreshGrid}
                      resetDialogs={resetDialogs}
                      idArray={selectedRows as unknown as number[]}
                    />
                  )}
                </>
              </span>
              <span className={styles.options} onClick={deleteLocation}>
                <TrashIcon className="w-5" />
                Delete Location
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
      url={`${ODATA_URL}/locations`}
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

export default LocationsList;
