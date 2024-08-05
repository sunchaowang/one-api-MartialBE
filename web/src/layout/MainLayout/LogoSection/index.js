import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { Typography, Row, Col } from 'antd';

// project imports
import config from '@/config';
import Logo from '@/ui-component/Logo';
import { MENU_OPEN } from '@/store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  function toLink() {
    dispatch({ type: MENU_OPEN, id: defaultId });
    navigator(config.basename);
  }
  return (
    <Row justify={'center'} align={'middle'}>
      <Typography.Link disableRipple onClick={toLink}>
        <Logo />
      </Typography.Link>
    </Row>
  );
};

export default LogoSection;
