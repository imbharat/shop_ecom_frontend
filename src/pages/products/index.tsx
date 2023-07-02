import dynamic from 'next/dynamic'

const ProductsList = dynamic(() => import('@/components/ProductsList/ProductsList'))

function Products() {
  return (
    <ProductsList />
  )
}

export default Products