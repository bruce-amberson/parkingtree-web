/*
*
* Confirm_Modal
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import { getTranslations } from '../../helpers/translations';

import Modal from '../Modal';


function ConfirmModal({ show, title, body, onModalClose, onConfirm, isLoading, actionBtnLabel, maxWidth, fullWidth }) {
  return (
    <Modal
      show={show}
      title={title}
      isLoading={isLoading}
      onCloseModal={onModalClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      actionButtons={[
        {
          label: getTranslations('btn_cancel'),
          action: onModalClose,
          disabled: isLoading,
        },
        {
          label: actionBtnLabel || getTranslations('btn_confirm'), // defaults to Confirm
          action: onConfirm,
          loading: isLoading,
          buttonType: 'contained',
        },
      ]}
    >
      {body}
    </Modal>
  );
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  onModalClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  actionBtnLabel: PropTypes.string, // can provide custom button label
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', false]),
  fullWidth: PropTypes.bool,
};

export default ConfirmModal;