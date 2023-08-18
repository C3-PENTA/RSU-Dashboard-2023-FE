import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import HeaderNavBar from '../HeaderNavBar';
import SideNavBar from '../NavBar';
import MainTitle from '../MainTitle';
const PageLayout = () => {
  return (
    <>
      <AppShell
        navbar={<SideNavBar />}
        header={<HeaderNavBar />}
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colors.gray[8],
            padding: '64px 0px 0px 217px',
          },
        })}
      >
        <MainTitle />
        <Outlet />
      </AppShell>
    </>
  );
};

export default PageLayout;
