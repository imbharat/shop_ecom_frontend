import { useState } from 'react'
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline'

import styles from "./LocationsList.module.css";
import Link from 'next/link';
import { useRouter } from 'next/router';

type Location = {
    location_id: number,
    name: string,
    createdAt: string,
    updatedAt: string
} 

function LocationsList() {
    const path = useRouter().asPath;

    const [selectedCount, setSelectedCount] = useState(0);
    const [selectedRows, setSelectedRows] = useState<Location[]>([]);

    const deleteLocation = async () => {
        const ids = selectedRows.map(location => location.location_id);
        await fetch(`http://localhost:4000/location/${ids}`, {
            method: "DELETE"
        });
    }

    return (
        <div className='grid-container'>
            <h3 className='mb-8'>Locations</h3>
            <div className='flex'>
                <Link href={path + '/add'} passHref>
                    <span className={styles.options}>
                        <PlusCircleIcon className="w-5 h-5" />
                        Add Location
                    </span>
                </Link>
                {  
                    selectedCount === 1 && <span className={styles.options}>
                        <PencilSquareIcon className="w-5 h-5" />
                        Edit Location
                    </span>
                }
                {
                    selectedCount > 0 && <span className={styles.options}
                        onClick={deleteLocation}
                    >
                        <TrashIcon className="w-5 h-5" />
                        Delete
                        {
                            selectedCount > 1 ? ' Locations': ' Location'
                        } 
                    </span>
                }
            </div>
        </div>
    )
}

export default LocationsList