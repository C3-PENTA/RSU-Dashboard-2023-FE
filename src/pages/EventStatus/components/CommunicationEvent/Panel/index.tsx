import { EVENT_PAGE_QUOTE } from '@/constants';
import { MetaData } from '@/interfaces/interfaceListEvent';
import { Checkbox, Grid, MultiSelect, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface CommunicationPanelProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  setNodeId: Dispatch<SetStateAction<string>>;
  setStatus: Dispatch<SetStateAction<string>>;
  metaData: MetaData;
  setCooperationClass: Dispatch<SetStateAction<string>>;
  setSessionID: Dispatch<SetStateAction<string>>;
  setCommunicationMethod: Dispatch<SetStateAction<string>>;
  setCommunicationClass: Dispatch<SetStateAction<string>>;
  setMessageType: Dispatch<SetStateAction<string>>;
  removeFlag: boolean;
}

const CommunicationPanel = (props: CommunicationPanelProps) => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setNodeId,
    setStatus,
    metaData,
    setCooperationClass,
    setSessionID,
    setMessageType,
    setCommunicationMethod,
    setCommunicationClass,
    removeFlag,
  } = props;

  let now: Date | string = new Date();
  now = now.toISOString().slice(0, 10);
  const [minDate, setMinDate] = useState(new Date('1000-01-01'));
  const [maxDate, setMaxDate] = useState(new Date(now));
  const [checked, setChecked] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<string[]>(['']);
  const [selectedCooperationClass, setSelectedCooperationClass] = useState<string[]>(['']);
  const [selectedMessageType, setSelectedMessageType] = useState<string[]>(['']);
  const [selectedSessionID, setSelectedSessionID] = useState<string[]>(['']);
  const [selectedCommunicationClass, setSelectedCommunicationClass] = useState<string[]>(['']);
  const [selectedCommunicationMethod, setSelectedCommunicationMethod] = useState<string[]>(['']);

  const handleMinDate = (value: Date | null) => {
    if (value) {
      setMinDate(value);
      setStartDate(value);
    }
  };

  const handleMaxDate = (value: Date | null) => {
    if (value) {
      setMaxDate(value);
      setEndDate(value);
    }
  };

  const handleNodeID = (value: string[]) => {
    setNodeId(value.join('&node-id='));
    setSelectedNode(value);
  };

  const handleIsError = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setStatus('2');
      setChecked(true);
      return;
    }
    setStatus('');
    setChecked(false);
  };

  const handleCooperationClass = (value: string[]) => {
    setCooperationClass(value.join('&cooperation-class='));
    setSelectedCooperationClass(value);
  };

  const handleMessageType = (value: string[]) => {
    setMessageType(value.join('&message-type='));
    setSelectedMessageType(value);
  };

  const handleCommunicationClass = (value: string[]) => {
    setCommunicationClass(value.join('&communication-class='));
    setSelectedCommunicationClass(value);
  };

  const handleCommunicationMethod = (value: string[]) => {
    setCommunicationMethod(value.join('&communication-method='));
    setSelectedCommunicationMethod(value);
  };

  const handleSessionID = (value: string[]) => {
    setSessionID(value.join('&session-id='));
    setSelectedSessionID(value);
  };

  useEffect(() => {
    setStartDate(null);
    setMinDate(new Date('1000-01-01'));
    setEndDate(null);
    setMaxDate(new Date(now));
    setChecked(false);
    setNodeId('');
    setStatus('');
    setSelectedNode(['']);
    setSelectedMessageType(['']);
    setSelectedCommunicationClass(['']);
    setSelectedCommunicationMethod(['']);
    setSelectedCooperationClass(['']);
    setSelectedSessionID(['']);
  }, [removeFlag]);

  return (
    <Grid pt={'16px'} style={{ margin: 0 }}>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'}>
          시작일:
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <DateInput
          allowDeselect
          maxDate={maxDate}
          valueFormat="YYYY-MM-DD"
          placeholder={EVENT_PAGE_QUOTE.CHOOSE_DATE_KOR}
          radius="md"
          value={startDate}
          onChange={handleMinDate}
        />
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'}>
          종료일:
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <DateInput
          allowDeselect
          minDate={minDate}
          // maxDate={maxDate}
          valueFormat="YYYY-MM-DD"
          placeholder={EVENT_PAGE_QUOTE.CHOOSE_DATE_KOR}
          radius="md"
          value={endDate}
          onChange={handleMaxDate}
        />
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={2}>
        <Checkbox
          labelPosition="right"
          label={
            <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'} color="white">
              오류 유무
            </Text>
          }
          pt={'8px'}
          size="xs"
          checked={checked}
          onChange={handleIsError}
        />
      </Grid.Col>
      <Grid.Col span={2}></Grid.Col>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'}>
          노드 ID:
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <MultiSelect
          data={Object.entries(metaData.nodeList)
            .map(([label, value]) => ({
              value: value.toString(),
              label,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))}
          placeholder={EVENT_PAGE_QUOTE.CHOOSE_NODE_ID_KOR}
          radius="md"
          searchable
          value={selectedNode}
          onChange={handleNodeID}
        />
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'}>
          주행협상 클래스:
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <MultiSelect
          data={Object.entries(metaData.cooperationClass).map(([label, value]) => ({
            value: value.toString(),
            label,
          }))}
          placeholder="Cooperation Class"
          radius="md"
          searchable
          value={selectedCooperationClass}
          onChange={handleCooperationClass}
        />
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'}>
          Session ID:
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <MultiSelect
          data={Object.entries(metaData.sessionID).map(([label, value]) => ({
            value: value.toString(),
            label,
          }))}
          placeholder="Session ID"
          radius="md"
          searchable
          value={selectedSessionID}
          onChange={handleSessionID}
        />
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'}>
          Communication Class:
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <MultiSelect
          data={Object.entries(metaData.communicationClass).map(([label, value]) => ({
            value: value.toString(),
            label,
          }))}
          placeholder="Communication Class"
          radius="md"
          searchable
          value={selectedCommunicationClass}
          onChange={handleCommunicationClass}
        />
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'}>
          메시지 종류:
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <MultiSelect
          data={Object.entries(metaData.messageType).map(([label, value]) => ({
            value: value.toString(),
            label,
          }))}
          placeholder={EVENT_PAGE_QUOTE.CHOOSE_MESSAGE_TYPE_KOR}
          radius="md"
          searchable
          value={selectedMessageType}
          onChange={handleMessageType}
        />
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'}>
          통신 방법:
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <MultiSelect
          data={Object.entries(metaData.communicationMethod).map(([label, value]) => ({
            value: value.toString(),
            label,
          }))}
          placeholder="통신 방법"
          radius="md"
          searchable
          value={selectedCommunicationMethod}
          onChange={handleCommunicationMethod}
        />
      </Grid.Col>
    </Grid>
  );
};

export default CommunicationPanel;
