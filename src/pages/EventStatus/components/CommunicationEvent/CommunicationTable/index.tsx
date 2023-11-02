import { Table, Checkbox, createStyles, rem, ScrollArea, Text } from '@mantine/core';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { BiUpArrow, BiDownArrow } from 'react-icons/bi';
import moment from 'moment';
import { ICommunicationEventData } from '..';

interface CommunicationProps {
  currentPage: number;
  setListEvent: Dispatch<SetStateAction<string[]>>;
  setOrder: Dispatch<SetStateAction<string>>;
  eventData: ICommunicationEventData[];
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

const CommunicationTable = (props: CommunicationProps) => {
  const { currentPage, setListEvent, setOrder, eventData } = props;
  const data = eventData;
  const [tickAll, setTickAll] = useState(false);
  const [subCheckBoxes, setSubCheckBoxes] = useState(Array(data.length).fill(false));
  const [isToggled, setIsToggled] = useState(true);
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    if (isToggled) {
      setOrder('asc');
    } else {
      setOrder('desc');
    }
  };

  const handleTickAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setTickAll(isChecked);
    setSubCheckBoxes(Array(data.length).fill(isChecked));
    if (isChecked) {
      const allIds = data.map((items) => items.id);
      setListEvent(allIds);
    } else {
      setListEvent(['']);
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
  }, [currentPage, eventData]);

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
            <th>
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
            <th>Cooperation Class</th>
            <th>Session ID</th>
            <th>Communication Class</th>
            <th>메시지 종류</th>
            <th>노드 ID</th>
            <th>RSU 명칭</th>
            <th>통신 방법</th>
            <th>송신 노드</th>
            <th>수신 노드</th>
            <th>오류 상세</th>
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
              <td className={cx(classes.cell)}>{items.cooperationClass}</td>
              <td className={cx(classes.cell)}>{items.sessionID}</td>
              <td className={cx(classes.cell)}>{items.communicationClass}</td>
              <td className={cx(classes.cell)}>{items.messageType}</td>
              <td className={cx(classes.cell)}>{items.nodeId}</td>
              <td className={cx(classes.cell)}>{items.nodeType}</td>
              <td className={cx(classes.cell)}>{items.method}</td>
              <td className={cx(classes.cell)}>{items.srcNode}</td>
              <td className={cx(classes.cell)}>{items.destNode}</td>
              <td className={cx(classes.cell)}>{items.detail}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea.Autosize>
  );
};
export default CommunicationTable;
