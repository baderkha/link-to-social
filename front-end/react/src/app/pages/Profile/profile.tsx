import * as React from 'react';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { Logo } from 'app/components/Logo';

const noopArgs = (...args: any) => {};
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

const RegisterView = props => {
    const { page } = props;
    const signUpFormFields = [
        {
            label: 'User Name',
            inputDescription: 'user-name',
            inputPlaceholder: 'zoomer_humor_96',
            textId: 'user-name-text',
            formHelperText: 'Enter Somthing Cool',
        },
        {
            label: 'Email',
            inputDescription: 'email',
            inputPlaceholder: 'zoomer_humor_96',
            textId: 'email-text',
            formHelperText: 'Enter a Valid Email',
        },
        {
            label: 'Password',
            inputDescription: 'password',
            inputPlaceholder: 'im_slim_shady$#!97',
            textId: 'password-text',
            formHelperText:
                'Enter a random password , no rules , just random long and difficult...',
        },
    ];

    const filteredFormFields =
        page == 'login'
            ? signUpFormFields.filter(field => field.label !== 'Password')
            : signUpFormFields;

    return (
        <div>
            {filteredFormFields.map(field => {
                return (
                    <FormControl fullWidth={true} style={{ display: 'flex' }}>
                        <div>
                            <InputLabel
                                htmlFor={field.inputDescription}
                                color="secondary"
                            >
                                {field.label}
                            </InputLabel>
                            <Input
                                id={field.inputDescription}
                                aria-describedby={field.inputDescription}
                                fullWidth
                                placeholder={field.inputPlaceholder}
                            />
                            <FormHelperText id={field.textId}>
                                {field.formHelperText}
                            </FormHelperText>
                        </div>
                    </FormControl>
                );
            })}
        </div>
    );
};

const TabsWrappedLabel = ({ onChangeTabs = noopArgs }) => {
    const [value, setValue] = React.useState('login');

    const handleChange = (event, newValue: string) => {
        setValue(newValue);
        onChangeTabs && onChangeTabs(newValue);
    };

    return (
        <Tabs
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
            variant="fullWidth"
            style={{ marginBottom: '15px' }}
        >
            <Tab
                value="login"
                label="Login"
                textColor="#FFFFFF"
                style={{ color: 'white' }}
            />
            <Tab value="sign_up" label="Sign Up" style={{ color: 'white' }} />
        </Tabs>
    );
};

const LoginPage = () => {
    const [open, setOpen] = React.useState(true);
    const [page, setPage] = React.useState('login');

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleTabChange = value => {
        setPage(value);
    };

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
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <IconButton
                            onClick={handleClose}
                            children={<CloseIcon color={'error'} />}
                        ></IconButton>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '15px',
                            marginTop: '15px',
                        }}
                    >
                        <Logo size={'large'} white_color={true}></Logo>
                    </div>
                    <TabsWrappedLabel
                        onChangeTabs={handleTabChange}
                    ></TabsWrappedLabel>
                    <RegisterView page={page} />
                </Box>
            </Modal>
        </div>
    );
};

export default LoginPage;
