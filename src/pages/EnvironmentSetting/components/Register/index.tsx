import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Box, Group, Button, Stack, Select, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AUTHEN_QUOTE, ENV_PAGE_QUOTE, NOTIFICATIONS, Role, TABLE_HEADER_KOR } from '@/constants';
import { RegisterForm } from '@/interfaces/interfaceAuthentication';
import { register } from '@/services/AuthenticationAPI';
import { SetStateAction } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';

export type RegisterProps = {
  onClose: (value?: SetStateAction<boolean> | undefined) => void;
  getUsers: () => void;
  role: string;
};

const Register = (props: RegisterProps) => {
  const { onClose, getUsers, role } = props;
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      name: '',
      role: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : AUTHEN_QUOTE.INVALID_EMAIL_KOR),
      password: (val) => {
        if (val.length < 6) {
          return AUTHEN_QUOTE.INVALID_PASSWORD;
        }

        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(val)) {
          return AUTHEN_QUOTE.INVALID_PASSWORD;
        }

        // Check for at least one lowercase letter
        if (!/[a-z]/.test(val)) {
          return AUTHEN_QUOTE.INVALID_PASSWORD;
        }

        // Check for at least one digit
        if (!/\d/.test(val)) {
          return AUTHEN_QUOTE.INVALID_PASSWORD;
        }

        // Check for at least one special character
        if (!/[!@#$%^&*]/.test(val)) {
          return AUTHEN_QUOTE.INVALID_PASSWORD;
        }

        // Password meets all requirements
        return null;
      },
      username: (val) => (val.length <= 0 ? AUTHEN_QUOTE.INVALID_NAME_KOR : null),
      name: (val) => (val.length <= 0 ? AUTHEN_QUOTE.INVALID_NAME_KOR : null),
      confirmPassword: (value, values) =>
        value !== values.password ? AUTHEN_QUOTE.INVALID_CONFIRM_PASSWORD_KOR : null,
    },
  });
  const onSubmit = async () => {
    const registerInfo: RegisterForm = {
      name: form.values.name,
      username: form.values.username,
      email: form.values.email,
      role: form.values.role === Role.MANAGER ? 1 : 2,
      password: form.values.password,
    };
    register(registerInfo).subscribe({
      next: (data) => {
        onClose && onClose();
        getUsers();
        setTimeout(() => {
          notifications.show({
            icon: <CircleCheck size="1rem" color="green" />,
            autoClose: 2000,
            color: 'green',
            title: NOTIFICATIONS.USER_CREATED_KOR,
            message: NOTIFICATIONS.SAVED_CHANGES_KOR,
          });
        }, 200);
      },
      error(err) {
        if (err.response.data.statusCode === 409 && err.response.data.error === 'Conflict') {
          notifications.show({
            icon: <CircleX size="1rem" color="red" />,
            autoClose: 2000,
            color: 'red',
            title: NOTIFICATIONS.CONFLICT_KOR,
            message: NOTIFICATIONS.CONFLICT_MESS_KOR,
          });
        }
      },
    });
  };

  return (
    <Box p="xl">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput
            required
            label={TABLE_HEADER_KOR.USERNAME}
            placeholder={TABLE_HEADER_KOR.USERNAME}
            value={form.values.username}
            onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
            error={form.errors.username && AUTHEN_QUOTE.INVALID_NAME_KOR}
            radius="md"
          />
          <TextInput
            required
            label={TABLE_HEADER_KOR.NAME}
            placeholder={TABLE_HEADER_KOR.NAME}
            value={form.values.name}
            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
            error={form.errors.name && AUTHEN_QUOTE.INVALID_NAME_KOR}
            radius="md"
          />

          <TextInput
            required
            label={TABLE_HEADER_KOR.EMAIL}
            placeholder="user@pentasecurity.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && AUTHEN_QUOTE.INVALID_EMAIL_KOR}
            radius="md"
          />

          <Select
            label={TABLE_HEADER_KOR.ROLE}
            size="sm"
            disabled={role === Role.MANAGER}
            data={['MANAGER', 'NORMAL']}
            defaultValue={'NORMAL'}
            transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
            onChange={(event) => form.setFieldValue('role', event || Role.NORMAL)}
          />

          <PasswordInput
            required
            label={AUTHEN_QUOTE.PASSWORD}
            placeholder={AUTHEN_QUOTE.PASSWORD}
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && AUTHEN_QUOTE.INVALID_PASSWORD}
            radius="md"
          />
          <PasswordInput
            required
            label={AUTHEN_QUOTE.CONFIRM_PASSWORD}
            placeholder={AUTHEN_QUOTE.CONFIRM_PASSWORD}
            value={form.values.confirmPassword}
            onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
            error={form.errors.confirmPassword && AUTHEN_QUOTE.INVALID_CONFIRM_PASSWORD_KOR}
            radius="md"
          />
        </Stack>

        <Group position="center" mt="xl" spacing={'lg'}>
          <Button
            sx={(theme) => ({
              borderRadius: theme.radius.md,
            })}
            variant="outline"
            color="gray"
            size="md"
            fz="sm"
            onClick={() => {
              onClose && onClose();
            }}
          >
            <Text color="black">{ENV_PAGE_QUOTE.CANCEL_BUTTON_KOR}</Text>
          </Button>
          <Button
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.blue[5],
            })}
            type="submit"
            size="md"
            fz="sm"
          >
            {ENV_PAGE_QUOTE.ADD_USER_BUTTON_KOR}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Register;
