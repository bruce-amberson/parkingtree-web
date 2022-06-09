import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { withStyles } from '@material-ui/core/styles';
import { cloneDeep } from 'lodash';

import {
  TextField,
  InputAdornment,
} from '@material-ui/core';

import { Modal } from '@frontend/common';

import {
  addInput,
  updateInput,
  updateInputList,
  helperTextManage,
  helperErrorManage
} from 'utils/singleForm/helper';

import { TXN_VALUE_TYPE } from 'Features/Transactions/Transfers/constants';

const styles = () => ({
  input: {
    textAlign: 'right'
  }
});

const YES = 'yes';
const NO = 'no';

export class SourceTransferAmountInput extends Component {

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
    classes: PropTypes.object.isRequired,
    updateGroup: PropTypes.func,

    toggleTXNValueType: PropTypes.func.isRequired,
    txnValueType: PropTypes.string.isRequired,
  };

  state = {
    val: '',
    inputIndex: undefined,
    isError: false,
    helperMsg: '',

    net: 0,

    isPendingWithdrawalModal: false,
    hasPendingWithdrawal: false,
  };

  componentDidMount() {
    const { inputName, isRequired } = this.props;
    const inputIndex = addInput({ inputName, isRequired });
    this.setState({ inputIndex });
  }

  componentDidUpdate(prevProps) {
    const { inputName } = this.props;
    const list = cloneDeep(window.singleForm.inputList);
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
    }

    const hasAcountNumber = list.some(input => input.inputName === 'AccountNumber' && input.val);
    if (hasAcountNumber) {
      const formData = cloneDeep(window.singleForm.formData);
      if (formData && formData.Net !== 0 && this.state.net === 0) {
        this.setState({ net: formData.Net });
      }

      if (formData && formData.PendingWithdrawalValue > 0 && !this.state.hasPendingWithdrawal) {
        this.setState({ hasPendingWithdrawal: true });
      }
    }

    if (prevProps.txnValueType !== this.props.txnValueType) {
      this.setState({ val: '' });
    }
  }

  render() {
    const display = this.props.txnValueType === TXN_VALUE_TYPE.DOLLAR
      ? this.renderAmount()
      : this.renderPercentage();

    return (
      <React.Fragment>
        {display}
        {this.pendingWithdrawalModal()}
      </React.Fragment>
    );
  }

  textRef = React.createRef(); // create input ref for focus

  inputChange = e => {
    let val = e.target.value.trimStart() || '';

    if (val === this.state.val && e.type !== 'update') return;

    const eventType = !e.type || e.type === 'update' ? null : e.type; // detect if event is user or programmatic driven

    const { inputName } = this.props;
    let isValid = undefined;
    let isError = false;
    let helperMsg = '';

    if (val.length === 0) {
      this.setState(
        { val, helperMsg, isError, net: 0 },
        () => updateInput(this.state.inputIndex, { inputName, val: undefined, isValid, eventType })
      );
    }
    else if (Number(val) === 0) {
      isError = true;
      helperMsg = 'Invalid amount';
      isValid = false;
      this.setState(
        { val, helperMsg, isError },
        () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
      );
    }
    else {
      const isTypeDollar = this.props.txnValueType === TXN_VALUE_TYPE.DOLLAR;
      const FullMarketWithdrawal = window.singleForm.inputList.find(input => input.inputName === 'FullMkt');
      if (!isTypeDollar && FullMarketWithdrawal && FullMarketWithdrawal.val) {
        val = '100';
      }
      else {

        const tempVal = val.includes(',')
          ? Number(val.replace(/,/g, '')) // removes commas, keeps decimals
          : Number(val);

        if (!isTypeDollar && tempVal > 100) { // percentage
          val = '100';
        }

        const { net, hasPendingWithdrawal } = this.state;
        if (isTypeDollar && net !== 0 && net < tempVal) {
          isError = true;
          helperMsg = 'Total must be less than available balance';

          if (hasPendingWithdrawal) {
            this.setState({ isPendingWithdrawalModal: true });
          }
        }

      }

      isValid = true;
      this.setState(
        { val, helperMsg, isError },
        () => updateInput(this.state.inputIndex, { inputName, val, isValid, eventType })
      );
    }
  }

  renderAmount() {
    const {
      inputName, labelText, isDisabled, isReadOnly, inputFocus,
      inputFullWidth, autoComplete, className, style, classes,
    } = this.props;

    const { val, inputIndex, isError, helperMsg } = this.state;

    return (
      <TextField
        name={inputName}
        value={val}
        label={labelText}
        disabled={isDisabled}
        helperText={helperMsg || helperTextManage(inputName, inputIndex)}
        error={isError || helperErrorManage(inputName, inputIndex)}
        autoFocus={inputFocus}
        inputRef={this.textRef}
        fullWidth={inputFullWidth || false}
        autoComplete={autoComplete || 'off'}
        style={style}
        className={className}
        onChange={e => this.inputChange(e)}
        inputProps={{
          maxLength: 12,
          thousandSeparator: true,
          decimalScale: 2,
          allowNegative: false,
        }}
        InputProps={{
          inputComponent: NumberFormatWrapper,
          readOnly: isReadOnly,
          classes,
          endAdornment: <InputAdornment position='end'>
            <i
              className='material-icons'
              style={{ fontFamily: 'helvetica', fontSize: '20px', cursor: 'pointer' }}
              onClick={() => isReadOnly ? null : this.props.toggleTXNValueType()}
            >$</i>
          </InputAdornment>
        }}
        key={inputName}
      />
    );
  }

  renderPercentage() {

    const {
      inputName, labelText, isDisabled, isReadOnly, inputFocus,
      inputFullWidth, autoComplete, className, style
    } = this.props;

    const { val, inputIndex, isError, helperMsg } = this.state;

    return (
      <TextField
        name={inputName}
        value={val}
        label={labelText}
        disabled={isDisabled}
        helperText={helperMsg || helperTextManage(inputName, inputIndex)}
        error={isError || helperErrorManage(inputName, inputIndex)}
        autoFocus={inputFocus}
        inputRef={this.textRef}
        fullWidth={inputFullWidth || false}
        autoComplete={autoComplete || 'on'}
        style={style}
        className={className}
        onChange={e => this.inputChange(e)}
        inputProps={{
          maxLength: 5,
          decimalScale: 0,
          allowNegative: false,
        }}
        InputProps={{
          inputComponent: NumberFormatWrapper,
          readOnly: isReadOnly,
          endAdornment: <InputAdornment position='end'>
            <i
              className='material-icons'
              style={{ fontFamily: 'helvetica', fontSize: '20px', cursor: 'pointer' }}
              onClick={() => isReadOnly ? null : this.props.toggleTXNValueType()}
            >%</i>
          </InputAdornment>
        }}
        key={inputName}
      />
    );

  }

  pendingWithdrawalModal() {
    const actionButtons = [
      {
        label: NO,
        action: () => this.pendingWithdrawalAction(NO), // Prompt closes and source account data remains on screen
        buttonType: 'text',
      },
      {
        label: YES,
        action: () => this.pendingWithdrawalAction(YES), // Full Market is selected and Percentage based entry of 100%
        buttonType: 'contained',
      },
    ];

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ isPendingWithdrawalModal: false })}
        show={this.state.isPendingWithdrawalModal}
        title='Convert to Full Market Transfer?'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          The amount of the transfer exceeds the Net Available balance for this account.
          Would you like to convert this to a full market value transfer?
        </div>
      </Modal>
    );
  }

  pendingWithdrawalAction(actionType) {
    if (actionType === YES) { // Full Market is selected and Percentage based entry of 100%
      this.setState(
        {
          val: 100,
          isError: false,
          helperMsg: '',
          txnValueType: false,
          isPendingWithdrawalModal: false
        },
        () => {
          const list = cloneDeep(window.singleForm.inputList);
          const fullMktIndex = list.findIndex(input => input.inputName === 'FullMkt');
          list[fullMktIndex].val = true;
          list[fullMktIndex].update = true;
          updateInputList(list);
          this.props.updateGroup();
        }
      );
    }
    else { // Prompt closes and source account data remains on screen
      this.setState(
        { isPendingWithdrawalModal: false },
        () => {
          const list = cloneDeep(window.singleForm.inputList);
          const fullMktIndex = list.findIndex(input => input.inputName === 'FullMkt');
          if (list[fullMktIndex].val) {
            list[fullMktIndex].val = false;
            list[fullMktIndex].update = true;
            updateInputList(list);
            this.props.updateGroup();
          }
        }
      );
    }
  }

}

export default withStyles(styles)(SourceTransferAmountInput);



function NumberFormatWrapper({ inputRef, ...etc }) {
  return (
    <NumberFormat
      {...etc}
      getInputRef={inputRef}
    />
  );
}

NumberFormatWrapper.propTypes = {
  inputRef: PropTypes.func, // supplied by <TextInput /> to maintain it's state
};