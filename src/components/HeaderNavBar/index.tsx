import { useContext } from 'react';
import { createStyles, Header, Group, rem, Box, HoverCard, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FaUserCog, FaUser, FaUserTie } from 'react-icons/fa';

// Asset
import Logo from '@/assets/icons/Logo';
import { Path } from '@/config/path';
import { LoginContext } from '@/App';
import { logout } from '@/services/AuthenticationAPI';
import { Role } from '@/constants';
const useStyles = createStyles((theme) => ({
  header: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray[8],
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '64px',
    padding: '0px 16px',
    borderBottom: '0px',
  },

  headerSidebar: {
    alignItems: 'center',
    display: 'inline-flex',
    flex: '0 0 auto',
    gap: '24px',
  },

  logo: {
    left: 'unset',
    position: 'relative',
    top: 'unset',
    width: '185px',
  },

  account: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.md,
    fontStyle: 'normal',
    fontWeight: 600,
    letterSpacing: '0px',
    lineHeight: '24px',
    display: 'block',
    padding: `${rem(8)} ${rem(12)}`,
    color: theme.white,
    textDecoration: 'none',
    width: 'fit-content',
    position: 'relative',
    textAlign: 'center',
    justifyItems: 'center',

    '&:hover': {
      backgroundColor: theme.colors.gray[5],
      borderRadius: theme.radius.base,
    },
  },

  element: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.md,
    fontStyle: 'normal',
    fontWeight: 600,
    letterSpacing: '0px',
    lineHeight: '24px',
    display: 'block',
    padding: `${rem(8)} ${rem(12)}`,
    color: theme.colors.gray[4],
    textDecoration: 'none',
    width: 'fit-content',
    position: 'relative',
    textAlign: 'center',
    justifyItems: 'center',

    '&:hover': {
      backgroundColor: theme.colors.gray[5],
      borderRadius: theme.radius.base,
    },
  },
}));

const HeaderNavBar = () => {
  const { setLoginState, currentUser } = useContext(LoginContext);
  let currentRole = '';
  let currentEmail = '';
  let userIcon = <FaUser size={20} />;
  if (currentUser !== undefined) {
    currentRole = currentUser.role.name;
    currentEmail = currentUser.email;
    if (currentRole === Role.MANAGER) {
      userIcon = <FaUserTie size={20} />;
    }
    if (currentRole === Role.OPERATOR) {
      userIcon = <FaUserCog size={20} />;
    }
  }
  const itemsHeader = [
    {
      link: '',
      label: currentUser.username === '' ? 'User ID' : currentUser.username,
    },
    {
      link: Path.ENV,
      label: '설정',
    },
    {
      link: Path.LOGIN,
      label: '로그아웃​',
    },
  ];
  const { classes, cx } = useStyles();

  const items = itemsHeader.map((item) => {
    if (item.label === '설정' || item.label === '로그아웃​') {
      return (
        <Link
          key={item.label}
          to={item.link}
          className={cx(classes.element)}
          onClick={() => {
            if (item.label === '로그아웃​') {
              setLoginState(false);
              logout().subscribe({
                error(err) {
                  console.log(err);
                },
              });
            }
          }}
        >
          {item.label}
        </Link>
      );
    } else {
      return (
        <Group key={item.label}>
          <HoverCard shadow="md">
            <HoverCard.Target>
              <Link
                key={item.label}
                to={item.link}
                className={cx(classes.account)}
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                <Group position="center" spacing="xs">
                  {userIcon}
                  {item.label}
                </Group>
              </Link>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text color="black" size="sm">
                {currentEmail}
              </Text>
              <Text color="black" size="sm">
                {currentRole}
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </Group>
      );
    }
  });
  return (
    <Header height={64} className={classes.header}>
      <Box className={classes.logo}>
        <Link to={Path.DASHBOARD}>
          <Logo />
        </Link>
      </Box>
      <Box className={classes.headerSidebar}>{items}</Box>
    </Header>
  );
};
export default HeaderNavBar;
