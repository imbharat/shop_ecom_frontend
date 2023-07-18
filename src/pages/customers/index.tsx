import dynamic from "next/dynamic";

const CustomersList = dynamic(
  () => import("@/components/CustomersList/CustomersList")
);

function Customers() {
  return <CustomersList />;
}

export default Customers;
