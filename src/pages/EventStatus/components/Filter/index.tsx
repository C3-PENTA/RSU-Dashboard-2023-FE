import { useState, useEffect } from 'react';
import { Text, MultiSelect, Checkbox, Grid } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { EVENT_PAGE_QUOTE } from '@/constants';
import { MetaData } from '@/interfaces/interfaceListEvent';

interface FilterProps {
  listNode: string[];
  type: number;
  removeFilter: boolean;
  setStDate: (newValue: string) => void;
  setEdDate: (newValue: string) => void;
  setNodeID: (newValue: string) => void;
  setIsError: (newValue: string) => void;
  setDriving: (newValue: string) => void;
  setMessage: (newValue: string) => void;
  metaData: MetaData;
}

const Filter = (props: FilterProps) => {
  const {
    type,
    removeFilter,
    setStDate,
    setEdDate,
    setNodeID,
    setIsError,
    setDriving,
    setMessage,
    metaData,
  } = props;
  const [minDate, setMinDate] = useState(new Date('1000-01-01'));
  const [maxDate, setMaxDate] = useState(new Date('9000-01-01'));
  const [stDateValue, setStDateValue] = useState<Date | null>(null);
  const [edDateValue, setEdDateValue] = useState<Date | null>(null);
  const [multiSelectValue, setMultiSelectValue] = useState(['']);
  const [drivingValue, setDrivingValue] = useState(['']);
  const [messageValue, setMessageValue] = useState(['']);
  const [checkBoxStatus, setCheckBoxStatus] = useState(false);
  const [displayStatus, setDisplayStatus] = useState('none');

  const handleMinDate = async (event: Date | null) => {
    await setStDateValue(event);
    if (event !== null) {
      setMinDate(event);
      setStDate(event.toISOString());
    } else {
      setMinDate(new Date('1000-01-01'));
      setStDate('');
    }
  };
  const handleMaxDate = async (event: Date | null) => {
    await setEdDateValue(event);
    if (event !== null) {
      setMaxDate(event);
      setEdDate(event.toISOString());
    } else {
      setMaxDate(new Date('9000-01-01'));
      setEdDate('');
    }
  };

  const handleNodeID = async (value: string[]) => {
    await setNodeID(value.join('&node-id='));
    await setMultiSelectValue(value);
  };

  const handleDriving = async (value: string[]) => {
    await setDriving(value.join('&driving-negotiation-class='));
    await setDrivingValue(value);
  };

  const handleMessage = async (value: string[]) => {
    await setMessage(value.join('&message-type='));
    await setMessageValue(value);
  };

  const handleIsError = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      await setIsError('2');
      await setCheckBoxStatus(true);
    } else {
      await setIsError('');
      await setCheckBoxStatus(false);
    }
  };

  useEffect(() => {
    if (type === 2) {
      setDisplayStatus('');
    } else {
      setDisplayStatus('none');
    }
  }, [type]);

  useEffect(() => {
    handleMaxDate(null);
    handleMinDate(null);
    handleNodeID(['']);
    handleIsError({ target: { checked: false } } as React.ChangeEvent<HTMLInputElement>);
    handleDriving(['']);
    handleMessage(['']);
  }, [type, removeFilter]);
  return displayStatus === 'none' ? (
    <Grid pt={'16px'} style={{ margin: 0 }}>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={700} fz={'12px'} lts={'0.6px'} lh={'16px'}>
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
          value={stDateValue}
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
          valueFormat="YYYY-MM-DD"
          placeholder={EVENT_PAGE_QUOTE.CHOOSE_DATE_KOR}
          radius="md"
          value={edDateValue}
          onChange={handleMaxDate}
        />
      </Grid.Col>
      <Grid.Col span={5}></Grid.Col>
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
          maw={300}
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
          checked={checkBoxStatus}
          onChange={handleIsError}
        />
      </Grid.Col>
    </Grid>
  ) : (
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
          value={stDateValue}
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
          valueFormat="YYYY-MM-DD"
          placeholder={EVENT_PAGE_QUOTE.CHOOSE_DATE_KOR}
          radius="md"
          value={edDateValue}
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
          checked={checkBoxStatus}
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
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'} style={{ display: displayStatus }}>
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
          onChange={handleDriving}
          style={{ display: displayStatus }}
        />
      </Grid.Col>
      <Grid.Col span={1}></Grid.Col>
      <Grid.Col span={1} style={{ padding: '18px 0px' }}>
        <Text fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'} style={{ display: displayStatus }}>
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
          onChange={handleMessage}
          style={{ display: displayStatus }}
        />
      </Grid.Col>
    </Grid>
  );
};
export default Filter;
