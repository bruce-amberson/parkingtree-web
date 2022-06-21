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
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';

const commonIcons = {
  CLOSE: {
    icon: <CloseIcon />,
    title: 'close',
  },
  CREATE: {
    icon: <CreateIcon />,
    title: 'edit',
  },
  EXPAND_LESS: {
    icon: <ExpandLessIcon />,
    title: 'collapse',
  },
  EXPAND_MORE: {
    icon: <ExpandMoreIcon />,
    title: 'expand',
  },
  MORE_VERT: {
    icon: <MoreVertIcon />,
    title: 'more_vert',
  },
  PRINT: {
    icon: <PrintIcon />,
    title: 'print',
  },
  SEARCH: {
    icon: <SearchIcon />,
    title: 'search',
  },
};


function getTitle(icon) {
  switch (icon) {
    case commonIcons.CLOSE.icon: return commonIcons.CLOSE.title;
    case commonIcons.CREATE.icon: return commonIcons.CREATE.title;
    case commonIcons.EXPAND_LESS.icon: return commonIcons.EXPAND_LESS.title;
    case commonIcons.EXPAND_MORE.icon: return commonIcons.EXPAND_MORE.title;
    case commonIcons.MORE_VERT.icon: return commonIcons.MORE_VERT.title;
    case commonIcons.SEARCH.icon: return commonIcons.SEARCH.title;
    case commonIcons.PRINT.icon: return commonIcons.PRINT.title;
    default: return '';
  }
}

function getImage(icon) {
  switch (icon) {
    case commonIcons.CLOSE.title: return commonIcons.CLOSE.icon;
    case commonIcons.CREATE.title: return commonIcons.CREATE.icon;
    case commonIcons.EXPAND_LESS.title: return commonIcons.EXPAND_LESS.icon;
    case commonIcons.EXPAND_MORE.title: return commonIcons.EXPAND_MORE.icon;
    case commonIcons.MORE_VERT.title: return commonIcons.MORE_VERT.icon;
    case commonIcons.SEARCH.title: return commonIcons.SEARCH.icon;
    case commonIcons.PRINT.title: return commonIcons.PRINT.icon;
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
        {getImage(icon)}
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
