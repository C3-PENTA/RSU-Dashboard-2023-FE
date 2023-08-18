import React, { ReactNode, useEffect, useState } from 'react';
import { Button, FileButton, Group, Modal, createStyles } from '@mantine/core';
import { AlertTriangle, Upload } from 'tabler-icons-react';
// import './index.scss';

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  typeBt?: string;
  header: string;
  caption: string;
  listButton: {
    title: string;
    onPress?: ((payload: File | null) => void | null) | (() => void | null) | any;
    buttonType?: string | null;
    buttonClass?: string | null;
  }[];
  buttonContainerClass?: string;
}

const useStyles = createStyles((theme) => ({
  modaltTitle: {
    color: theme.colors.yellow[2],
    gap: '10px',
    fontSize: theme.fontSizes.lg,
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

  caption: {
    color: theme.white,
    textAlign: 'justify',
    paddingBottom: '24px',
  },
}));

function PModal(props: ModalType) {
  const { onClose, isOpen, listButton, header, caption } = props;
  const [isVisible, setIsVisible] = useState(false);
  const { classes, cx } = useStyles();
  useEffect(() => {
    isOpen && setIsVisible(isOpen);
  }, []);

  const closeModal = () => {
    onClose && onClose();
    setIsVisible(true);
  };
  return isVisible ? (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      transitionProps={{ transition: 'fade', duration: 200 }}
      title={
        <Group className={cx(classes.modaltTitle)}>
          <AlertTriangle size={18} strokeWidth={2} color={'#FAF089'} />
          <div>{header}!</div>
        </Group>
      }
    >
      <div className={cx(classes.caption)}>{caption}</div>
      <Group position="right" spacing="16px">
        {listButton.map((btn) => {
          return btn.buttonType === 'upload' ? (
            <FileButton key={btn.title} onChange={btn.onPress} accept=".csv">
              {(props) => (
                <Button
                  leftIcon={<Upload size={14} strokeWidth={2} color={'white'} />}
                  className={cx(classes.greenButton)}
                  {...props}
                >
                  {btn.title}
                </Button>
              )}
            </FileButton>
          ) : btn.buttonType === 'cancel' ? (
            <Button key={btn.title} onClick={btn.onPress} className={cx(classes.redButton)}>
              {btn.title}
            </Button>
          ) : btn.buttonType === 'continue' ? (
            <Button key={btn.title} onClick={btn.onPress} className={cx(classes.greenButton)}>
              {btn.title}
            </Button>
          ) : null;
        })}
      </Group>
    </Modal>
  ) : null;
}
export default PModal;
