import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { CardContent, CardHeader, Divider, Typography } from '@mui/material';
import { Card } from 'antd';

// ==============================|| CUSTOM SUB CARD ||============================== //

const SubCard = forwardRef(
  ({ children, content, contentClass, darkTitle, secondary, sx = {}, contentSX = {}, title, subTitle, ...others }, ref) => {
    const theme = useTheme();

    return (
      <Card ref={ref} title={title} {...others}>
        {/* card header and action */}
        {/* {!darkTitle && title && (
          <CardHeader sx={{ p: 2.5 }} title={<Typography variant="h5">{title}</Typography>} action={secondary} subheader={subTitle} />
        )}
        {darkTitle && title && (
          <CardHeader sx={{ p: 2.5 }} title={<Typography variant="h4">{title}</Typography>} action={secondary} subheader={subTitle} />
        )} */}

        {/* content & header divider */}
        {/* {title && (
          <Divider
            sx={{
              opacity: 1
            }}
          />
        )} */}

        {/* card content */}
        {content && (
          <CardContent sx={{ p: 2.5, ...contentSX }} className={contentClass || ''}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

SubCard.propTypes = {
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  sx: PropTypes.object,
  contentSX: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  subTitle: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

SubCard.defaultProps = {
  content: true
};

export default SubCard;
