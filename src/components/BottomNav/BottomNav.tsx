import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import classNames from "classnames";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "next/link";
import React from "react";
import { MenuItems } from "../MenuItems";
import { useRouter } from "next/router";

function BottomNav() {
  const currentPath = useRouter().asPath;

  return (
    <Box
      sx={{ pb: 7 }}
      style={{
        zIndex: "2",
      }}
    >
      <CssBaseline />
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          overflow: "auto",
        }}
        elevation={3}
      >
        <BottomNavigation
          style={{
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          {MenuItems.map((item, index) => {
            return (
              item.mobileView && (
                <Link
                  href={item.href}
                  key={index}
                  className={classNames({
                    "text-black-100 flex gap-2": true,
                    "transition-colors duration-300": true,
                    "rounded-full p-2 mx-3 w-10 h-10": true,
                    "active-link": currentPath === item.href,
                  })}
                >
                  {item.icon}
                  {/* <BottomNavigationAction label={item.label} icon={item.icon} /> */}
                </Link>
              )
            );
          })}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default BottomNav;
