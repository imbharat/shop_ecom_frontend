import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { VendorInputFields } from "@/types/Types";
import BaseDialog from "../BaseDialog";

function AddEditVendor({
  successCallback,
  isEdit = false,
  initialValues = {
    vendor_name: "",
    address: "",
    city: "",
    pincode: 0,
    state: "",
    country: "",
    email: "",
    phone: "",
  },
}: {
  isEdit?: boolean;
  initialValues?: VendorInputFields;
  successCallback: () => void;
}) {
  const submitUrl = !isEdit ? `/vendors` : `/vendors`;
  const {
    values,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    submitForm,
  } = useForm(initialValues, submitUrl);

  return (
    <BaseDialog
      resetForm={resetForm}
      submitForm={submitForm}
      name={isEdit ? `Edit Vendor` : `Add Vendor`}
      successCallback={successCallback}
    >
      <Grid item container direction="row">
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Name"
            name="vendor_name"
            value={values["vendor_name"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Address"
            name="address"
            value={values["address"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="City"
            name="city"
            value={values["city"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Pincode"
            name="pincode"
            value={values["pincode"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="State"
            name="state"
            value={values["state"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Country"
            name="country"
            value={values["country"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Email"
            name="email"
            value={values["email"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Phone"
            name="phone"
            value={values["phone"]}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </BaseDialog>
  );
}

export default AddEditVendor;
