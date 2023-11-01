import { upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Text, Group, Button, Box } from '@mantine/core';
import { AUTHEN_QUOTE, AUTHEN_TYPE } from '@/constants';
import { Dispatch, SetStateAction, useState } from 'react';
import { login } from '@/services/AuthenticationAPI';
import { LoginForm } from '@/interfaces/interfaceAuthentication';
import image1 from '@/assets/images/icon-user.png';
import image2 from '@/assets/images/icon-pass.png';
import logopenta from '@/assets/images/Logo-PENTA.png';
import './authen.scss';

export type AuthenProps = {
  setLoginState: Dispatch<SetStateAction<boolean>>;
  setUserId: Dispatch<SetStateAction<string>>;
  setIsFirstAccess: Dispatch<SetStateAction<boolean>>;
};

const AuthenticationForm = (props: AuthenProps) => {
  const { setLoginState, setUserId, setIsFirstAccess } = props;
  const [isWrongCredential, setIsWrongCredential] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      terms: true,
    },

    validate: {
      password: (val) => (val.length <= 6 ? AUTHEN_QUOTE.INVALID_PASSWORD : null),
    },
  });

  const onSubmit = async () => {
    const loginInfo: LoginForm = {
      username: form.values.username,
      password: form.values.password,
    };

    login(loginInfo).subscribe({
      next: (data: any) => {
        if (data.status === 201) {
          setIsFirstAccess(true);
          setLoginState(true);
          setUserId(form.values.username);
        }
      },
      error(err) {
        setIsWrongCredential(true);
      },
    });
  };

  return (
    <Box
      sx={{
        width: 'auto',
        // minWidth: '25%',
        minHeight: '10%',
        position: 'relative',
        display: 'flex',
      }}
    >
      <div className="form-box">
        <form
          onSubmit={form.onSubmit(onSubmit)}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div className="logo-container">
            <img src={logopenta} className="logo-Penta" />
          </div>
          <Text color="rgb(255,255,255)" weight={500} size={15}>
            {AUTHEN_QUOTE.WELCOME}
          </Text>
          <Text color="red" weight={500} size={15}>
            {isWrongCredential ? AUTHEN_QUOTE.WRONG_CREDENTIAL_KOR : ''}
          </Text>
          <TextInput
            className="input-username-login"
            icon={<img src={image1} />}
            required
            placeholder={AUTHEN_QUOTE.USERNAME}
            styles={{ input: { backgroundColor: '#505358', height: '48px' } }}
            value={form.values.username}
            onChange={(event) => {
              isWrongCredential && setIsWrongCredential(false);
              form.setFieldValue('username', event.currentTarget.value);
            }}
            error={form.errors.username && AUTHEN_QUOTE.INVALID_EMAIL_KOR}
            radius="md"
          />
          <PasswordInput
            className="input-password-login"
            required
            icon={<img src={image2} />}
            styles={{
              input: { backgroundColor: '#505358', height: '48px', border: 0 },
              rightSection: {
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                position: 'absolute',
              },
            }}
            placeholder={AUTHEN_QUOTE.PASSWORD}
            value={form.values.password}
            onChange={(event) => {
              isWrongCredential && setIsWrongCredential(false);
              form.setFieldValue('password', event.currentTarget.value);
            }}
            error={form.errors.password && AUTHEN_QUOTE.INVALID_PASSWORD}
            radius="md"
          />
          <Group className="button-login">
            <Button
              styles={(theme) => ({
                root: {
                  width: '100%',
                  marginTop: '15px',
                },
              })}
              type="submit"
              radius="md"
            >
              {upperFirst(AUTHEN_TYPE.LOGIN)}
            </Button>
          </Group>
        </form>
      </div>
    </Box>
  );
};

export default AuthenticationForm;
