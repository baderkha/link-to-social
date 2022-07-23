import * as React from 'react';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import CloseIcon from '@material-ui/icons/Close'
import { IconButton } from '@material-ui/core';
import { Logo } from 'app/components/Logo';


const noop = () => { }
const noopArgs = (...args: any) => { }
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'black',
    pt: 2,
    px: 2,
    pb: 3,
};

function RegisterView() {

    return (
        <div>
            <FormControl fullWidth={true} style={{ display: "flex" }}>
                <div>
                    <InputLabel htmlFor="user-name" color="secondary">User Name</InputLabel>
                    <Input id="user-name" aria-describedby="user-name-text" fullWidth placeholder="zoomer_humor_96" />
                    <FormHelperText id="user-name-text">Enter Something Cool</FormHelperText>
                </div>


            </FormControl>

            <FormControl fullWidth={true} style={{ display: "flex" }}>
                <div>
                    <InputLabel htmlFor="password" color="secondary">Email</InputLabel>
                    <Input id="password" aria-describedby="password-text" fullWidth placeholder="ahmad@linktosocials.com" />
                    <FormHelperText id="password-text" >Enter a Valid Email</FormHelperText>
                </div>
            </FormControl>

            <FormControl fullWidth={true} style={{ display: "flex" }}>
                <div>
                    <InputLabel htmlFor="password" color="secondary" >Password</InputLabel>
                    <Input id="password" aria-describedby="password-text" fullWidth placeholder="im_slim_shady$#!97" />
                    <FormHelperText id="password-text">Enter a random password , no rules , just random long and difficult....</FormHelperText>
                </div>
            </FormControl>

            <FormControl fullWidth={true} >
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "10" }}>
                    <Button color="secondary">Sign Up</Button>
                </div>
            </FormControl>
        </div>
    )
}

function LoginView() {

    return (
        <div>
            <FormControl fullWidth={true} style={{ display: "flex" }}>
                <div>
                    <InputLabel htmlFor="user-name" color="secondary">User Name</InputLabel>
                    <Input id="user-name" aria-describedby="user-name-text" fullWidth placeholder="zoomer_humor_96" />
                    <FormHelperText id="user-name-text">Enter User Name</FormHelperText>
                </div>


            </FormControl>


            <FormControl fullWidth={true} style={{ display: "flex" }}>
                <div>
                    <InputLabel htmlFor="password" color="secondary" >Password</InputLabel>
                    <Input id="password" aria-describedby="password-text" fullWidth placeholder="im_slim_shady$#!97" />
                    <FormHelperText id="password-text">Enter Password</FormHelperText>
                </div>
            </FormControl>

            <FormControl fullWidth={true} >
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "10" }}>
                    <Button color="secondary">Login</Button>
                </div>
            </FormControl>
        </div>
    )
}




function Views({ onChangeTabs = noopArgs }) {
    const [value, setValue] = React.useState(2);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        onChangeTabs && onChangeTabs(newValue == 1 ? "login" : "signup")
    };

    return (

        <Tabs value={value} onChange={noop} aria-label="disabled tabs example" variant={"fullWidth"} centered={true}>
            <Tab label="Login" fullWidth={true} />
            <Tab label="Sign Up" fullWidth={true} />
        </Tabs>
    );
}

function TabsWrappedLabel({ onChangeTabs = noopArgs }) {
    const [value, setValue] = React.useState('login');

    const handleChange = (event, newValue: string) => {
        setValue(newValue);
        onChangeTabs && onChangeTabs(newValue)
    };

    return (

        <Tabs
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
            variant="fullWidth"
            style={{ marginBottom: "15px" }}
        >
            <Tab
                value="login"
                label="Login"
                textColor="#FFFFFF"
                style={{ color: "white" }}

            />
            <Tab value="sign_up" label="Sign Up" style={{ color: "white" }} />

        </Tabs>
    );
}


export default function Login() {
    const [open, setOpen] = React.useState(true);
    const [page , setPage] = React.useState("login")

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleTabChange = (value) => {
        setPage(value)
    }

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >

                <Box sx={{ ...style, width: 400 }}>
                    <div style={{ display: "flex", justifyContent: "end" }}>
                        <IconButton onClick={handleClose} children={<CloseIcon color={"error"} />}></IconButton>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px", marginTop: "15px" }}>
                        <Logo size={"large"} white_color={true}></Logo>

                    </div>
                    <TabsWrappedLabel onChangeTabs={handleTabChange}></TabsWrappedLabel>
                    {page == "login" ? <LoginView/> : <RegisterView/>}

                </Box>

            </Modal>
        </div>
    );
}