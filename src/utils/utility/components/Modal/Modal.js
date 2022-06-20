import React from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  Button,
  useMediaQuery,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import LoadingOverlay from '../LoadingOverlay';
import IconBtnTooltip from '../IconBtnTooltip';

import './Modal.styles.css';

export function Modal({
  DialogActionsProps,
  DialogContentProps,
  DialogProps,
  DialogTitleProps,
  actionButtons,
  children,
  fullWidth,
  includeLeftCancelBtn,
  isLoading,
  maxWidth,
  modal,
  onCloseModal,
  show,
  title,
}) {

  let disableModalClose = isLoading;
  const actionButtonsCompile = () => {
    if (actionButtons.length > 0) {

      return (
        <DialogActions className='Modal_buttonsContainer' {...DialogActionsProps}>
          <div className='Modal_cancelButton'>
            {includeLeftCancelBtn &&
            <Button
              color='primary'
              disabled={disableModalClose}
              onClick={onCloseModal}
              variant='text'
            >
              Cancel
            </Button>}
          </div>

          <div className='Modal_actionsButtons'>
            {actionButtons.map((button, index) => {
              const variant = index === actionButtons.length - 1 ? (button.buttonType || 'contained') : (button.buttonType || 'text'); // default first button to 'contained' variant
              const color = variant === 'contained' ? (button.color || 'default') : (button.color || 'primary'); // when variant is 'contained', color default is 'default'
              disableModalClose = button.loading || disableModalClose; // once set to true, should stay true

              return (
                <LoadingOverlay
                  show={button.loading || false}
                  key={button.label}
                >
                  <Button
                    color={color}
                    disabled={button.disabled || button.loading}
                    onClick={button.action}
                    variant={variant}
                    style={{ marginLeft: '10px' }}
                    type={button.type || 'button'}
                  >
                    {button.label}
                  </Button>
                </LoadingOverlay>
              );
            })}
          </div> 
        </DialogActions>
      );
    }

    return (
      <DialogActions {...DialogActionsProps}>
        <Button onClick={onCloseModal} variant='contained'>Close</Button>
      </DialogActions>
    );
  };

  const theme = useTheme();

  return (
    <Dialog
      open={show}
      maxWidth={maxWidth || 'sm'}
      onClose={modal || disableModalClose ? () => null : onCloseModal}
      fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
      fullWidth={fullWidth}
      {...DialogProps}
    >
      <div className='Modal_titleContainer'>
        <DialogTitle 
          disableTypography 
          style={{ margin: 0, padding: '10px 0', fontWeight: 'bold', fontSize: 'x-large' }}
          {...DialogTitleProps}
        >
          {title.toUpperCase()}
        </DialogTitle>
        <IconBtnTooltip
          buttonProps={{ disabled: disableModalClose }}
          icon='close'
          onClick={onCloseModal}
        />
      </div>

      <Divider style={{ margin: '0 20px' }} />
      
      <DialogContent {...DialogContentProps}>{children}</DialogContent>
      {actionButtonsCompile(DialogActionsProps)}
    </Dialog>
  );
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', false]),
  fullWidth: PropTypes.bool,
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.func.isRequired,
      buttonType: PropTypes.string,
      color: PropTypes.string,
      disabled: PropTypes.bool,
      label: PropTypes.string.isRequired,
      loading: PropTypes.bool,
      type: PropTypes.string,
    })
  ),
  modal: PropTypes.bool,
  includeLeftCancelBtn: PropTypes.bool,
  isLoading: PropTypes.bool,
  DialogProps: PropTypes.object,
  DialogTitleProps: PropTypes.object,
  DialogContentProps: PropTypes.object,
  DialogActionsProps: PropTypes.object,
};

Modal.defaultProps = {
  modal: true,
  actionButtons: [],
  includeLeftCancelBtn: false,
  isLoading: false,
  fullWidth: false,
};

export default Modal;