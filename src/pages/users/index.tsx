import dynamic from 'next/dynamic'

const UsersList = dynamic(() => import('@/components/UsersList/UsersList'))

function Users() {
  return (
    <UsersList />
  )
}

export default Users