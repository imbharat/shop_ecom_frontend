import { Autocomplete, TextField } from "@mui/material";
import { ValueOptions } from "@mui/x-data-grid";
import { SyntheticEvent, useState } from "react";

function CustomAutocompleteCell({
  options,
  initValue,
}: {
  options: ValueOptions[];
  initValue: string;
}) {
  const [value, setValue] = useState<NonNullable<ValueOptions> | null>(
    initValue
  );
  return (
    <Autocomplete
      freeSolo
      closeText=""
      value={value}
      onChange={(
        event: SyntheticEvent<Element, Event>,
        value: NonNullable<ValueOptions> | null
      ) => {
        setValue(value);
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
