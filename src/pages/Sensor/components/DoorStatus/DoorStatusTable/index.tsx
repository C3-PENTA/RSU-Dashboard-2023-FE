import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Table, createStyles, rem, ScrollArea, Text } from '@mantine/core';
import { BiUpArrow, BiDownArrow } from 'react-icons/bi';
import moment from 'moment';
import { IDoorStatusData } from '..';

interface DoorStatusProps {
  currentPage: number;
  setListEvent: Dispatch<SetStateAction<string[]>>;
  setOrder: Dispatch<SetStateAction<string>>;
  eventData: IDoorStatusData[];
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

const DoorStatusTable = (props: DoorStatusProps) => {
  const { currentPage, setOrder, eventData, setListEvent } = props;
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
            <th className={cx(classes.headerCell)}>
              <div style={{ display: 'flex' }}>
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
            <th className={cx(classes.headerCell)}>Door Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((items, index) => (
            <tr key={index} className={cx(classes.row)}>
              <td className={cx(classes.cell)}>
                <Text color="white">
                  {moment(items.timestamp).local().format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </td>
              <td className={cx(classes.cell)}>{items.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea.Autosize>
  );
};
export default DoorStatusTable;
