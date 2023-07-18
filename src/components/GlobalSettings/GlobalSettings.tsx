import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import styles from "./GlobalSettings.module.css";

function GlobalSettings() {
  const [value, setValue] = useState(1);

  const handleChange = (event: React.SyntheticEvent, val: number) => {
    setValue(val);
  };

  return (
    <div className="grid-container">
      <h3
        className="mb-4"
        style={{
          borderBottom: "0.15rem solid var(--primary-color)",
        }}
      >
        Settings
      </h3>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        className={styles.tabs}
      >
        <Tab label="Business" />
        <Tab label="Products" />
        <Tab label="Email Notifications" />
      </Tabs>
    </div>
  );
}

export default GlobalSettings;
