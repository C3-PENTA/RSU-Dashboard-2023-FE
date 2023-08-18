import { IPolicy } from '@/interfaces/interfacePolicy';
import { Modal } from '@mantine/core';
import PolicyModalDetail from '../PolicyModalDetail';

type PolicyModalProps = {
  visible: boolean;
  onClose: () => void;
  policy: IPolicy;
  onSave: () => void;
};
const PolicyModal = (props: PolicyModalProps) => {
  const { visible, onClose, policy, onSave, ...rest } = props;

  const onCloseModal = () => {
    onClose && onClose();
  };
  return (
    <Modal
      size="md"
      withCloseButton={false}
      shadow={'xs'}
      opened={visible}
      onClose={onCloseModal}
      {...rest}
      centered
    >
      <PolicyModalDetail onSave={onSave} data={policy} onClose={onCloseModal} />
    </Modal>
  );
};

export default PolicyModal;
