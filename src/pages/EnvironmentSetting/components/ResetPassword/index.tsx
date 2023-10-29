import { useForm } from '@mantine/form';
import { PasswordInput, Box, Group, Button, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AUTHEN_QUOTE, ENV_PAGE_QUOTE, NOTIFICATIONS } from '@/constants';
import { Dispatch, SetStateAction } from 'react';
import { CircleCheck } from 'tabler-icons-react';
import { updateUserById } from '@/services/EnvironmentSettingAPI';
import { IUserUpdate } from '@/interfaces/interfaceUser';

export type ResetPasswordProps = {
  onClose: (value?: SetStateAction<boolean> | undefined) => void;
  onCloseParent: (value?: SetStateAction<boolean> | undefined) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  id: string;
};

const ResetPassword = (props: ResetPasswordProps) => {
  const { onClose, onCloseParent, setLoading, id } = props;
  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validate: {
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
      confirmPassword: (value, values) =>
        value !== values.password ? AUTHEN_QUOTE.INVALID_CONFIRM_PASSWORD_KOR : null,
    },
  });
  const onSubmit = async () => {
    onClose && onClose();
    const passwordInfo: IUserUpdate = {
      password: form.values.password,
    };
    updateUserById(id || '', passwordInfo).subscribe({
      next: () => {
        onCloseParent && onCloseParent();
        setLoading(false);
        setTimeout(() => {
          notifications.show({
            icon: <CircleCheck size="1rem" color="green" />,
            autoClose: 2000,
            color: 'green',
            title: NOTIFICATIONS.RESET_PASSWORD_KOR,
            message: NOTIFICATIONS.SAVED_CHANGES_KOR,
          });
        }, 200);
      },
      error() {
        setLoading(false);
      },
    });
  };

  return (
    <Box p="xl">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
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
            variant="outline"
            color="gray"
            size="md"
            radius="md"
            fz="sm"
            onClick={() => {
              onClose && onClose();
            }}
          >
            <Text color="black">{ENV_PAGE_QUOTE.CANCEL_BUTTON_KOR}</Text>
          </Button>
          <Button color="red" type="submit" size="md" radius="md" fz="sm">
            {ENV_PAGE_QUOTE.RESET_PASSWORD_BUTTON_KOR}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default ResetPassword;
