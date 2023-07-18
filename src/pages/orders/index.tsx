import dynamic from "next/dynamic";

const OrdersList = dynamic(() => import("@/components/OrdersList/OrdersList"));

function Orders() {
  return <OrdersList />;
}

export default Orders;
