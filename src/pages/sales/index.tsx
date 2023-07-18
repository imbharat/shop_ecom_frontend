import dynamic from "next/dynamic";

const SalesList = dynamic(() => import("@/components/SalesList/SalesList"));

function Sales() {
  return <SalesList />;
}

export default Sales;
