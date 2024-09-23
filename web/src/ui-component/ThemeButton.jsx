import { useDispatch, useSelector } from 'react-redux';
import { SET_THEME } from '@/store/actions';
import { useTheme } from '@mui/material/styles';
import { Button } from '@arco-design/web-react';
import { IconSunFill, IconMoonFill } from '@arco-design/web-react/icon';

export default function ThemeButton() {
  const dispatch = useDispatch();

  const defaultTheme = useSelector((state) => state.customization.theme);

  const theme = useTheme();

  function handleThemeChange() {
    let theme = defaultTheme === 'light' ? 'dark' : 'light';
    dispatch({ type: SET_THEME, theme: theme });
    localStorage.setItem('theme', theme);
  }

  return (
    <>
      <Button shape={'circle'} onClick={handleThemeChange} icon={defaultTheme === 'dark' ? <IconMoonFill /> : <IconSunFill />}></Button>
    </>
  );
}
