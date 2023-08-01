import { Autocomplete, TextField } from "@mui/material";
import { ValueOptions } from "@mui/x-data-grid";
import { useState } from "react";

function CustomAutocompleteCell({
  options,
  initValue,
}: {
  options: ValueOptions[];
  initValue: string;
}) {
  const [value, setValue] = useState(initValue);
  return (
    <Autocomplete
      freeSolo
      value={value}
      onChange={(e) => {
        debugger;
        //setValue(e.nativeEvent.target);
      }}
      options={options}
      renderInput={(tparams) => (
        <TextField
          {...tparams}
          sx={{
            padding: 0,
            "& fieldset": { border: "none" },
          }}
          InputProps={{
            style: {
              padding: 0,
            },
            type: "search",
          }}
        />
      )}
    />
  );
}

export default CustomAutocompleteCell;
