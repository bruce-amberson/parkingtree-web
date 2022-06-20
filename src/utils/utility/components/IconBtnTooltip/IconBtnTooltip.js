import React from 'react';
import PropTypes from 'prop-types';
import requiredIf from 'react-required-if';
import {
  IconButton,
  Tooltip
} from '@material-ui/core';

import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrintIcon from '@mui/icons-material/Print';

const commonIcons = {
  CLOSE: {
    icon: <CloseIcon />,
    title: 'Close',
  },
  CREATE: {
    icon: <CreateIcon />,
    title: 'Edit',
  },
  EXPAND_LESS: {
    icon: <ExpandLessIcon />,
    title: 'Collapse',
  },
  EXPAND_MORE: {
    icon: <ExpandMoreIcon />,
    title: 'Expand',
  },
  MORE_VERT: {
    icon: <MoreVertIcon />,
    title: 'Menu',
  },
  PRINT: {
    icon: <PrintIcon />,
    title: 'Print',
  },
};


function getTitle(icon) {
  switch (icon) {
    case commonIcons.CLOSE.icon: return commonIcons.CLOSE.title;
    case commonIcons.CREATE.icon: return commonIcons.CREATE.title;
    case commonIcons.EXPAND_LESS.icon: return commonIcons.EXPAND_LESS.title;
    case commonIcons.EXPAND_MORE.icon: return commonIcons.EXPAND_MORE.title;
    case commonIcons.MORE_VERT.icon: return commonIcons.MORE_VERT.title;
    case commonIcons.PRINT.icon: return commonIcons.PRINT.title;
    default: return '';
  }
}

export function IconBtnTooltip({ buttonProps, icon, iconProps, onClick, title, tooltipProps }) {
  return (
    <Tooltip
      title={title ? title : getTitle(icon)}
      {...tooltipProps}
    >
      <IconButton
        aria-label={title ? title : getTitle(icon)}
        component={!buttonProps.disabled ? 'button' : 'div'} // fixes console warning when wrapping IconButton with Tooltip
        onClick={onClick}
        {...buttonProps}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}

const icons = Object.values(commonIcons).map(icon => icon.icon);

IconBtnTooltip.defaultProps = {
  buttonProps: {
    disabled: false,
  },
};

IconBtnTooltip.propTypes = {
  buttonProps: PropTypes.object,
  icon: PropTypes.oneOfType([
    PropTypes.object, // MUI icons
    PropTypes.string, // Google Material icons
  ]).isRequired,
  iconProps: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  title: requiredIf(PropTypes.string, props => !icons.includes(props.icon)), // no title required for most common icons
  tooltipProps: PropTypes.object,
};

export default IconBtnTooltip;
