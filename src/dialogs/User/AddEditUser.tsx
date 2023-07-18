import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { UserInputFields } from "@/types/Types";
import BaseDialog from "../BaseDialog";

function AddEditUser({
  successCallback,
  isEdit = false,
  initialValues = {
    user_name: "",
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    phone: "",
  },
}: {
  isEdit?: boolean;
  initialValues?: UserInputFields;
  successCallback: () => void;
}) {
  const submitUrl = !isEdit ? `/users` : `/users`;
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
      name={isEdit ? `Edit User` : `Add User`}
      successCallback={successCallback}
    >
      <Grid item container direction="row">
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Username"
            name="user_name"
            value={values["user_name"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Display Name"
            name="display_name"
            value={values["display_name"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="First Name"
            name="first_name"
            value={values["first_name"]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Last Name"
            name="last_name"
            value={values["last_name"]}
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

export default AddEditUser;
