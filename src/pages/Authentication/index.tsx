import AuthenticationForm, { AuthenProps } from '@/components/Authentication';
// import { Col, Grid } from '@mantine/core';
import imagebg from '@/assets/images/background-image.png';
import { createStyles, rem, Box, BackgroundImage } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '20%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundImage: `url(${imagebg})`,
    float: 'left',
    position: 'absolute',
  },
  form: {
    // minHeight: rem(900),
    // maxWidth: rem(900),
    float: 'right',
    width: '80%',
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
}));
const Authentication = (props: AuthenProps) => {
  const { setLoginState, setUserId, setIsFirstAccess } = props;
  const { classes } = useStyles();
  return (
    <>
      <div className={classes.wrapper}></div>
      <div className={classes.form}>
        <div>
          <AuthenticationForm
            setLoginState={setLoginState}
            setUserId={setUserId}
            setIsFirstAccess={setIsFirstAccess}
          />
        </div>
      </div>
    </>
  );
};

export default Authentication;
