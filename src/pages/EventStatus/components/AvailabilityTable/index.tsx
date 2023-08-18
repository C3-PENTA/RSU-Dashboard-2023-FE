import { useEffect, useState } from 'react';
import { Table, Checkbox, createStyles, rem, ScrollArea, Text } from '@mantine/core';
import { BiUpArrow, BiDownArrow } from 'react-icons/bi';
import moment from 'moment';
interface AvailabilityProps {
  type: number;
  currentPage: number;
  setListEvent: React.Dispatch<React.SetStateAction<string[]>>;
  setOrder: (newValue: string) => void;
  items: {
    id: string;
    createdAt: string;
    nodeId: string;
    nodeType: string;
    cpuUsage: string;
    cpuTemp: string;
    ramUsage: string;
    diskUsage: string;
    networkSpeed: string;
    networkUsage: string;
    networkStatus: string;
    detail: string;
    status: number;
  }[];
}

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colors.gray[6],
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
  },

  headerCell: {
    borderBottom: 'none',
  },

  text: {
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    lineHeight: '20px',
  },

  row: {
    backgroundColor: theme.colors.gray[7],
  },

  cell: {
    borderBottom: `${rem(1)} solid ${theme.colors['white-alpha'][2]}`,
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const AvailabilityTable = (props: AvailabilityProps) => {
  const { type, currentPage, setListEvent, setOrder, items } = props;
  const data = items;
  const [tickAll, setTickAll] = useState(false);
  const [subCheckBoxes, setSubCheckBoxes] = useState(Array(data.length).fill(false));
  const [isToggled, setIsToggled] = useState(true);
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const handleToggle = async () => {
    await setIsToggled(!isToggled);
    if (isToggled) {
      await setOrder('asc');
    } else {
      await setOrder('desc');
    }
  };

  const handleTickAll = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setTickAll(isChecked);
    setSubCheckBoxes(Array(data.length).fill(isChecked));
    if (isChecked) {
      const allIds = data.map((items) => items.id);
      await setListEvent(allIds);
    } else {
      await setListEvent([]);
    }
  };

  const handleSubCheckBox = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSubCheckBoxes((prevState) => {
      const newCheckBoxes = [...prevState];
      newCheckBoxes[index] = isChecked;
      return newCheckBoxes;
    });
    setListEvent((prevListEvent) => {
      const updatedList = prevListEvent.filter(Boolean);
      if (isChecked) {
        return [...updatedList, data[index].id];
      } else {
        return updatedList.filter((id) => id !== data[index].id);
      }
    });
  };

  useEffect(() => {
    setTickAll(false);
    setSubCheckBoxes(Array(data.length).fill(false));
  }, [currentPage, type]);

  return (
    <ScrollArea.Autosize
      mah={'80vh'}
      sx={(theme) => ({
        borderRadius: '16px',
        padding: '16px',
        backgroundColor: theme.colors.gray[7],
      })}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table className={cx(classes.text)} verticalSpacing={'xs'}>
        <thead
          className={cx(classes.header, { [classes.scrolled]: scrolled })}
          style={{ zIndex: 1 }}
        >
          <tr>
            <th className={cx(classes.headerCell)}>
              <div style={{ display: 'flex' }}>
                <Checkbox
                  checked={tickAll}
                  onChange={handleTickAll}
                  style={{ marginRight: '5%' }}
                />
                발생 시간 &nbsp;
                <span>
                  {isToggled ? (
                    <BiDownArrow size={12} onClick={handleToggle} />
                  ) : (
                    <BiUpArrow size={12} onClick={handleToggle} />
                  )}
                </span>
              </div>
            </th>
            <th className={cx(classes.headerCell)}>노드 ID</th>
            <th className={cx(classes.headerCell)}>RSU 명칭</th>
            <th className={cx(classes.headerCell)}>CPU 사용량</th>
            <th className={cx(classes.headerCell)}>CPU 온도</th>
            <th className={cx(classes.headerCell)}>RAM 사용량</th>
            <th className={cx(classes.headerCell)}>DISK 사용량</th>
            <th className={cx(classes.headerCell)}>네트워크 연결상태</th>
            <th className={cx(classes.headerCell)}>네트워크속도(Mbps)</th>
            <th className={cx(classes.headerCell)}>네트워크 사용량(Byte)</th>
            <th className={cx(classes.headerCell)}>오류 상세</th>
          </tr>
        </thead>
        <tbody>
          {data.map((items, index) => (
            <tr key={index} className={cx(classes.row)}>
              <td className={cx(classes.cell)}>
                <Checkbox
                  checked={subCheckBoxes[index]}
                  onChange={handleSubCheckBox(index)}
                  label={
                    <Text color="white">
                      {moment(items.createdAt).local().format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  }
                />
              </td>
              <td className={cx(classes.cell)}>{items.nodeId}</td>
              <td className={cx(classes.cell)}>{items.nodeType}</td>
              <td className={cx(classes.cell)}>{items.cpuUsage}</td>
              <td className={cx(classes.cell)}>{items.cpuTemp}</td>
              <td className={cx(classes.cell)}>{items.ramUsage}</td>
              <td className={cx(classes.cell)}>{items.diskUsage}</td>
              <td className={cx(classes.cell)}>{items.networkStatus}</td>
              <td className={cx(classes.cell)}>{items.networkSpeed}</td>
              <td className={cx(classes.cell)}>{items.networkUsage}</td>
              <td className={cx(classes.cell)}>{items.detail}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea.Autosize>
  );
};
export default AvailabilityTable;
