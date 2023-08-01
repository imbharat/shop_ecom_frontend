import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { UserInputFields } from "@/types/Types";
import BaseDialog from "../BaseDialog";
import { getById } from "@/services/shared.service";

function AddEditUser({
  resetDialogs,
  successCallback,
  isEdit = false,
  idArray = [],
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
  idArray?: number[];
  initialValues?: UserInputFields;
  resetDialogs: () => void;
  successCallback: () => void;
}) {
  const submitUrl = "/users";
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
    const fetchUser = async () => {
      if (isEdit && !alreadyFetched) {
        const result = await getById(
          "/users?",
          encodeURI(`$filter=includes(users.user_id, '${idArray.join(",")}')`)
        );
        const user = result?.data?.value?.[0];
        if (user) {
          updateFullForm(user);
          setId(user.user_id);
          setIsEdit(true);
        }
        setAlreadyFetched(true);
      }
    };
    fetchUser();
  }, [isEdit, idArray, alreadyFetched, setId, setIsEdit, updateFullForm]);

  return (
    <BaseDialog
      resetForm={resetForm}
      submitForm={submitForm}
      name={isEdit ? `Edit User` : `Add User`}
      successCallback={successCallback}
      resetDialogs={resetDialogs}
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
