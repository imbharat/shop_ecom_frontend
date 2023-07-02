import React, { useState } from 'react'
import { Button, Drawer } from "@mui/material";

export default function BaseRightDrawer() {

    const [open, setOpen] = useState(false);

    return <React.Fragment key={"right"} >
        <Button onClick={() => setOpen(true)}>{"right"}</Button>
        <Drawer
            anchor={"right"}
            open={open}
            onClose={() => setOpen(false)}
            style={{
                width: "5rem",
                position: "absolute",
                top: "3rem"
            }}
        >
            <h3>
                hi
            </h3>
        </Drawer>
    </React.Fragment>
}