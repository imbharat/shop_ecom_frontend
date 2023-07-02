import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { ProductInputFields } from "@/types/Types";
import BaseDialog from "../BaseDialog";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/Store";

function AddEditProduct({
  successCallback,
  isEdit = false,
  initialValues = {
    product_name: "",
    price: 0,
    type: "",
    vendor: "",
    location: "",
    qc: "",
    barcode: "",
  },
}: {
  isEdit?: boolean;
  initialValues?: ProductInputFields;
  successCallback: () => void;
}) {
  const submitUrl = !isEdit ? `/products/add` : `/products/edit`;
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
      name={isEdit ? `Edit Product` : `Add Product`}
      successCallback={successCallback}
    >
      <Grid item xs={12} sm={6}>
        <TextField
          label="Name"
          name="product_name"
          value={values["product_name"]}
          onChange={handleInputChange}
        />
        <TextField
          label="Price"
          name="price"
          value={values["price"]}
          onChange={handleInputChange}
        />
        <TextField
          label="Barcode"
          name="type"
          value={values["type"]}
          onChange={handleInputChange}
        />
        <TextField
          label="QC Status"
          name="vendor"
          value={values["vendor"]}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Type"
          name="location"
          value={values["location"]}
          onChange={handleInputChange}
        />
        <TextField
          label="Vendor"
          name="qc"
          value={values["qc"]}
          onChange={handleInputChange}
        />
        <TextField
          label="Location"
          name="barcode"
          value={values["barcode"]}
          onChange={handleInputChange}
        />
      </Grid>
    </BaseDialog>
  );
}

export default AddEditProduct;
