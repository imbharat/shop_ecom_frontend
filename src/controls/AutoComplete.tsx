import { Autocomplete, Box, TextField } from "@mui/material";
import { SyntheticEvent, useCallback, useState } from "react";

type Option = string | { label: string; value: string | number };

function AutoComplete({
  options,
  label,
  name,
  freeSolo,
  initValue,
  onValueChange,
}: {
  options: Option[];
  label: string;
  name: string;
  freeSolo: boolean;
  initValue: Option | undefined;
  onValueChange: ({
    target: { value, name },
  }: {
    target: {
      value: string | number | undefined;
      name: string;
    };
  }) => void;
}) {
  const initValueIndex = options.findIndex(
    (op) => (typeof op === "string" ? op : op.label) === initValue
  );
  const [selectValue, setSelectValue] = useState<Option>(
    options[initValueIndex]
  );
  const onChange = (
    event: SyntheticEvent<Element, Event>,
    selected: Option
  ) => {
    const value = typeof selected === "string" ? selected : selected.value;
    onValueChange({ target: { value, name } });
    setSelectValue(selected);
  };
  const getOptionLabel = (option: Option) =>
    typeof option === "string" ? option : option.label;
  return (
    <Box
      component="div"
      sx={{
        m: "1rem",
        "& > :not(style)": { width: "100%" },
      }}
    >
      <Autocomplete
        freeSolo={freeSolo}
        openOnFocus
        disableClearable
        options={options}
        value={selectValue}
        getOptionLabel={getOptionLabel}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="standard"
            InputLabelProps={{ style: { fontSize: "0.9rem" } }}
            InputProps={{
              ...params.InputProps,
              style: { fontSize: "0.9rem" },
            }}
          />
        )}
      />
    </Box>
  );
}

export default AutoComplete;
