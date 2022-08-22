import * as React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import CloseIcon from '@material-ui/icons/Close';
import { Container, IconButton, Snackbar, Typography } from '@material-ui/core';
import { Logo } from 'app/components/Logo';
import * as EmailValidator from 'email-validator';
import DateFnsUtils from '@date-io/date-fns';
import {
    ageByBirthDate
} from 'age-to-birth-date'

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { SocialApi } from 'app/infrastructure/services/index';
import { FormEvent } from 'react-transition-group/node_modules/@types/react';
import { ErrorResponse } from 'app/infrastructure/services/rest/links2social/base_social_api';
import { Alert } from '@material-ui/lab';

const noop = () => {};
const noopArgs = (...args: any) => {};
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  pt: 2,
  px: 2,
  pb: 3,
};

const api = SocialApi();

type RegistrationData = {
  userName?: string;
  email?: string;
  birthDate?: Date;
  password?: string;
};

type DisplayMessage = {
  message?: string;
  type?: 'error' | 'success';
  enabled: boolean;
};

type ErrorStatesRegistration = {
  usernameErr?: string;
  emailErr?: string;
  birthDateErr?: string;
  passwordErr?: string;
};

function RegisterView() {
  let [registrationData, setRegistrationData] = React.useState({
    birthDate: new Date(Date.parse('12/26/1997')),
  } as RegistrationData);
  let [displayMessage, setDisplayMessage] = React.useState({
    enabled: false,
  } as DisplayMessage);
  const [errorStates, setErrorStates] = React.useState(
    {} as ErrorStatesRegistration,
  );
  const [showErrorSnack, setShowErrorSnack] = React.useState([false, '']);
  const today = new Date();

  const OnStateChange = (fieldName: string) => {
    return (f: FormEvent<HTMLDivElement>) => {
      registrationData[fieldName] = f.target['value'];
      setRegistrationData(registrationData);
    };
  };

  const onPasswordInputComplete = async ev => {
    const password = ev.target.value;
    const res = await api.pwdStrength({
      password,
    });
    let r: ErrorResponse = res as ErrorResponse;
    return setErrorStates({
      ...errorStates,
      passwordErr: res != true ? r.error_message : '',
    });
  };

  const onUserNameInputComplete = async ev => {
    let userName = ev.target.value;
    const accountAlreadyExists = await api.accountIdExists({
      account_id: userName,
    });

    return setErrorStates({
      ...errorStates,
      usernameErr: accountAlreadyExists
        ? `Please Choose Another User Name this one is already taken`
        : '',
    });
  };

  const setSnackError = (error: string) => {
    setShowErrorSnack([true, error]);
    window.setTimeout(() => setShowErrorSnack([false, '']), 3 * 1000);
  };

  const onEmailInputComplete = async ev => {
    const email = ev.target.value;
    const isValidEmail = EmailValidator.validate(email);

    return setErrorStates({
      ...errorStates,
      emailErr: isValidEmail ? '' : 'Your Email is Not Valid',
    });
  };

  const onFormSubmit = async () => {
      if (
        errorStates.emailErr ||
        errorStates.passwordErr ||
        errorStates.usernameErr
      ) {
        // snack bar
        return setSnackError('');
      }

      if (
        !(
          registrationData.birthDate &&
          registrationData.email &&
          registrationData.password &&
          registrationData.userName
        )
      ) {
        return setSnackError('You must fill out all the fields');
      }

      const res = await api.register({
        date_of_birth: registrationData.birthDate as Date,
        email: registrationData.email as string,
        password: registrationData.password as string,
        id: registrationData.userName as string,
        first_name: '',
        last_name: ' ',
      });

      if (res != true) {
        let r = res as ErrorResponse;
        return setSnackError(
          `Unexpected Backend Error :  ${r.error_message} with status ${r.status_code}`,
        );
      }
  };

  return (
    <div>
      <div>
        <FormControl
          fullWidth={true}
          style={{ display: 'flex', marginBottom: '3px' }}
        >
          <div>
            <TextField
              id="user-name-box"
              label="User Name"
              variant="outlined"
              color="secondary"
              placeholder="some_cool_user21"
              error={!!errorStates.usernameErr}
              helperText={errorStates.usernameErr}
              onBlur={onUserNameInputComplete}
              fullWidth
              onInput={OnStateChange('userName')}
            />
            <FormHelperText id="user-name-text">
              Enter Something Cool
            </FormHelperText>
          </div>
        </FormControl>

        <FormControl
          fullWidth={true}
          style={{ display: 'flex', marginBottom: '3px' }}
        >
          <div>
            <TextField
              id="email-box"
              label="Email"
              variant="outlined"
              color="secondary"
              error={!!errorStates.emailErr}
              helperText={errorStates.emailErr}
              onBlur={onEmailInputComplete}
              fullWidth
              placeholder="email@links-to-socials.com"
              onInput={OnStateChange('email')}
            />
            <FormHelperText id="password-text">
              Enter a Valid Email
            </FormHelperText>
          </div>
        </FormControl>
        <FormControl
          fullWidth={true}
          style={{ display: 'flex', marginBottom: '3px' }}
        >
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="dialog"
                margin="normal"
                color="secondary"
                fullWidth
                inputVariant="outlined"
                id="date-picker-dialog"
                label="Birth Date"
                format="MM/dd/yyyy"
                error={!!errorStates.birthDateErr}
                helperText = {errorStates.birthDateErr}
                value={registrationData.birthDate}
                onChange={(date, value) => {
                  registrationData.birthDate = new Date(
                    Date.parse(value as string),
                  );
                  console.log(ageByBirthDate(registrationData.birthDate))
                  if (ageByBirthDate(registrationData.birthDate) <18) {
                      setErrorStates({...errorStates,birthDateErr:"You must be 18 to register"})
                  } else {
                      setErrorStates({...errorStates,birthDateErr:""})
                  }
                  setRegistrationData(registrationData);
                  
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <FormHelperText id="password-text">
              Your Date Of Birth
            </FormHelperText>
          </div>
        </FormControl>

        <FormControl fullWidth={true} style={{ display: 'flex' }}>
          <div>
            <TextField
              id="user-name-box"
              label="Password"
              variant="outlined"
              onBlur={onPasswordInputComplete}
              error={!!errorStates.passwordErr}
              helperText={errorStates.passwordErr}
              color="secondary"
              placeholder="********"
              fullWidth
              onInput={OnStateChange('password')}
            />
            <FormHelperText id="password-text">
              Enter a password , no rules , just random long and difficult....
            </FormHelperText>
          </div>
        </FormControl>

        <FormControl fullWidth={true}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '5px',
              marginBottom: '10',
            }}
          >
            <Button
              color="secondary"
              variant="outlined"
              fullWidth
              onClick={onFormSubmit}
            >
              Sign Up
            </Button>
          </div>
        </FormControl>
      </div>
      <Snackbar open={showErrorSnack[0] as boolean}>
        <Alert severity="error" style={{ width: '100%', textAlign: 'center' }}>
          <Typography style={{ textAlign: 'center' }}>
            {' '}
            {showErrorSnack[1]
              ? showErrorSnack[1]
              : 'Please Fix the errors'}{' '}
          </Typography>
        </Alert>
      </Snackbar>
    </div>
  );
}

type LoginDate = {
  userName?: string;
  password?: string;
};

function LoginView() {
  let [loginData, setLoginData] = React.useState({} as LoginDate);

  const OnStateChange = (fieldName: string) => {
    return (f: FormEvent<HTMLDivElement>) => {
      loginData[fieldName] = f.target['value'];
      setLoginData(loginData);
    };
  };

  return (
    <div>
      <FormControl
        fullWidth={true}
        style={{ display: 'flex', marginBottom: '10px' }}
      >
        <div>
          <TextField
            id="user-name-box"
            label="User Name"
            variant="outlined"
            color="secondary"
            placeholder="some_cool_user_21"
            fullWidth
            onInput={OnStateChange('userName')}
          />
          <FormHelperText id="user-name-text">Your User Name</FormHelperText>
        </div>
      </FormControl>

      <FormControl
        fullWidth={true}
        style={{ display: 'flex', marginBottom: '10px' }}
      >
        <div>
          <TextField
            id="user-name-box"
            label="Password"
            variant="outlined"
            color="secondary"
            placeholder="********"
            fullWidth
            onInput={OnStateChange('password')}
          />
          <FormHelperText id="password-text">Your Password</FormHelperText>
        </div>
      </FormControl>

      <FormControl fullWidth={true}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
            marginBottom: '10',
          }}
        >
          <Button color="secondary" variant="outlined" fullWidth>
            Login
          </Button>
        </div>
      </FormControl>
    </div>
  );
}

function Views({ onChangeTabs = noopArgs }) {
  const [value, setValue] = React.useState(2);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    onChangeTabs && onChangeTabs(newValue == 1 ? 'login' : 'signup');
  };

  return (
    <Tabs
      value={value}
      onChange={noop}
      aria-label="disabled tabs example"
      variant={'fullWidth'}
      centered={true}
    >
      <Tab label="Login" fullWidth={true} />
      <Tab label="Sign Up" fullWidth={true} />
    </Tabs>
  );
}

function TabsWrappedLabel({ onChangeTabs = noopArgs }) {
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
        style={{ color: 'black' }}
      />
      <Tab value="sign_up" label="Sign Up" style={{ color: 'black' }} />
    </Tabs>
  );
}

export default function Login() {
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
    <Container>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box
            sx={{
              ...style,
              width:
                window.screen.availWidth > 500
                  ? '550px'
                  : `${window.screen.availWidth - 80}px`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div />
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
              <Logo size={'large'} white_color={false}></Logo>
            </div>
            <TabsWrappedLabel onChangeTabs={handleTabChange}></TabsWrappedLabel>
            {page == 'login' ? <LoginView /> : <RegisterView />}
          </Box>
        </Modal>
      </div>
    </Container>
  );
}
