import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { ProductInputFields } from "@/types/Types";
import BaseDialog from "../BaseDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/Store";
import { getById } from "@/services/shared.service";
import AutoComplete from "@/controls/AutoComplete";

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
        setAlreadyFetched(true);
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
      }
    };
    fetchProduct();
  }, []);

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
          <AutoComplete
            label="Type"
            name="type"
            freeSolo={false}
            initValue={values["type"]}
            options={[
              { value: 1, label: "SmartPhone" },
              { value: 2, label: "KeyPad Phone" },
            ]}
            onValueChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <AutoComplete
            label="Category"
            name="category"
            freeSolo={false}
            initValue={values["category"]}
            options={[
              { value: 0, label: "" },
              { value: 1, label: "Electronics" },
            ]}
            onValueChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <AutoComplete
            label="Vendor"
            name="vendor"
            freeSolo={true}
            initValue={values["vendor"]}
            options={[
              { value: "apple", label: "Apple" },
              { value: "banana", label: "Banana" },
              { value: "cherry", label: "Cherry" },
            ]}
            onValueChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <AutoComplete
            label="Location"
            name="location"
            freeSolo={false}
            initValue={values["location"]}
            options={[
              { value: 1, label: "l1" },
              { value: 2, label: "l2" },
              { value: 3, label: "l3" },
            ]}
            onValueChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <AutoComplete
            label="Physical QC"
            name="physical_qc"
            freeSolo={false}
            initValue={values["physical_qc"]}
            options={[
              { value: 1, label: "Pending" },
              { value: 2, label: "OK" },
              { value: 3, label: "Rejected" },
            ]}
            onValueChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <AutoComplete
            label="Screen QC"
            name="screen_qc"
            freeSolo={false}
            initValue={values["screen_qc"]}
            options={[
              { value: 1, label: "Pending" },
              { value: 2, label: "OK" },
              { value: 3, label: "Rejected" },
            ]}
            onValueChange={handleInputChange}
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
