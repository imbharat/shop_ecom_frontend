import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useForm } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";
import { LocationInputFields } from "@/types/Types";
import BaseDialog from "../BaseDialog";
import { getById } from "@/services/shared.service";

function AddEditLocation({
  resetDialogs,
  successCallback,
  isEdit = false,
  idArray = [],
  initialValues = {
    location_name: "",
    address: "",
    city: "",
    pincode: 0,
    state: "",
    country: "",
  },
}: {
  isEdit?: boolean;
  idArray?: number[];
  initialValues?: LocationInputFields;
  resetDialogs: () => void;
  successCallback: () => void;
}) {
  const submitUrl = "/locations";
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
    const fetchLocation = async () => {
      if (isEdit && !alreadyFetched) {
        const result = await getById(
          "/locations?",
          encodeURI(
            `$filter=includes(locations.location_id, '${idArray.join(",")}')`
          )
        );
        const location = result?.data?.value?.[0];
        if (location) {
          updateFullForm(location);
          setId(location.location_id);
          setIsEdit(true);
        }
        setAlreadyFetched(true);
      }
    };
    fetchLocation();
  }, [isEdit, idArray, alreadyFetched, setId, setIsEdit, updateFullForm]);

  return (
    <BaseDialog
      resetForm={resetForm}
      submitForm={submitForm}
      name={isEdit ? `Edit Location` : `Add Location`}
      successCallback={successCallback}
      resetDialogs={resetDialogs}
    >
      <Grid item container direction="row">
        <Grid item xs={12} sm={6} direction={"row"}>
          <TextField
            label="Name"
            name="location_name"
            value={values["location_name"]}
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
      </Grid>
    </BaseDialog>
  );
}

export default AddEditLocation;
