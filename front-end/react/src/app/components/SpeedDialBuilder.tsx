import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import Add from '@material-ui/icons/Add';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Visibility, Edit } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 380,
            transform: 'translateZ(0px)',
            flexGrow: 1,
        },
        speedDial: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    }),
);



export type SpeedDialToolTipProps = {
    actions: Array<{ icon: JSX.Element, name: String, onClick?: Function }>
    isHidden? : boolean
}

export default function SpeedDialTooltipOpen(props : SpeedDialToolTipProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [hidden, setHidden] = React.useState(false);
    const {actions , isHidden} = props;

    const handleVisibility = () => {
        setHidden((prevHidden) => !prevHidden);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAction = (actionFn : Function | undefined) => {
        return function () {
            handleClose()
            actionFn && actionFn()
        }
    }

    return (

        <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            className={classes.speedDial}
            hidden={hidden}
            icon={<Edit />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            style={{display: isHidden ? "none" : ""}}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name as React.Key}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={handleAction(action.onClick)}
                />
            ))}
        </SpeedDial>
    );
}