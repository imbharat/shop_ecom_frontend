import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { ProductInputFields } from "@/types/Types";
import BaseDialog from "../BaseDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/Store";
import { getById } from "@/services/shared.service";

function AddEditProduct({
  resetDialogs,
  successCallback,
  idArray = [],
  isEdit = false,
  initialValues = {
    product_name: "",
    cost_price: 0,
    type: "",
    vendor: "",
    location: "",
    physical_qc: "",
    screen_qc: "",
    imei: "",
    category: "",
    ram: 0,
    storage: 0,
    barcode: "",
  },
}: {
  isEdit?: boolean;
  idArray?: number[];
  initialValues?: ProductInputFields;
  resetDialogs: () => void;
  successCallback: () => void;
}) {
  const submitUrl = "/products";
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
    const fetchProduct = async () => {
      if (isEdit && !alreadyFetched) {
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
    fetchProduct();
  }, [isEdit, idArray, alreadyFetched, setId, setIsEdit, updateFullForm]);

  const app_data = useSelector((state: RootState) => state.app_data);

  const fetchData = async () => {};

  return (
    <BaseDialog
      resetForm={resetForm}
      submitForm={submitForm}
      fetchData={fetchData}
      resetDialogs={resetDialogs}
      name={isEdit ? `Edit Product` : `Add Product`}
      successCallback={successCallback}
    >
      <Grid item container direction="row">
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Name"
            name="product_name"
            value={values["product_name"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            type="number"
            label="Cost Price"
            name="cost_price"
            value={values["cost_price"] ?? 0}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Barcode"
            name="barcode"
            value={values["barcode"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="IMEI"
            name="imei"
            value={values["imei"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Type"
            name="type"
            value={values["type"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Category"
            name="category"
            value={values["category"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Vendor"
            name="vendor"
            value={values["vendor"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Location"
            name="location"
            value={values["location"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Physical QC"
            name="physical_qc"
            value={values["physical_qc"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Screen QC"
            name="screen_qc"
            value={values["screen_qc"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            type="number"
            label="RAM (GB)"
            name="ram"
            value={values["ram"] ?? 0}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            type="number"
            label="Storage (GB)"
            name="storage"
            value={values["storage"] ?? 0}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </BaseDialog>
  );
}

export default AddEditProduct;
