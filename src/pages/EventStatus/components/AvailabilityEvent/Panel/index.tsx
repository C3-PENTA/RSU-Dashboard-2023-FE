import { EVENT_PAGE_QUOTE } from '@/constants';
import { MetaData } from '@/interfaces/interfaceListEvent';
import { Checkbox, Grid, MultiSelect, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface AvailabilityPanelProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  setNodeId: Dispatch<SetStateAction<string>>;
  setStatus: Dispatch<SetStateAction<string>>;
  metaData: MetaData;
  removeFlag: boolean;
}

const AvailabilityPanel = (props: AvailabilityPanelProps) => {
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setNodeId,
    setStatus,
    metaData,
    removeFlag,
  } = props;
  let now: Date | string = new Date();
  now = now.toISOString().slice(0, 10);
  const [minDate, setMinDate] = useState(new Date('1000-01-01'));
  const [maxDate, setMaxDate] = useState(new Date(now));
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>(['']);
  const [checked, setChecked] = useState<boolean>(false);

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
    setMultiSelectValue(value);
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

  useEffect(() => {
    setStartDate(null);
    setMinDate(new Date('1000-01-01'));
    setEndDate(null);
    setMaxDate(new Date(now));
    setMultiSelectValue(['']);
    setChecked(false);
    setNodeId('');
    setStatus('');
  }, [removeFlag]);

  return (
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
          checked={checked}
          onChange={handleIsError}
        />
      </Grid.Col>
    </Grid>
  );
};

export default AvailabilityPanel;
