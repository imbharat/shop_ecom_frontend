import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { ButtonGroup, Grid, useMediaQuery, useTheme } from "@mui/material";
import Header from "@/components/Header/Header";
import { Form } from "@/custom-hooks/useForm";
import TextField from "@/controls/TextField";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BaseDialog({
  name,
  resetForm,
  submitForm,
  children,
  fetchData,
  successCallback,
}: {
  name: string;
  resetForm?: () => void;
  submitForm: (e: SubmitEvent, callback: (isSuccess: boolean) => void) => void;
  successCallback: () => void;
  fetchData?: () => void;
  children: JSX.Element | JSX.Element[];
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    fetchData?.();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const callback = (isSuccess: boolean) => {
    if (isSuccess) {
      setOpen(false);
      successCallback();
    } else {
      //show snackbar
    }
  };

  return (
    <>
      <span onClick={handleClickOpen}>{name}</span>
      <Dialog
        maxWidth="md"
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <h3
          style={{
            fontSize: "1.3rem",
            padding: "1.2rem 2rem 0.5rem 2.5rem",
            textAlign: "left",
            fontWeight: 500,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              lineHeight: "2.2rem",
            }}
          >
            {name}
          </span>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon></CloseIcon>
          </IconButton>
        </h3>
        <Form
          onSubmit={(e: SubmitEvent) => submitForm(e, callback)}
          className="p-4"
          style={{
            border: "0.8rem solid var(--form-input-color)",
          }}
        >
          <Grid container>
            {children}
            <ButtonGroup id="action-btn" className="action-buttons">
              <Button onClick={() => setOpen(false)} className="secondary-btn">
                Cancel
              </Button>
              {!!resetForm && (
                <Button onClick={resetForm} className="secondary-btn">
                  Reset
                </Button>
              )}
              <Button type="submit">Submit</Button>
            </ButtonGroup>
          </Grid>
        </Form>
      </Dialog>
    </>
  );
}
