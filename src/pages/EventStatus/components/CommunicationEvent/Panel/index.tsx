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
  setStatus: Dispatch<SetStateAction<number>>;
  metaData: MetaData;
  setDrivingNeotiationsClass: Dispatch<SetStateAction<string>>;
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
    setDrivingNeotiationsClass,
    setMessageType,
    removeFlag,
  } = props;
  let now: Date | string = new Date();
  now = now.toISOString().slice(0, 10);
  const [minDate, setMinDate] = useState(new Date('1000-01-01'));
  const [maxDate, setMaxDate] = useState(new Date(now));
  const [checked, setChecked] = useState<boolean>(false);
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>(['']);
  const [drivingValue, setDrivingValue] = useState<string[]>(['']);
  const [messageValue, setMessageValue] = useState(['']);

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
    setNodeId(value.join('&nodeID='));
    setMultiSelectValue(value);
  };

  const handleIsError = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setStatus(2);
      setChecked(true);
      return;
    }
    setStatus(1);
    setChecked(false);
  };

  const handleDrivingNegotiationClass = (value: string[]) => {
    setDrivingNeotiationsClass(value.join('&drivingNegotiation='));
    setDrivingValue(value);
  };

  const handleMessageType = (value: string[]) => {
    setMessageType(value.join('&memessageType'));
    setMessageValue(value);
  };

  useEffect(() => {
    setStartDate(null);
    setMinDate(new Date('1000-01-01'));
    setEndDate(null);
    setMaxDate(new Date(now));
    setMultiSelectValue(['']);
    setChecked(false);
    setNodeId('');
    setStatus(1);
    setMessageValue(['']);
    setDrivingValue(['']);
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
          value={multiSelectValue}
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
          data={Object.entries(metaData.drivingNegotiationsClass).map(([label, value]) => ({
            value: value.toString(),
            label,
          }))}
          placeholder="주행을 선택하십시오"
          radius="md"
          searchable
          value={drivingValue}
          onChange={handleDrivingNegotiationClass}
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
          value={messageValue}
          onChange={handleMessageType}
        />
      </Grid.Col>
    </Grid>
  );
};

export default CommunicationPanel;
