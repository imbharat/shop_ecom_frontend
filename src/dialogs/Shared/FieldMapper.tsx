import { FormLabel, Grid, MenuItem, Select } from "@mui/material";
import React from "react";

function FieldMapper({
  database_fields,
  source_fields,
}: {
  database_fields: string[];
  source_fields: string[];
}) {
  return (
    <Grid item xs={12} sm={6}>
      {["a", "b"].map((field) => (
        <div key={field}>
          <FormLabel>{field}</FormLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
          >
            <>
              <MenuItem value=""></MenuItem>
              {["c", "d"].map((csv_field) => {
                <MenuItem value={csv_field}>{csv_field}</MenuItem>;
              })}
            </>
          </Select>
        </div>
      ))}
    </Grid>
  );
}

export default FieldMapper;
