/*
*
* Review_Modal
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import { getTranslations } from '../../helpers/translations';

import Modal from '../Modal';
import LoadingOverlay from '../LoadingOverlay';


function ReviewModal({ show, title, body, onApprove, onModalClose, onReject, isLoading, maxWidth, fullWidth }) {
  return (
    <Modal
      show={show}
      title={title}
      onCloseModal={onModalClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      modal={false}
      isLoading={isLoading}
      includeLeftCancelBtn
      actionButtons={[
        {
          label: getTranslations('btn_reject'),
          action: onReject,
          loading: isLoading,
        },
        {
          label: getTranslations('btn_approve'),
          action: onApprove,
          loading: isLoading,
          buttonType: 'contained',
        },
      ]}
    >
      <LoadingOverlay
        show={isLoading || false}
        width='100%'  
      >
        {body}
      </LoadingOverlay>
    </Modal>
  );
}

ReviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  onApprove: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', false]),
  fullWidth: PropTypes.bool,
};

export default ReviewModal;