import { LoginContext } from '@/App';
import { EVENT_PAGE_QUOTE, NOTIFICATIONS } from '@/constants';
import { ListEventIds } from '@/interfaces/interfaceListEvent';
import { downloadEvents } from '@/services/ListEventAPI';
import { Button, Group, NativeSelect, Title, createStyles } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import saveAs from 'file-saver';
import { Dispatch, SetStateAction, useContext, useRef } from 'react';
import { CircleX, Download, EraserOff, Search, Upload, X } from 'tabler-icons-react';

interface CommunicationButtonProps {
  removeFlag: boolean;
  setRemoveFlag: Dispatch<SetStateAction<boolean>>;
  searchFlag: boolean;
  setSearchFlag: Dispatch<SetStateAction<boolean>>;
  setCurrentPageSize: Dispatch<SetStateAction<number>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  listEvent: string[];
  setButtontype: Dispatch<SetStateAction<string | null>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const useStyles = createStyles((theme) => ({
  button: {
    alignItems: 'center',
    borderRadius: theme.radius.md,
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  redButton: {
    backgroundColor: theme.colors.red[5],
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: '20px',
    borderRadius: theme.radius.md,
    '&:hover': {
      backgroundColor: theme.colors.red[6],
    },
  },
  blueButton: {
    backgroundColor: theme.colors.blue[5],
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: '20px',
    borderRadius: theme.radius.md,
    '&:hover': {
      backgroundColor: theme.colors.blue[6],
    },
  },

  greenButton: {
    backgroundColor: theme.colors.green[5],
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: '20px',
    borderRadius: theme.radius.md,
    '&:hover': {
      backgroundColor: theme.colors.green[6],
    },
  },
  grayButton: {
    backgroundColor: theme.colors.gray[5],
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: '20px',
    borderRadius: theme.radius.md,
    '&:hover': {
      backgroundColor: theme.colors.gray[6],
    },
  },
}));

const CommunicationButton = (props: CommunicationButtonProps) => {
  const {
    removeFlag,
    setRemoveFlag,
    searchFlag,
    setSearchFlag,
    setCurrentPageSize,
    setCurrentPage,
    listEvent,
    setButtontype,
    setIsOpen,
  } = props;
  const { classes, cx } = useStyles();
  const ref = useRef(null);
  const { currentUser } = useContext(LoginContext);

  const handleRemoveFilter = () => {
    setRemoveFlag(!removeFlag);
  };

  const handleSearch = () => {
    setSearchFlag(!searchFlag);
    setCurrentPage(1);
  };

  const handleChangePageSize = (value: string) => {
    setCurrentPageSize(parseInt(value));
    setCurrentPage(1);
  };

  const handleDownload = (log: boolean) => {
    const events: ListEventIds = {
      type: 2,
      eventIds: listEvent,
      log: log,
    };
    downloadEvents(events).subscribe({
      next: (response: any) => {
        const blob = new Blob([response.data], { type: 'application/csv' });
        const filename = 'data.csv';
        saveAs(blob, filename);
      },
    });
  };

  const handleClearData = () => {
    setButtontype('clear');
    setIsOpen(true);
  };

  const handleImport = () => {
    setButtontype('upload');
    setIsOpen(true);
  };

  return (
    <Group className={cx(classes.button)}>
      <Group>
        <Button
          leftIcon={<X size={14} strokeWidth={3} color={'white'} />}
          onClick={handleRemoveFilter}
          className={cx(classes.redButton)}
        >
          초기화
        </Button>
        <Button
          leftIcon={<Search size={14} strokeWidth={3} color={'white'} />}
          onClick={handleSearch}
          className={cx(classes.blueButton)}
        >
          검색
        </Button>
        <Group>
          <Title fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'} pt={'2px'}>
            {EVENT_PAGE_QUOTE.PAGE_SIZE_KOR}
          </Title>
          <NativeSelect
            data={['10', '20', '50']}
            defaultValue={'20'}
            ref={ref}
            color="white"
            onChange={(event) => handleChangePageSize(event.currentTarget.value)}
          />
        </Group>
      </Group>
      <Group>
        <Button
          className={cx(classes.greenButton)}
          leftIcon={<Download size={14} strokeWidth={3} color={'white'} />}
          onClick={() => {
            if (listEvent.length > 0) {
              handleDownload(true);
            } else {
              notifications.show({
                icon: <CircleX size="1rem" color="red" />,
                autoClose: 2000,
                color: 'red',
                title: NOTIFICATIONS.NOTICED_KOR,
                message: NOTIFICATIONS.NOTICED__MESS_KOR,
              });
            }
          }}
        >
          로그 내보내기
        </Button>
        {currentUser.username === 'root' ? (
          <>
            <Button
              className={cx(classes.greenButton)}
              leftIcon={<Download size={14} strokeWidth={3} color={'white'} />}
              onClick={() => {
                if (listEvent.length > 0) {
                  handleDownload(false);
                } else {
                  notifications.show({
                    icon: <CircleX size="1rem" color="red" />,
                    autoClose: 2000,
                    color: 'red',
                    title: NOTIFICATIONS.NOTICED_KOR,
                    message: NOTIFICATIONS.NOTICED__MESS_KOR,
                  });
                }
              }}
            >
              내보내기
            </Button>
            <Button
              leftIcon={<Upload size={14} strokeWidth={3} color={'white'} />}
              className={cx(classes.greenButton)}
              onClick={handleImport}
            >
              {EVENT_PAGE_QUOTE.BUTTON_UPLOAD}
            </Button>
            <Button
              leftIcon={<EraserOff size={18} strokeWidth={2} color={'white'} />}
              className={cx(classes.grayButton)}
              onClick={handleClearData}
            >
              {EVENT_PAGE_QUOTE.BUTTON_CLEAR_DATA}
            </Button>
          </>
        ) : null}
      </Group>
    </Group>
  );
};

export default CommunicationButton;
