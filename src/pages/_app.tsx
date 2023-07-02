import Header from "@/components/Header/Header";
import AppLayout from "@/components/AppLayout/AppLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import SideNav from "@/components/SideNav/SideNav";
import { styled, useMediaQuery, useTheme } from "@mui/material";
import BottomNav from "@/components/BottomNav/BottomNav";
import { Provider } from "react-redux";
import { store } from "@/redux/store/Store";
import useAxios from "@/custom-hooks/useAxios";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function App({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  useAxios();
  const mobileView = useMediaQuery<boolean>(theme.breakpoints.down("sm"));
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Provider store={store}>
      <AppLayout
        header={<Header />}
        component={<Component {...pageProps} />}
        nav={
          mobileView ? (
            <BottomNav />
          ) : (
            <SideNav
              open={open}
              toggleDrawer={toggleDrawer}
              DrawerHeader={DrawerHeader}
            />
          )
        }
      />
    </Provider>
  );
}
