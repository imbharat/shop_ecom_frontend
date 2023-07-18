import React from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { SellProducts } from "@/types/Types";
import BaseDialog from "../BaseDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/Store";

function SellProduct({
  successCallback,
  initialValues = {
    customer_name: "",
    products: [],
  },
}: {
  initialValues: SellProducts;
  successCallback: () => void;
}) {
  const submitUrl = `/products/sell`;
  const {
    values,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    submitForm,
  } = useForm(initialValues, submitUrl);

  const app_data = useSelector((state: RootState) => state.app_data);

  const fetchData = async () => {
    // const vendors = await axios.get(`${url}/vendors/top`);
    // const types = await axios.get(`${url}/types/top`);
    // const locations = await axios.get(`${url}/locations/top`);
    // const categories = await axios.get(`${url}/categories/top`)
    // const qcs = await axios.get(`${url}/qcs/top`);
  };

  return (
    <BaseDialog
      resetForm={resetForm}
      submitForm={submitForm}
      fetchData={fetchData}
      name={`Sell ${
        initialValues.products.length > 1 ? "Products" : "Product"
      }`}
      successCallback={successCallback}
    >
      <div>
        <TextField
          label="Customer"
          name="customer_id"
          value={values["customer_name"]}
          onChange={handleInputChange}
        />
      </div>
      <Grid>
        {initialValues.products.map((product) => (
          <div
            key={product.product_id}
            style={{
              display: "flex",
            }}
          >
            <TextField
              label="Cost Price"
              name="cost_price"
              disabled
              value={product["cost_price"]}
            />
            <TextField
              label="Selling Price"
              name="sell_price"
              value={product["sell_price"]}
              onChange={handleInputChange}
            />
          </div>
        ))}
      </Grid>
    </BaseDialog>
  );
}

export default SellProduct;
