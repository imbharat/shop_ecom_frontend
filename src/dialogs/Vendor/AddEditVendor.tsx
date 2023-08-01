import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { VendorInputFields } from "@/types/Types";
import BaseDialog from "../BaseDialog";
import { getById } from "@/services/shared.service";

function AddEditVendor({
  resetDialogs,
  successCallback,
  isEdit = false,
  idArray = [],
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
  idArray?: number[];
  initialValues?: VendorInputFields;
  resetDialogs: () => void;
  successCallback: () => void;
}) {
  const submitUrl = "/vendors";
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
    const fetchVendor = async () => {
      if (isEdit && !alreadyFetched) {
        const result = await getById(
          "/vendors?",
          encodeURI(
            `$filter=includes(vendors.vendor_id, '${idArray.join(",")}')`
          )
        );
        const vendor = result?.data?.value?.[0];
        if (vendor) {
          updateFullForm(vendor);
          setId(vendor.vendor_id);
          setIsEdit(true);
        }
        setAlreadyFetched(true);
      }
    };
    fetchVendor();
  }, [isEdit, idArray, alreadyFetched, setId, setIsEdit, updateFullForm]);

  return (
    <BaseDialog
      resetForm={resetForm}
      submitForm={submitForm}
      name={isEdit ? `Edit Vendor` : `Add Vendor`}
      successCallback={successCallback}
      resetDialogs={resetDialogs}
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
            type="number"
            label="Pincode"
            name="pincode"
            value={values["pincode"] ?? 0}
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
