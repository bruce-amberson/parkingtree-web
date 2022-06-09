import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import moment from 'moment';

import {
  TextField,
  // InputAdornment,
} from '@material-ui/core';

// import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import {
  LoadingOverlay,
  Modal,
} from '@frontend/common';

import {
  addInput,
  updateInput,
  helperTextManage,
  helperErrorManage,
} from 'utils/singleForm/helper';

import { ACCOUNT_TYPE } from 'utils/singleForm/constants';

export class SourceAccountNumberInput extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    inputFocus: PropTypes.bool,
    labelText: PropTypes.string,
    inputFullWidth: PropTypes.bool,
    autoComplete: PropTypes.string, // expected val is 'on' or 'off'
    className: PropTypes.string,
    style: PropTypes.object,

    updateGroup: PropTypes.func,
    getAccountDetails: PropTypes.func.isRequired,
    clearSourceData: PropTypes.func.isRequired,
    updateSourceData: PropTypes.func.isRequired,
    isAccountPromptsDisabled: PropTypes.bool, // disables account prompts, when they are not required

    onError: PropTypes.func, // if parent component wants to track if any error
    onChange: PropTypes.func, // if parent component wants to track value changes
  };

  state = {
    val: '',
    inputIndex: undefined,
    isError: false,
    helperMsg: '',
    loading: false,

    isTypeScholarship: false,
    scholarshipNotified: false,
    isUGMAUTMA: false,
    isFullBalance: false,
    isAccountFlagged: false,
    hasDuplicateAccounts: false,
    isOptionLimit: false,

    showScheduledWithdrawalsPositiveModule: false,
    showExisitngScheduledFullMarketWithdrawalDateModule: false,
    ExisitngScheduledFullMarketWithdrawalDate: ''
  };

  componentDidMount() {
    const { inputName, isRequired } = this.props;
    const inputIndex = addInput({ inputName, isRequired });
    this.setState({ inputIndex });
  }

  componentDidUpdate(prevProps, prevState) {
    const { inputName } = this.props;
    const list = window.singleForm.inputList;
    if (list.length > 0) {
      const curInput = list[this.state.inputIndex];
      if (curInput && curInput.update && curInput.inputName === inputName && curInput.val !== undefined) {
        const e = { target: { value: curInput.val }, type: 'update' };
        this.inputChange(e);
      }
      if (curInput && curInput.delete && curInput.inputName === inputName) {
        delete curInput.delete;
        const e = { target: { value: '' }, type: 'update' };
        this.inputChange(e);
      }
      if (this.props.onError && prevState.isError !== this.state.isError) {
        this.props.onError(this.state.isError); // callback if parents wants to know about new error
      }
    }
  }

  render() {
    const {
      inputName, labelText, isDisabled, isReadOnly, inputFocus,
      inputFullWidth, autoComplete, className, style, isAccountPromptsDisabled,
    } = this.props;

    const { val, inputIndex, isError, helperMsg, loading } = this.state;

    return (
      <LoadingOverlay show={loading} width='100%'>
        <TextField
          name={inputName}
          value={val}
          label={labelText}
          disabled={isDisabled}
          helperText={helperMsg || helperTextManage(inputName, inputIndex)}
          error={isError || helperErrorManage(inputName, inputIndex)}
          autoFocus={inputFocus || false}
          fullWidth={inputFullWidth || false}
          autoComplete={autoComplete || 'on'}
          style={style}
          color='primary'
          variant='outlined'
          className={className}
          onChange={e => this.inputChange(e)}
          inputProps={{
            maxLength: 9
          }}
          InputProps={{
            readOnly: isReadOnly,
            // endAdornment: <InputAdornment position='end'>
            //   <OpenInNewIcon 
            //     onClick={() => null}
            //     id='open-new'
            //   />
            // </InputAdornment>
          }}
          key={inputName}
        />
        {!isAccountPromptsDisabled && this.duplicateAcctsModal()}
        {!isAccountPromptsDisabled && this.scholarshipModal()}
        {!isAccountPromptsDisabled && this.fullBalanceModal()}
        {!isAccountPromptsDisabled && this.accountFlaggedModal()}
        {!isAccountPromptsDisabled && this.scheduledWithdrawalPositiveModule()}
        {!isAccountPromptsDisabled && this.exisitngScheduledFullMarketWithdrawalDateModule()}
        {!isAccountPromptsDisabled && this.optionChangeLimit()}
      </LoadingOverlay>
    );
  }

  inputChange = e => {
    const val = e.target.value.trimStart() || '';

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven

    const { inputName } = this.props;
    let helperMsg = '';
    let isError = undefined;
    let isValid = undefined;

    let isTypeScholarship = false;
    let scholarshipNotified = false;
    let isFullBalance = false;
    let isAccountFlagged = false;
    let isUGMAUTMA = false;
    let isOptionLimit = false;

    let showScheduledWithdrawalsPositiveModule = false;
    let showExisitngScheduledFullMarketWithdrawalDateModule = false;
    let ExisitngScheduledFullMarketWithdrawalDate = '';

    const inputList = cloneDeep(window.singleForm.inputList);

    let hasDuplicateAccounts = false;
    const destinations = inputList.filter(input => input.inputName.includes('|AccountNumber'));
    if (destinations.length > 0) {
      destinations.forEach(destination => {
        hasDuplicateAccounts = destination.val === val;
      });
    }

    if (val.length === 0) {
      this.setState(
        { val, helperMsg, isError, isTypeScholarship, scholarshipNotified, isFullBalance, isAccountFlagged },
        () => {
          this.props.clearSourceData();
          updateInput(this.state.inputIndex, { inputName, val: '', isValid, eventType });
          this.props.updateGroup();
        }
      );
    }
    else if (hasDuplicateAccounts) {
      this.setState({ val, helperMsg, isError, isTypeScholarship, scholarshipNotified, isFullBalance, isAccountFlagged, hasDuplicateAccounts });
    }
    else if (val.match('^\\d+$', '')) { // allow only numbers
      if (val.length > 0 && val.length !== 7 && val.length !== 9) {
        helperMsg = 'Please enter a valid Account Number';
        isError = true;
        isValid = false;
        this.setState(
          { val, helperMsg, isError, isTypeScholarship, scholarshipNotified, isFullBalance, isAccountFlagged },
          () => {
            this.props.clearSourceData();
            updateInput(this.state.inputIndex, { inputName, val, isValid, eventType });
            this.props.updateGroup();
          }
        );
      }
      else {
        isValid = true;

        if (!eventType) { // just simply reset the account number without doing any account search, when programmatic update
          this.setState({ val, helperMsg, isError, }, () => {
            updateInput(this.state.inputIndex, { inputName, val, isValid, eventType });
            this.props.updateGroup();
          });
        }
        else {
          this.setState(
            { loading: true, },
            () => {
              this.props.clearSourceData();
              this.props.updateGroup();
            }
          );
          this.props.getAccountDetails(val)
            .then(({ payload }) => {
              if (payload.data.AccountType === ACCOUNT_TYPE.Scholarship && !this.state.scholarshipNotified) {
                isTypeScholarship = true;
                scholarshipNotified = true;
              }

              if (payload.data.IsFullWithdrawalPending) {
                isFullBalance = true;
              }

              if (payload.data.IsAccountFlagged) {
                isAccountFlagged = true;
              }

              if (payload.data.ScheduledWithdrawals > 0) {
                showScheduledWithdrawalsPositiveModule = true;
              }

              if (payload.data.ExisitngScheduledFullMarketWithdrawalDate !== undefined && payload.data.ExisitngScheduledFullMarketWithdrawalDate !== null) {
                showExisitngScheduledFullMarketWithdrawalDateModule = true;
                ExisitngScheduledFullMarketWithdrawalDate = payload.data.ExisitngScheduledFullMarketWithdrawalDate;
              }

              const formData = cloneDeep(window.singleForm.formData);
              if (formData && formData.destinations) {
                const hasOneUGMADestination = inputList.some(input => input.inputName.includes('|AccountType') && input.val === 'UGMA/UTMA');
                const hasAllUGMADestinations = inputList.every(input => input.inputName.includes('|AccountType') && input.val === 'UGMA/UTMA');
                const hasAllMatchingBenes = formData.destinations.every(destination => destination.BeneficiaryId === payload.data.BeneficiaryId);
                if ((hasOneUGMADestination && payload.data.AccountType !== ACCOUNT_TYPE.UGMAUTMA)
                  || (!hasAllUGMADestinations && payload.data.AccountType === ACCOUNT_TYPE.UGMAUTMA)
                  || (!hasAllMatchingBenes && payload.data.AccountType === ACCOUNT_TYPE.UGMAUTMA)) {
                  isUGMAUTMA = true;
                }
              }

              if (!payload.data.HasPendingOptionChange) {
                const destinationTypes = inputList.filter(input => input.inputName.includes('|AccountType'));
                if (destinationTypes.length > 0) {
                  if (formData && formData.destinations) {
                    const hasMatchingDestinationType = destinationTypes.some(input => input.val === payload.data.AccountType);
                    const hasMatchingGroupIds = formData.destinations.some(destination => destination.AccountGroupId === payload.data.AccountGroupId);
                    if (hasMatchingDestinationType && hasMatchingGroupIds) {
                      isOptionLimit = true;
                    }
                  }
                }
              }

              this.setState(
                {
                  loading: false, val, helperMsg, isError, isTypeScholarship, scholarshipNotified, isFullBalance, isAccountFlagged,
                  showScheduledWithdrawalsPositiveModule, showExisitngScheduledFullMarketWithdrawalDateModule,
                  ExisitngScheduledFullMarketWithdrawalDate, isUGMAUTMA, isOptionLimit
                },
                () => {
                  isFullBalance || isUGMAUTMA || isOptionLimit
                    ? this.props.clearSourceData()
                    : this.props.updateSourceData(payload.data, val);
                  updateInput(this.state.inputIndex, { inputName, val, isValid, eventType });
                  this.props.updateGroup();
                }
              );

              // if external callback is passed also update the value there
              this.props.onChange && this.props.onChange(val);
            })
            .catch(({ payload }) => {
              if (payload.status !== 500) {
                payload.data.forEach(error => {
                  const inlineErrorInput = inputList.find(input => input.inputName === error.Field);
                  if (inlineErrorInput) {
                    helperMsg = error.Message;
                    this.setState(
                      { loading: false, val, helperMsg, isError: true },
                      () => {
                        updateInput(this.state.inputIndex, { inputName, val, isValid, eventType });
                        this.props.updateGroup();
                      }
                    );
                  }
                });
              }
              this.setState({ loading: false });
            });
        }
      }
    }
  }

  duplicateAcctsModal() {
    const actionButtons = [
      {
        label: 'OK',
        action: () => this.setState({ hasDuplicateAccounts: false }),
        buttonType: 'text',
      },
    ];

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ hasDuplicateAccounts: false })}
        show={this.state.hasDuplicateAccounts}
        title='Unique destination account required'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          The source and destination accounts cannot be the same
        </div>
      </Modal>
    );
  }

  scholarshipModal() {
    const actionButtons = [
      {
        label: 'OK',
        action: () => this.setState({ isTypeScholarship: false }),
        buttonType: 'text',
      },
    ];

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ isTypeScholarship: false })}
        show={this.state.isTypeScholarship}
        title='Designated Account'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          One of the accounts is a scholarship account.
        </div>
      </Modal>
    );
  }

  fullBalanceModal() {
    const actionButtons = [
      {
        label: 'OK',
        action: () => this.setState({ isFullBalance: false }),
        buttonType: 'text',
      },
    ];

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ isFullBalance: false })}
        show={this.state.isFullBalance}
        title='Pending Transaction Found'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          Unable to perform transfer due to pending transaction
        </div>
      </Modal>
    );
  }

  accountFlaggedModal() {
    const actionButtons = [
      {
        label: 'OK',
        action: () => this.setState({ isAccountFlagged: false }),
        buttonType: 'text',
      },
    ];

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ isAccountFlagged: false })}
        show={this.state.isAccountFlagged}
        title='Account Flagged'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          This account has a comment. Please review.
        </div>
      </Modal>
    );
  }

  scheduledWithdrawalPositiveModule() {
    const actionButtons = [
      {
        label: 'OK',
        action: () => this.setState({ showScheduledWithdrawalsPositiveModule: false }),
        buttonType: 'text',
      },
    ];

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ showScheduledWithdrawalsPositiveModule: false })}
        show={this.state.showScheduledWithdrawalsPositiveModule}
        title='Scheduled Withdrawals'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          Scheduled withdrawals already exist for this account group. Please review.
        </div>
      </Modal>
    );
  }

  exisitngScheduledFullMarketWithdrawalDateModule() {
    const actionButtons = [
      {
        label: 'NO',
        action: () => {
          this.setState({ showExisitngScheduledFullMarketWithdrawalDateModule: false });
          // clear all data
          this.props.clearSourceData();
          this.props.updateGroup();
        },
        buttonType: 'text',
      },
      {
        label: 'YES',
        action: () => this.setState({ showExisitngScheduledFullMarketWithdrawalDateModule: false }),
        buttonType: 'contained',
      },
    ];

    const ScheduleDate = moment(this.state.ExisitngScheduledFullMarketWithdrawalDate).format('MM/DD/YYYY');

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ showExisitngScheduledFullMarketWithdrawalDateModule: false })}
        show={this.state.showExisitngScheduledFullMarketWithdrawalDateModule}
        title='my529'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          There is a full market withdrawal scheduled on this account group for {ScheduleDate}. Would you like to continue?
        </div>
      </Modal>
    );
  }

  ugmaModal() {
    const actionButtons = [
      {
        label: 'OK',
        action: () => this.setState({ isUGMAUTMA: false }),
        buttonType: 'text',
      },
    ];

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ isUGMAUTMA: false })}
        show={this.state.isUGMAUTMA}
        title='UGMA/UTMA Account'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          The source account is a UGMA/UTMA account but the destination account is either not a UGMA/UTMA account or a UGMA/UTMA account for a different beneficiary.
        </div>
      </Modal>
    );
  }

  optionChangeLimit() {
    const actionButtons = [
      {
        label: 'OK',
        action: () => this.setState({ isOptionLimit: false }),
        buttonType: 'text',
      },
    ];

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ isOptionLimit: false })}
        show={this.state.isOptionLimit}
        title='Investment Option Change'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          Maximum number of option changes has been reached.
        </div>
      </Modal>
    );
  }

}

export default SourceAccountNumberInput;