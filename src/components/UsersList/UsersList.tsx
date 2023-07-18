import { useState, useCallback } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";

import styles from "./UsersList.module.css";
import { useRouter } from "next/router";
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
import AddEditUser from "@/dialogs/User/AddEditUser";
import CommonDataGrid from "../CommonDataGrid/CommonDataGrid";
import { ODATA_URL } from "@/custom-hooks/useAxios";
import { deleteById, downloadToExcel } from "@/services/shared.service";
import { ExportToExcel } from "@/utils/UtilFunctions";

const getFormattedDate = (date: string) => new Date(date).toDateString();

let columns: ODataGridColDef[] = [
  {
    field: "users.user_name",
    headerName: "Username",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users.first_name",
    headerName: "First Name",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users.last_name",
    headerName: "Last Name",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users.display_name",
    headerName: "Display Name",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users.email",
    headerName: "Email",
    editable: true,
    headerClassName: "grid-header",
    type: "string",
  },
  {
    field: "users.phone",
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
    field: "users.created_at",
    headerName: "Created On",
    valueFormatter: (params) => getFormattedDate(params.value),
    headerClassName: "grid-header",
    type: "date",
  },
  {
    field: "users.updated_at",
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
  "users.user_name": true,
  "users.first_name": false,
  "users.last_name": false,
  "users.display_name": true,
  "users.email": { xs: false, xl: true },
  "users.phone": { xs: false, md: true },
  "users_created_by.user_name": { xs: false, xl: true },
  "users_modified_by.user_name": false,
  "users.created_at": { xs: false, sm: true },
  "users.updated_at": false,
};

const alwaysSelect = ["users.user_id"];

const component = "Users";

function UsersList() {
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [cols, setCols] = useState(columns);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [currentSorting, setCurrentSorting] = useState<string>("");

  const deleteUser = async () => {
    const id = selectedRows as unknown as number;
    const result = await deleteById(component.toLowerCase(), id);
    if (result?.data?.count === 1) {
      refreshGrid();
    }
  };

  const refreshGrid = () => setCols((prev) => [...prev]);

  const saveChanges = async (params: GridRowEditStopParams) => {
    const { user_id, result, ...user } = params.row;
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
                <AddEditUser isEdit={false} successCallback={refreshGrid} />
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
                <AddEditUser isEdit={true} successCallback={refreshGrid} />
              </span>
              <span className={styles.options} onClick={deleteUser}>
                <TrashIcon className="w-5" />
                Delete User
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
      url={`${ODATA_URL}/users`}
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

export default UsersList;
