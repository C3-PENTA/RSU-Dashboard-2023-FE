/* eslint-disable camelcase */
import { IPolicy, IPolicyUpdate } from '@/interfaces/interfacePolicy';
import { updatePolicyById, updatePolicyOfNode } from '@/services/PolicyAPI';
import ValidModal from '../ValidModal';
import { useToggle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  LoadingOverlay,
  Box,
  Button,
  Group,
  Input,
  MultiSelect,
  Switch,
  Text,
  Title,
  Modal,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';
import { getListRSU } from '@/services/DashboardAPI';
import { NOTIFICATIONS } from '@/constants';

type PolicyModalDetailProps = {
  data: IPolicy;
  onClose: () => void;
  onSave: () => void;
};

const PolicyModalDetail = (props: PolicyModalDetailProps) => {
  const { data, onClose, onSave } = props;
  const [policy, setPolicy] = useState<IPolicy>(data);
  const [showValidModal, toggleValidModal] = useToggle();

  const [nodeSelected, setNodeSelected] = useState<string[]>([]);
  const [listNode, setListNode] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    initNodeData();
  }, []);

  const initNodeData = () => {
    getListRSU().subscribe({
      next: ({ data }) => {
        const newState = data.nodes.map((item) => {
          return { label: item.custom_id, value: item.id };
        });
        setListNode(newState);
      },
      error(err) {
        console.log(err);
      },
    });

    const newNodeSelected: string[] = data.assignedNodes.map((item) => {
      return item.nodeId;
    });
    setNodeSelected(newNodeSelected);
  };

  const { id, name, cpu_limit, cpu_thresh, num_edges, is_activated } = policy;

  const updateNode = (nodeId: string[], policyId: string) => {
    try {
      nodeId.length > 0 &&
        nodeId.map((id: string) => {
          updatePolicyOfNode(id, { policy_id: policyId });
        });
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmit = (policyId: string) => {
    if (policy) {
      const checkInValidPolicy =
        Number(policy.cpu_limit) < 0 ||
        Number(policy.cpu_limit) > 100 ||
        Number(policy.cpu_thresh) < 0 ||
        Number(policy.cpu_thresh) > 100;
      if (checkInValidPolicy) {
        notifications.show({
          icon: <AlertCircle size="1rem" color="red" />,
          color: 'red',
          title: NOTIFICATIONS.INVALID_INPUT_KOR,
          message: NOTIFICATIONS.SAVED_CHANGES_KOR,
        });
        return;
      }
    }
    setTimeout(() => {
      toggleValidModal();
    }, 200);
  };

  const onChangeValue = (field: keyof IPolicy, value: string | boolean) => {
    setPolicy({
      ...policy,
      [field]: value,
    });
  };

  const onChangeSelectNode = (value: string[]) => {
    setNodeSelected(value);
  };

  const updatePolicy = (policyId: string, policy: IPolicyUpdate) => {
    const updateData = {
      name: policy.name,
      cpu_limit: policy.cpu_limit,
      cpu_thresh: policy.cpu_thresh,
      num_edges: policy.num_edges,
      is_activated: policy.is_activated,
    };
    updatePolicyById(policyId, updateData).subscribe({
      next: () => {
        onSave();
        updateNode(nodeSelected, policyId);
        onClose();
      },
      error: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <Box key={id}>
      <Title order={2} align="center" color="white">{`Policy Detail: ${policy.name}`}</Title>
      <Group style={{ justifyContent: 'center', marginTop: '0.5rem' }} my="sm" position="apart">
        <Switch
          label={
            is_activated ? (
              <Text color="white">Activated</Text>
            ) : (
              <Text color="white">Deactivated</Text>
            )
          }
          checked={is_activated}
          onChange={(event) => {
            onChangeValue('is_activated', event.currentTarget.checked);
          }}
        />
      </Group>
      <Group mt="md" align={'flex-start'} my="sm" position="apart">
        <Text color="white">Name:</Text>
        <Input
          onChange={(value) => onChangeValue('name', value.target.value)}
          className="modal-input"
          value={name || ''}
          placeholder="Input Value"
        />
      </Group>
      <Group my="sm" position="apart">
        <Text color="white">CPU Thresh</Text>
        <Input
          className="modal-input"
          value={cpu_thresh || ''}
          onChange={(value) => onChangeValue('cpu_thresh', value.target.value)}
          placeholder="Input Value"
        />
      </Group>
      <Group my="sm" position="apart">
        <Text color="white">CPU Limit:</Text>
        <Input
          className="modal-input"
          value={cpu_limit || ''}
          onChange={(value) => onChangeValue('cpu_limit', value.target.value)}
          placeholder="Input Value"
        />
      </Group>
      <Group my="sm" position="apart">
        <Text color="white">Number resend node:</Text>
        <Input
          className="modal-input"
          value={num_edges || ''}
          onChange={(value) => onChangeValue('num_edges', value.target.value)}
          placeholder="Input Value"
        />
      </Group>
      <Group style={{ width: '100%' }}>
        <MultiSelect
          style={{ width: '100%' }}
          data={listNode}
          value={nodeSelected}
          onChange={onChangeSelectNode}
          label="Select Edges to apply this policy"
          placeholder="Pick all that you like"
          searchable
          nothingFound="Nothing found"
        />
      </Group>
      <Group mt="xl" style={{ justifyContent: 'center' }}>
        <Button color="red" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSubmit(id);
          }}
        >
          Save
        </Button>
      </Group>
      <LoadingOverlay
        visible={showValidModal}
        overlayBlur={2}
        loaderProps={{ color: 'white' }}
        sx={{ position: 'fixed' }}
      />
      <Modal
        title={
          <Text size={'lg'} color="black" weight={500}>
            Update Policy Information
          </Text>
        }
        opened={showValidModal}
        withCloseButton={false}
        size={'md'}
        onClose={toggleValidModal}
        centered
      >
        <ValidModal onClose={toggleValidModal} dataId={id} data={policy} onSave={updatePolicy} />
      </Modal>
    </Box>
  );
};

export default PolicyModalDetail;
