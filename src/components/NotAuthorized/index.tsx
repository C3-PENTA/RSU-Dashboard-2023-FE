import { AUTHEN_QUOTE } from '@/constants';
import { Alert, Box } from '@mantine/core';
import { AlertCircle } from 'tabler-icons-react';

const NotAuthorized = () => {
  return (
    <Box m={'lg'}>
      <Alert
        icon={<AlertCircle size="1rem" />}
        title={AUTHEN_QUOTE.NOT_AUTHORIZED_KOR}
        color="red"
        variant="filled"
      >
        {AUTHEN_QUOTE.NOT_AUTHORIZED_KOR}
      </Alert>
    </Box>
  );
};

export default NotAuthorized;
