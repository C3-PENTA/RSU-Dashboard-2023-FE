import { createStyles } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  refreshButton: {
    cursor: 'pointer',
  },
}));

const Notification = () => {
  const { classes, cx } = useStyles();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={cx(classes.refreshButton)}
    >
      <path
        d="M12 22C13.1 22 14 21.1 14 20H10C10 20.5304 10.2107 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
        fill="white"
      />
    </svg>
  );
};

export default Notification;
