import React from "react";

import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { MenuItems } from "../MenuItems";
import Link from "next/link";
import { Divider, IconButton, List } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import classNames from "classnames";
import { useRouter } from "next/router";

const drawerWidth = "12rem";
const closedDrawerWidth = "3.5rem";

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: closedDrawerWidth,
});

const Menu = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function SideNav({
  open,
  toggleDrawer,
  DrawerHeader,
}: {
  open: boolean;
  DrawerHeader: any;
  toggleDrawer: () => void;
}) {
  const currentPath = useRouter().asPath;

  return (
    <Menu
      variant="permanent"
      open={open}
      className="side-nav"
      PaperProps={{
        sx: {
          "& > div": {
            minHeight: "3.5rem",
          },
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={toggleDrawer}>
          {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />

      <List
        sx={{
          overflow: "hidden auto",
        }}
      >
        {MenuItems.map((item, index) => {
          return (
            <li
              key={index}
              className={classNames({
                "text-black-100 internal-link flex": true, //colors
                "transition-colors duration-300": true, //animation
                "rounded-md p-2 mx-3 gap-4 ": open,
                "rounded-full p-2 mx-3 w-10 h-10": !open,
                "active-link": currentPath === item.href,
              })}
            >
              <Link href={item.href} className="flex gap-2">
                {item.icon} <span>{open && item.label}</span>
              </Link>
            </li>
          );
        })}
      </List>
    </Menu>
  );
}

export default SideNav;
