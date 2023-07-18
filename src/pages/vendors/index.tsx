import dynamic from "next/dynamic";

const VendorsList = dynamic(
  () => import("@/components/VendorsList/VendorsList")
);

function Vendors() {
  return <VendorsList />;
}

export default Vendors;
