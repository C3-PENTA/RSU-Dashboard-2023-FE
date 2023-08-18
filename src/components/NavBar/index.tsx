import React, { useEffect, useState } from 'react';
// Components
import { Navbar, NavLink, createStyles, Group, Box } from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Constants
import { MAIN_LINK } from '@/constants';
// Utils
import { useTranslation } from 'react-i18next';

const useStyles = createStyles((theme) => ({
  navbarWrapper: {
    height: 'auto',
  },

  navbar: {
    backgroundColor: theme.colors.gray[7],
    border: '0px none',
    height: '100%',
    width: '217px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px',
  },

  menu: {
    backgroundColor: theme.colors.gray[7],
  },

  version: {
    color: theme.colors['white-alpha'][6],
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontWeight: 400,
    lineHeight: '20px',
    left: 0,
    letterSpacing: '0px',
  },

  item: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    gap: '8px',
    alignSelf: 'stretch',
    fontSize: theme.fontSizes.lg,
    color: theme.colors['white-alpha'][8],
    fontFamily: theme.fontFamily,
    fontWeight: 500,
    fontStyel: 'normal',
    lineHeight: '28px',
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: theme.colors.gray[5],
      fontSize: theme.fontSizes['2xl'],
      borderRadius: theme.radius.base,
    },
    '&:hover&[data-active]': {
      backgroundColor: theme.colors.gray[5],
      fontSize: theme.fontSizes['2xl'],
      borderRadius: theme.radius.base,
    },
    '&[data-active]': {
      color: theme.colors.blue[4],
    },
  },
}));

const SideNavbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { classes, cx } = useStyles();
  const [parentOpen, setParentOpen] = useState(false);
  const [mainLinkWithStatus, setMainLink] = useState(() =>
    MAIN_LINK.map((item) => ({
      ...item,
      status: location.pathname === item.path ? true : false,
      items: item.items
        ? item.items.map((childItem) => ({
            ...childItem,
            status: location.pathname === childItem.path ? true : false,
          }))
        : null,
    })),
  );
  useEffect(() => {
    setMainLink((prevMainLink) =>
      prevMainLink.map((item) => ({
        ...item,
        status: location.pathname === item.path ? true : false,
        items: item.items
          ? item.items.map((childItem) => ({
              ...childItem,
              status: location.pathname === childItem.path ? true : false,
            }))
          : null,
      })),
    );
  }, [location.pathname]);
  const items = mainLinkWithStatus.map((item) => {
    const { id, icon, path, label, status } = item;
    return (
      <NavLink
        className={cx(classes.item)}
        key={id}
        label={t(label)}
        icon={icon(status)}
        variant="subtle"
        active={location.pathname === path}
        onClick={(e) => {
          e.preventDefault();
          navigate(path);
          setParentOpen(!parentOpen);
          setMainLink((mainLinkWithStatus) =>
            mainLinkWithStatus.map((item) => ({
              ...item,
              status: path === item.path ? true : false,
              items: item.items
                ? item.items.map((childItem) => ({
                    ...childItem,
                    status: location.pathname === childItem.path ? true : false,
                  }))
                : null,
            })),
          );
        }}
      >
        {item.items &&
          item.items.map((child) => {
            const { id, icon, path, label, status } = child;
            return (
              <NavLink
                className={cx(classes.item)}
                key={id}
                component={Link}
                label={t(label)}
                to={path}
                icon={icon(status)}
                variant="subtle"
                active={location.pathname === path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(path);
                  setMainLink((mainLinkWithStatus) =>
                    mainLinkWithStatus.map((item) => ({
                      ...item,
                      status: path === item.path ? true : false,
                      items: item.items
                        ? item.items.map((childItem) => ({
                            ...childItem,
                            status: location.pathname === childItem.path ? true : false,
                          }))
                        : null,
                    })),
                  );
                }}
              ></NavLink>
            );
          })}
      </NavLink>
    );
  });
  return (
    <Navbar className={cx(classes.navbarWrapper)} height={'100%'} width={{ base: 217 }}>
      <Navbar.Section grow className={cx(classes.navbar)}>
        <Box className={cx(classes.menu)}>{items}</Box>
        <Box className={cx(classes.version)}>v0.0.5</Box>
      </Navbar.Section>
    </Navbar>
  );
};

export default SideNavbar;
