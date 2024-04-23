import { createTheme } from '@mui/material/styles';

// assets
import colors from '@/assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
  const color = colors;
  const options = customization.theme === 'light' ? GetLightOption() : GetDarkOption();
  const themeOption = {
    colors: color,
    ...options,
    customization
  };

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;

function GetDarkOption() {
  const color = colors;
  return {
    mode: 'dark',
    heading: color.darkTextTitle,
    paper: color.darkLevel2,
    backgroundDefault: color.darkPaper,
    background: color.darkBackground,
    darkTextPrimary: color.darkTextPrimary,
    darkTextSecondary: color.darkTextSecondary,
    textDark: color.darkTextTitle,
    menuSelected: color.darkPrimaryLight,
    menuSelectedBack: color.darkPrimaryDark,
    divider: color.darkDivider,
    borderColor: color.darkBorderColor,
    menuButton: color.darkPrimaryLight,
    menuButtonColor: color.darkPrimaryDark,
    menuChip: color.darkLevel1,
    headBackgroundColor: color.darkBackground,
    tableBorderBottom: color.darkDivider
  };
}

function GetLightOption() {
  const color = colors;
  return {
    mode: 'light',
    heading: color.grey900,
    paper: color.paper,
    backgroundDefault: color.paper,
    background: color.primaryLight,
    darkTextPrimary: color.grey700,
    darkTextSecondary: color.grey500,
    textDark: color.grey900,
    menuSelected: color.primaryDark,
    menuSelectedBack: color.primaryLight,
    divider: color.grey200,
    borderColor: color.grey300,
    menuButton: color.primaryLight,
    menuButtonColor: color.primaryDark,
    menuChip: color.primaryLight,
    headBackgroundColor: color.tableBackground,
    tableBorderBottom: color.tableBorderBottom
  };
}
