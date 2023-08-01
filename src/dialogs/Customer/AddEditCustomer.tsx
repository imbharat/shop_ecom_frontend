import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { CustomerInputFields } from "@/types/Types";
import BaseDialog from "../BaseDialog";
import { getById } from "@/services/shared.service";

function AddEditCustomer({
  resetDialogs,
  successCallback,
  isEdit = false,
  idArray = [],
  initialValues = {
    customer_name: "",
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
  initialValues?: CustomerInputFields;
  resetDialogs: () => void;
  successCallback: () => void;
}) {
  const submitUrl = "/customers";
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
    const fetchCustomer = async () => {
      if (isEdit && !alreadyFetched) {
        const result = await getById(
          "/customers?",
          encodeURI(
            `$filter=includes(customers.customer_id, '${idArray.join(",")}')`
          )
        );
        const customer = result?.data?.value?.[0];
        if (customer) {
          updateFullForm(customer);
          setId(customer.customer_id);
          setIsEdit(true);
        }
        setAlreadyFetched(true);
      }
    };
    fetchCustomer();
  }, [isEdit, idArray, alreadyFetched, setId, setIsEdit, updateFullForm]);

  return (
    <BaseDialog
      resetForm={resetForm}
      submitForm={submitForm}
      name={isEdit ? `Edit Customer` : `Add Customer`}
      successCallback={successCallback}
      resetDialogs={resetDialogs}
    >
      <Grid item container direction="row">
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Name"
            name="customer_name"
            value={values["customer_name"]}
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

export default AddEditCustomer;
