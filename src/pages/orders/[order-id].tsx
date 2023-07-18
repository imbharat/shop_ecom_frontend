import dynamic from "next/dynamic";

const OrderDetailsList = dynamic(
  () => import("@/components/OrderDetailsList/OrderDetailsList")
);

function OrderDetails() {
  return <OrderDetailsList />;
}

export default OrderDetails;
