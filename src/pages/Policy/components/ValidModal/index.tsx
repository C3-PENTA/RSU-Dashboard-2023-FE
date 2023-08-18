import { NOTIFICATIONS } from '@/constants';
import { IPolicyUpdate } from '@/interfaces/interfacePolicy';
import { Text, Button, Box, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { CircleCheck } from 'tabler-icons-react';

type ValidModalProps = {
  onClose: () => void;
  onSave: (id: string, policy: IPolicyUpdate) => void;
  dataId: string;
  data: IPolicyUpdate;
};
const ValidModal = (props: ValidModalProps) => {
  const { onClose, onSave, dataId, data } = props;
  const onSubmit = () => {
    onSave(dataId, data);
    setTimeout(() => {
      notifications.show({
        icon: <CircleCheck size="1rem" color="green" />,
        color: 'green',
        title: NOTIFICATIONS.UPDATE_SUCCESSFUL_KOR,
        message: NOTIFICATIONS.SAVED_CHANGES_KOR,
      });
    }, 200);
    onClose();
    return;
  };
  return (
    <Box>
      <Text align="justify" size={'sm'} color="black" mb={'lg'}>
        This action is so important that you are required to confirm it with a modal. Please click
        one of these buttons to proceed.
      </Text>
      <Group position="center" mt={'sm'}>
        <Button variant="outline" color="gray" onClick={onClose}>
          <Text color="black">Cancel</Text>
        </Button>
        <Button onClick={onSubmit}>
          <Text>Confirm</Text>
        </Button>
      </Group>
    </Box>
  );
};

export default ValidModal;
