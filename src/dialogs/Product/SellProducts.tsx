import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { SellProducts } from "@/types/Types";
import BaseDialog from "../BaseDialog";
import { getById } from "@/services/shared.service";

function SellProduct({
  resetDialogs,
  successCallback,
  idArray = [],
  initialValues = {
    customer_name: "",
    products: [],
  },
}: {
  idArray?: number[];
  initialValues: SellProducts;
  resetDialogs: () => void;
  successCallback: () => void;
}) {
  const submitUrl = "/products/sell";
  const {
    values,
    errors,
    setErrors,
    updateFullForm,
    handleInputChange,
    resetForm,
    setId,
    setIsEdit,
    submitForm,
  } = useForm(initialValues, submitUrl);

  const [alreadyFetched, setAlreadyFetched] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!alreadyFetched) {
        const result = await getById(
          "/products?",
          encodeURI(
            `$filter=includes(products.product_id, '${idArray.join(",")}')`
          )
        );
        const product = result?.data?.value?.[0];
        if (product) {
          updateFullForm(product);
          setId(product.product_id);
          setIsEdit(true);
        }
        setAlreadyFetched(true);
      }
    };
    fetchProducts();
  }, [idArray, alreadyFetched, setId, setIsEdit, updateFullForm]);

  return (
    <BaseDialog
      resetForm={resetForm}
      submitForm={submitForm}
      name={`Sell ${idArray.length > 1 ? "Products" : "Product"}`}
      successCallback={successCallback}
      resetDialogs={resetDialogs}
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
