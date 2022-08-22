import React from "react"

import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/ShareSharp';
import { Snackbar, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab"


export const ShareButton = (materialUIProps) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const onClick = () => {
        navigator.clipboard.writeText(window.location.href)
        setIsOpen(true)
        setTimeout(() => {
            setIsOpen(false)
        }, 4 * 1000);
    }
    return (<div>

        <Snackbar open={isOpen} >
            <Alert severity="info" style={{ width: '100%', textAlign: "center" }}>
                <Typography style={{ textAlign: "center" }}> Copied to clip board ! </Typography>
            </Alert>
        </Snackbar>
        <IconButton {...materialUIProps} onClick={onClick}><ShareIcon></ShareIcon></IconButton>
    </div>)
}