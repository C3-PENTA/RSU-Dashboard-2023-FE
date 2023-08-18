import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  LoadingOverlay,
  Box,
  Group,
  Button,
  Stack,
  Select,
  Text,
  Modal,
  createStyles,
} from '@mantine/core';
import { AUTHEN_QUOTE, ENV_PAGE_QUOTE, Role, TABLE_HEADER_KOR } from '@/constants';
import { Dispatch, SetStateAction, useState } from 'react';
import { IUserUpdate, User } from '@/interfaces/interfaceUser';
import { ConfirmModal, ResetPassword } from '..';

export type UpdateProps = {
  onClose: (value?: SetStateAction<boolean> | undefined) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onSave: () => void;
  user: User;
  role: string;
};

const useStyle = createStyles((theme) => ({
  modal: {
    '& section': {
      position: 'relative',
      top: '90px',
    },
  },
}));

const UpdateUser = (props: UpdateProps) => {
  const { user, role, onClose, onSave, setLoading } = props;
  const [showModal, toggleModal] = useToggle();
  const [showResetPassword, toggleResetPassword] = useToggle();
  const [userInfo, setUserInfo] = useState<IUserUpdate>({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role === Role.MANAGER ? 1 : 2,
  });
  const { cx, classes } = useStyle();
  const form = useForm({
    initialValues: {
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : AUTHEN_QUOTE.INVALID_EMAIL_KOR),
      username: (val) => (val.length <= 0 ? AUTHEN_QUOTE.INVALID_NAME_KOR : null),
      name: (val) => (val.length <= 0 ? AUTHEN_QUOTE.INVALID_NAME_KOR : null),
    },
  });
  const onSubmit = async () => {
    const updateInfo: IUserUpdate = {
      id: user.id,
      name: form.values.name,
      username: form.values.username,
      email: form.values.email,
      role: form.values.role === Role.MANAGER ? 1 : 2,
    };
    toggleModal();
    setUserInfo(updateInfo);
  };

  return (
    <Box p="xl" sx={{ borderRadius: '8px' }}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput
            disabled
            label={TABLE_HEADER_KOR.USERNAME}
            placeholder={TABLE_HEADER_KOR.USERNAME}
            value={form.values.username}
            onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
            error={form.errors.username && 'Invalid username'}
            radius="md"
          />
          <TextInput
            required
            label={TABLE_HEADER_KOR.NAME}
            placeholder={TABLE_HEADER_KOR.NAME}
            value={form.values.name}
            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
            error={form.errors.name && 'Invalid name'}
            radius="md"
          />

          <TextInput
            required
            label={TABLE_HEADER_KOR.EMAIL}
            placeholder="user@pentasecurity.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <Select
            label={TABLE_HEADER_KOR.ROLE}
            size="sm"
            data={user.role === Role.OPERATOR ? ['OPERATOR'] : ['MANAGER', 'NORMAL']}
            disabled={role === Role.MANAGER || user.role === Role.OPERATOR}
            defaultValue={form.values.role}
            transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
            onChange={(event) => form.setFieldValue('role', event || Role.NORMAL)}
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
          <Button
            color="red"
            size="md"
            radius="md"
            fz="sm"
            onClick={() => {
              toggleResetPassword();
            }}
          >
            <Text color="white">{ENV_PAGE_QUOTE.RESET_BUTTON_KOR}</Text>
          </Button>
          <Button color="blue" type="submit" size="md" radius="md" fz="sm">
            {ENV_PAGE_QUOTE.UPDATE_BUTTON_KOR}
          </Button>
        </Group>
      </form>
      <LoadingOverlay
        visible={showModal || showResetPassword}
        overlayBlur={2}
        loaderProps={{ color: 'white' }}
        sx={{ position: 'fixed' }}
      />
      <Modal
        title={
          <Text size={'lg'} color="black" weight={500}>
            {ENV_PAGE_QUOTE.CONFIRM_MODAL_TITLE_KOR}
          </Text>
        }
        size="md"
        shadow={'xs'}
        onClose={toggleModal}
        opened={showModal}
        className={cx(classes.modal)}
      >
        <ConfirmModal
          action="Update"
          onSave={onSave}
          onCloseParent={onClose}
          onClose={toggleModal}
          setLoading={setLoading}
          data={userInfo}
        />
      </Modal>
      <Modal
        title={
          <Text size={'lg'} color="black" weight={500}>
            {ENV_PAGE_QUOTE.RESET_MODAL_TITLE_KOR}
          </Text>
        }
        size="lg"
        shadow={'xs'}
        onClose={toggleResetPassword}
        opened={showResetPassword}
      >
        <ResetPassword
          onClose={toggleResetPassword}
          onCloseParent={onClose}
          setLoading={setLoading}
          id={user.id}
        />
      </Modal>
    </Box>
  );
};

export default UpdateUser;
