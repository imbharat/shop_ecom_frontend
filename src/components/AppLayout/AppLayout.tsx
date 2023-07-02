import * as React from "react";
import Box from "@mui/material/Box";

export default function AppLayout({
  component,
  header,
  nav,
}: {
  component: JSX.Element;
  header: JSX.Element;
  nav: JSX.Element;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      {header}
      {nav}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {component}
      </Box>
    </Box>
  );
}
