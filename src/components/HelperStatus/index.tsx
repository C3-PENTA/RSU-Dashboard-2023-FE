import { Box, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IHelperStatus } from '@/interfaces/interfaceCommon';
import { HeaderTitle } from '@/components';

type Props = {
  status: IHelperStatus[];
};
const HelperStatus = (props: Props) => {
  const { status } = props;
  const { t } = useTranslation();
  return (
    <Group position="apart" sx={{ width: '100%' }}>
      <HeaderTitle label={t('계기반')} />
      <Group>
        {status.length > 0 &&
          status.map((status) => {
            return (
              <Group key={status.key}>
                <Box sx={{ background: status.color, width: 24, height: 16, borderRadius: 2 }} />
                <Text color={'white'} weight="normal">
                  {t(status.label)}
                </Text>
              </Group>
            );
          })}
      </Group>
    </Group>
  );
};
export default HelperStatus;
