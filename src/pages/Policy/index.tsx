/* eslint-disable camelcase */
import { INodeByPolicy, IPolicy } from '@/interfaces/interfacePolicy';
import { getListPolicy, updatePolicyById } from '@/services/PolicyAPI';
import { Badge, Box, Button, Card, Group, LoadingOverlay, Switch, Text } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react';
import { Edit } from 'tabler-icons-react';
import PolicyModal from './components/PolicyModal';
import './Policy.scss';
import { HeaderTitle, NoData, NotAuthorized } from '@/components';
import { PAGE_TITLE, Role } from '@/constants';
import { LoginContext } from '@/App';

const initPolicy = {
  id: '',
  name: '',
  description: '',
  cpu_limit: 0,
  cpu_thresh: 0,
  num_edges: 0,
  is_activated: false,
  assignedNodes: [],
  unAssignedNodes: [],
};
const Policy = () => {
  const { setLoginState, currentUser } = useContext(LoginContext);

  const [polices, setPolicies] = useState<IPolicy[]>([]);
  const [loadedAPI, setLoadedAPI] = useState(false);
  const [isLoadingInternal, setLoadingInternal] = useState(false);
  const [isAuthorized, setAuthorized] = useState(currentUser.role.name !== Role.NORMAL);
  const [showModal, toggleModal] = useToggle();
  const [policySelected, setPolicy] = useState<IPolicy>(initPolicy);

  useEffect(() => {
    getPolicies();
  }, []);

  const getPolicies = () => {
    setLoginState(currentUser.exp > Date.now() / 1000);
    if (currentUser.exp > Date.now() / 1000) {
      setLoadingInternal(true);
      getListPolicy().subscribe({
        next: ({ data }) => {
          setPolicies(data);
          setLoadedAPI(true);
          setLoadingInternal(false);
        },
        error(err) {
          if (err.response.data.statusCode === 403 || err.response.data.statusCode === 401) {
            setAuthorized(false);
          }
          setLoadedAPI(true);
          setLoadingInternal(false);
        },
      });
    }
  };

  const onChangeValue = (policyId: string, value: boolean) => {
    if (currentUser.exp < Date.now() / 1000) {
      setLoginState(false);
    } else {
      const policy = {
        is_activated: value,
      };
      setLoadingInternal(true);
      updatePolicyById(policyId, policy).subscribe({
        next: () => {
          getPolicies();
          setLoadingInternal(false);
        },
        error() {
          setLoadingInternal(false);
        },
      });
    }
  };

  const onOpenModal = (policy: IPolicy) => {
    setLoginState(currentUser.exp > Date.now() / 1000);
    toggleModal();
    setPolicy(policy);
  };

  const renderNodeList = (nodeList: INodeByPolicy[]) => {
    return nodeList.map((node: INodeByPolicy) => {
      return (
        <Badge key={node.nodeId}>
          <Text>{node.nodeName}</Text>
        </Badge>
      );
    });
  };

  return (
    <Box p={'16px'} sx={{ height: 'auto', borderRadius: 8 }}>
      <HeaderTitle label={PAGE_TITLE.POLICY_KOR} />
      {!isAuthorized ? (
        <NotAuthorized />
      ) : polices.length > 0 ? (
        polices.map((policy) => {
          const {
            id,
            name,
            description,
            cpu_limit,
            cpu_thresh,
            num_edges,
            is_activated,
            assignedNodes,
          } = policy;
          return (
            <Box key={`${id}-${name}`}>
              <Card
                className="policy-container"
                shadow={'sm'}
                withBorder
                sx={(theme) => ({
                  backgroundColor: theme.colors.gray[7],
                  borderRadius: '5px',
                })}
              >
                <Card.Section className="item" sx={{ borderRadius: '5px' }}>
                  <Box style={{ alignItems: 'flex-end', marginBottom: 10 }}>
                    <Box>
                      <Group>
                        <Text weight={'bold'} color={'white'} size={20}>
                          {name}
                        </Text>
                        <Button
                          onClick={() => onOpenModal(policy)}
                          variant="outline"
                          compact
                          style={{ width: '70px' }}
                          leftIcon={<Edit size={14} color="white" />}
                        >
                          <Text weight={'bold'} color={'white'}>
                            Edit
                          </Text>
                        </Button>
                      </Group>
                      {description && (
                        <Text
                          style={{ inlineSize: '40vw', overflowWrap: 'break-word', width: '100%' }}
                          italic
                          size={14}
                          color={'white'}
                          className="description"
                        >
                          {description}
                        </Text>
                      )}
                      <Group my="md">{renderNodeList(assignedNodes)}</Group>
                    </Box>
                  </Box>
                  <Group grow style={{ alignItems: 'center', display: 'flex' }}>
                    <Group>
                      <Text className="text-sm" color="white">
                        CPU Limit: {cpu_limit || 0}%
                      </Text>
                    </Group>
                    <Group>
                      <Text className="text-sm" color="white">
                        CPU Thresh: {cpu_thresh || 100}%
                      </Text>
                    </Group>
                    <Group>
                      <Text className="text-sm" color="white">
                        Number resend node: {num_edges || 0}
                      </Text>
                    </Group>
                    <Switch
                      style={{ display: 'flex', color: 'white' }}
                      label={
                        is_activated ? (
                          <Text weight={'bold'} color={'white'}>
                            Activated
                          </Text>
                        ) : (
                          <Text weight={'bold'} color={'white'}>
                            Deactivated
                          </Text>
                        )
                      }
                      checked={is_activated}
                      onChange={(event) => onChangeValue(id, event.currentTarget.checked)}
                    />
                  </Group>
                </Card.Section>
              </Card>
            </Box>
          );
        })
      ) : (
        loadedAPI && <NoData />
      )}
      <PolicyModal
        onSave={getPolicies}
        visible={showModal}
        onClose={toggleModal}
        policy={policySelected}
      />
      <LoadingOverlay visible={isLoadingInternal} overlayBlur={2} sx={{ position: 'fixed' }} />
    </Box>
  );
};

export default Policy;
