import * as React from "react";
import Box from "@mui/material/Box";
import { TextField as MuiTextField } from "@mui/material";
import { MuiTextFieldProps } from "@mui/x-date-pickers/internals";

function TextField(props: MuiTextFieldProps) {
  return (
    <Box
      component="div"
      sx={{
        m: "1rem",
        "& > :not(style)": { width: "100%" },
      }}
    >
      <MuiTextField
        variant="standard"
        size="small"
        {...props}
        inputProps={{
          sx: {
            fontSize: "0.9rem",
            "&::after": {
              borderBottom: "0.1rem solid var(--primary-color)",
            },
          },
        }}
        InputLabelProps={{ style: { fontSize: "0.9rem" } }}
      />
    </Box>
  );
}

export default TextField;
