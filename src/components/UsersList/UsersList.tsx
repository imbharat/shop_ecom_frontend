import { useState } from 'react'
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/solid'

import styles from './UsersList.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GridCellEditStopParams, GridRowEditStopParams, GridSelectionModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, 
    GridToolbarExport, GridToolbarFilterButton, MuiEvent } from '@mui/x-data-grid'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PreventSSR from '../PreventSSR/PreventSSR';
import { ODataGrid, ODataGridColDef } from 'o-data-grid';

const getFormattedDate = (date: string) => new Date(date).toDateString();

const columns: ODataGridColDef[] = [
    {
        field: 'user_name',
        headerName: 'Username',
        editable: true,
        flex: 1,
        type: 'string'
    }, 
    {
        field: 'first_name',
        headerName: 'First Name',
        editable: true,
        flex: 1,
        type: 'string'
    },
    {
        field: 'last_name',
        headerName: 'Last Name',
        editable: true,
        flex: 1,
        type: 'string'
    },
    {
        field: 'display_name',
        headerName: 'Display Name',
        editable: true,
        flex: 1,
        type: 'string'
    },
    {
        field: 'email',
        headerName: 'Email',
        editable: true,
        flex: 1,
        type: 'string'
    },
    {
        field: 'phone',
        headerName: 'Phone',
        editable: true,
        flex: 1,
        type: 'string'
    },
    {
        field: 'createdAt',
        headerName: 'Created On',
        valueFormatter: (params) => getFormattedDate(params.value),
        editable: true,
        flex: 1,
        type: 'date'
    },
    {
        field: 'updatedAt',
        headerName: 'Updated On',
        valueFormatter: (params) => getFormattedDate(params.value),
        editable: true,
        flex: 1,
        type: 'date'
    }
];

const columnVisibilityModel = {
    first_name: false,
    last_name: false,
    phone: false,
    user_name: true,
    display_name: true,
    email: true,
    createdAt: true,
    updatedAt: true
};

const alwaysSelect = ["user_id"];

function UsersList() {
    const path = useRouter().asPath;
    const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

    const rowSelection = (selectionModel: GridSelectionModel) => {
        setSelectedRows(selectionModel);
    }

    const deleteUser = async () => {
        await fetch(`http://localhost:4000/user/${selectedRows}`, {
            method: "DELETE"
        });
    }

    const saveChanges = async (params: GridRowEditStopParams) => {
        const { user_id, result, ...user } = params.row;
        console.log(user_id, user)
    }

    const CustomToolbar = () => {
        return (
          <GridToolbarContainer style={{
            justifyContent: 'space-between',
            padding: '0.5rem 1rem 0.5rem 0.1rem',
            borderBottom: '0.1rem solid var(--form-input-color)'
          }}>
            <div className='flex'>
                <Link href={path + '/add'} passHref>
                    <span className={styles.options}>
                        <PlusCircleIcon className="w-5 h-5" />
                        Add User
                    </span>
                </Link>
                {  
                    selectedRows.length === 1 && <span className={styles.options}>
                        <PencilSquareIcon className="w-5 h-5" />
                        Edit User
                    </span>
                }
                {
                    selectedRows.length > 0 && <span className={styles.options}
                        onClick={deleteUser}
                    >
                        <TrashIcon className="w-5 h-5" />
                        Delete
                        {
                            selectedRows.length > 1 ? ' Users': ' User'
                        } 
                    </span>
                }
            </div>
            <div>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
            </div>
          </GridToolbarContainer>
        );
    }

    return (
        <div className='grid-container'>
            <h3 className='mb-4' style={{
                borderBottom: '0.15rem solid var(--primary-color)'
            }}>Users</h3>
            <PreventSSR>
                <ODataGrid
                    url="http://localhost:4000/users"
                    checkboxSelection
                    disableColumnMenu
                    editMode="row"
                    density='compact'
                    getRowId={(row) => row.user_id}
                    columns={columns}
                    defaultPageSize={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    onSelectionModelChange={rowSelection}
                    selectionModel={selectedRows}
                    alwaysSelect={alwaysSelect}
                    columnVisibilityModel={columnVisibilityModel}
                    onRowEditStop={saveChanges}
                    components={{
                        Toolbar: CustomToolbar
                    }}
                    filterBuilderProps={{ 
                        localizationProviderProps: { 
                            dateAdapter: AdapterDayjs, 
                            adapterLocale: 'en-gb' 
                        } 
                    }}
                />
            </PreventSSR>
        </div>
    )
}

export default UsersList