import React, { Fragment, useEffect, useState } from "react";
import { AppBar, CssBaseline, Toolbar, Typography } from "@mui/material";

function Header() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      const response = await fetch("http://localhost:4000/locations");
      const locations = await response.json();
      setLocations(locations);
    };
    getLocations();
  }, []);

  return (
    <>
      <AppBar
        style={{
          background: "var(--primary-color)",
          padding: 0,
          height: "3rem",
          justifyContent: "center",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{
              letterSpacing: "0.03rem",
              fontFamily: "system-ui",
              wordSpacing: "0.2rem",
              fontStyle: "italic",
            }}
          >
            Navya Enterprises
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
