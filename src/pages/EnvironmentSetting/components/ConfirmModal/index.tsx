import { ENV_PAGE_QUOTE, NOTIFICATIONS } from '@/constants';
import { IUserUpdate } from '@/interfaces/interfaceUser';
import { deleteUserById, updateUserById } from '@/services/EnvironmentSettingAPI';
import { Button, Box, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Dispatch, SetStateAction } from 'react';
import { CircleCheck } from 'tabler-icons-react';
interface ConfirmModalProp {
  action: string;
  onClose: (value?: SetStateAction<boolean> | undefined) => void;
  onCloseParent: (value?: SetStateAction<boolean> | undefined) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onSave: () => void;
  data: IUserUpdate;
}

const ConfirmModal = (props: ConfirmModalProp) => {
  const { action, onClose, data, onSave, setLoading, onCloseParent } = props;
  const handleCancel = () => {
    onClose && onClose();
  };

  const handleConfirm = () => {
    onClose && onClose();
    action === 'Update' &&
      updateUserById(data.id || '', data).subscribe({
        next: () => {
          onSave();
          onCloseParent && onCloseParent();
          setLoading(false);
          setTimeout(() => {
            notifications.show({
              icon: <CircleCheck size="1rem" color="green" />,
              autoClose: 2000,
              color: 'green',
              title: NOTIFICATIONS.UPDATE_SUCCESSFUL_KOR,
              message: NOTIFICATIONS.SAVED_CHANGES_KOR,
            });
          }, 200);
        },
        error() {
          setLoading(false);
        },
      });
    action === 'Delete' &&
      deleteUserById(data.id || '').subscribe({
        next: () => {
          onSave();
          setLoading(false);
          setTimeout(() => {
            notifications.show({
              icon: <CircleCheck size="1rem" color="green" />,
              autoClose: 2000,
              color: 'green',
              title: NOTIFICATIONS.USER_DELETED_KOR,
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
    <Box>
      <Text align="justify" size={'sm'} mb={'lg'}>
        {ENV_PAGE_QUOTE.CONFIRM_MODAL_DECR_KOR}
      </Text>
      <Group position="center" mt={'sm'}>
        <Button
          sx={(theme) => ({
            borderRadius: theme.radius.md,
          })}
          variant="outline"
          color="gray"
          onClick={handleCancel}
        >
          <Text color="black">{ENV_PAGE_QUOTE.CANCEL_BUTTON_KOR}</Text>
        </Button>
        <Button
          sx={(theme) => ({
            backgroundColor: action === 'Delete' ? theme.colors.red[5] : theme.colors.green[5],
            borderRadius: theme.radius.md,
          })}
          onClick={handleConfirm}
          color={action === 'Delete' ? 'red' : 'green'}
        >
          <Text>{ENV_PAGE_QUOTE.CONFIRM_BUTTON_KOR}</Text>
        </Button>
      </Group>
    </Box>
  );
};

export default ConfirmModal;
