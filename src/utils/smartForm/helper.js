import { cloneDeep } from 'lodash';
import { REQUIRED } from 'utils/smartForm/constants';
import { persistErrors } from 'utils/smartForm/error_handler';

let formUpdater = null; // reserved for passing down this.forceUpdate() from parent (form) component

/**
* Test a list of Smart Inputs data to discover if requirements are met
* 
* @param array[objects] list of smart input objects
*
* @returns Object with validation status and updated array of smart input objects
*/
export function checkRequiredInputs(list) {
  try {
    let validationObj = {};
    list.forEach(input => {
      delete input.isEmpty;
      if (input.isRequired && (input.val === undefined || input.val === '')) {
        input.isEmpty = true;
        delete input.inlineMsg; // delete any previously displayed inline error message
      }
    });
    if (list.some(input => input.isEmpty)
    || list.some(input => input.isValid === false)) {
      validationObj = {
        isValid: false,
        list
      };
    }
    else {
      validationObj = {
        isValid: true,
        list
      };
    }
    return validationObj;
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Prepare data in Smart Form inputList to be sent to API
* 
* @param array[objects] list of smart input objects
*
* @returns Object with key/value pairs
*/
export function prepInputList(list) {
  try {
    const result = {};
    list.forEach(input => {
      if (input.val !== undefined) {
        result[input.inputName] = input.val;
      }
    });
    return result;
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Provides inline error message to Smart Input
* 
* @param inputName String input name
* @param inputIndes Number array index of Smart Inputs inputList
*
* @returns String input inline message
*/
export function helperTextManage(inputName, inputIndex) {
  try {
    let message = '';
    if (inputName !== undefined && inputIndex !== undefined) {
      const curInput = window.smartForm.inputList[inputIndex];
      if (curInput) {
        if ((curInput.inputName === inputName && !curInput.isEmpty)
        && (curInput.inputName === inputName && curInput.inlineMsg === undefined)) {
          message = '';
        }
        else {
          curInput.inputName === inputName && curInput.inlineMsg
            ? message = curInput.inlineMsg
            : message = REQUIRED;
        }
      }
    }
    return message;
  }
  catch (error) {
    persistErrors(error);
  }

}

/**
* Provides Smart Input knowledge of whether to display red error message
* 
* @param inputName String input name
* @param inputIndes Number array index of Smart Inputs inputList
*
* @returns Object with key/value pairs
*/
export function helperErrorManage(inputName, inputIndex) {
  try {
    if (inputName !== undefined && inputIndex !== undefined) {
      const curInput = window.smartForm.inputList[inputIndex];
      if (curInput) {
        if ((curInput.inputName === inputName && !curInput.isEmpty)
        && (curInput.inputName === inputName && curInput.inlineMsg === undefined)) {
          return false;
        }
        else {
          return true;
        }
      }
    }
    else {
      return false;
    }
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Test a list of Smart Inputs to discover if they ALL match
* 
* @param {array[strings]} arrInputNames array list of smart input names to be tested
* @param {string} inputProperty smart input property name to test, native type expressed in a string
*
* @returns boolean
*/
export function allInputsHaveVal(arrInputNames, inputProperty) {
  try {
    const list = window.smartForm.inputList;
    const minifiedList = [];
    list.forEach(input => {
      arrInputNames.forEach(inputName => {
        if (input.inputName === inputName) {
          minifiedList.push(input);
        }
      });
    });
    return minifiedList.every(input => input[inputProperty] !== undefined && input[inputProperty] !== null);
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Test a list of Smart Inputs if at least ONE matches
* 
* @param {array[strings]} arrInputNames array list of smart input names to be tested
* @param {string} inputProperty smart input property name to test, native type expressed in a string
*
* @returns boolean
*/
export function someInputsHaveVal(arrInputNames, inputProperty) {
  try {
    const list = window.smartForm.inputList;
    const minifiedList = [];
    list.forEach(input => {
      arrInputNames.forEach(inputName => {
        if (input.inputName === inputName) {
          minifiedList.push(input);
        }
      });
    });
    return minifiedList.some(input => input[inputProperty] !== undefined && input[inputProperty] !== null);
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Clears smartForm back to initial state
*/
export function clearSmartForm() {
  try {
    if (window.smartForm) {
      window.smartForm.inputList = [];
      delete window.smartForm.formData;
    }
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Clears array of Smart Input objects 
*/
export function clearInputList() {
  try {
    if (window.smartForm) {
      window.smartForm.inputList = [];
    }
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Clears formData and all nested objects 
*/
export function clearFormData() {
  try {
    if (window.smartForm) {
      window.smartForm.formData = {};
    }
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Update array of Smart Input object data
* 
* @param {array[objects]} list array list of smart input names to be tested
*
*/
export function updateInputList(list) {
  try {
    if (window.smartForm) {
      window.smartForm.inputList = list;
    }
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Add Smart Input to array of Smart Input objects
* 
* @param Object input simple Smart Input
*
* @returns Number the index of the Smart Input in the array of Smart Input objects
*/
export function addInput(input) {
  try {
    let inputIndex = window.smartForm.inputList.findIndex(inputList => inputList.inputName === input.inputName);
    if (inputIndex < 0) {
      window.smartForm.inputList.push(input);
      inputIndex = window.smartForm.inputList.length - 1;
    }
    return inputIndex;
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Passes down Reacts component forceUpdate() and store on local variable
* 
* @param Object Reacts this.forceUpdate() hook
*/
export function setFormUpdate(formUpdate) {
  formUpdater = formUpdate;
}

/**
*
* Executes React this.forceUpdate hook at any level in component heirarchy
* 
*/
export function updateFormState() {
  formUpdater();
}

/**
* Updates a single Smart Input value and marks it valid
* 
* @param Number Array index of array list of Smart Input objects
* @param Object Complex Smart Input object with properties for updating relevant Smart Inputs
*
*/
export function updateInput(index, input) {
  try {
    const currentInput = cloneDeep(window.smartForm.inputList[index]);
    currentInput.val = input.val;
    currentInput.isValid = input.isValid;
    delete currentInput.inlineMsg;
    delete currentInput.update;
    delete currentInput.delete;
    delete currentInput.isEmpty;
    delete currentInput.replace;
    delete currentInput.eventType;
    window.smartForm.inputList[index] = currentInput;
    if (formUpdater) {
      setTimeout(formUpdater(), 100);
    }
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Add Smart Input to array of Smart Input objects
* 
* @param Number Array index of array list of Smart Input objects
* @param Object Complex Smart Input object with properties for updating relevant Smart Inputs
*
*/
export function addInlineMsg(input) {
  try {
    const inputList = window.smartForm.inputList;
    const index = inputList.findIndex(inputList => inputList.inputName === input.inputName);
    inputList[index].inlineMsg = input.inlineMsg;
    inputList[index].isValid = false;
  }
  catch (error) {
    persistErrors(error);
  }
}

/**
* Clears given inputs to blank values
* 
* @param Array
*
*/
export function clearGivenInputs(inputs) {
  try {
    inputs.length > 0 &&
    inputs.forEach(inputToClear => {
      const inputList = window.smartForm.inputList; 
      const inputIndex = inputList.findIndex(input => input.inputName === inputToClear);
      if (inputIndex > -1) inputList[inputIndex].delete = true; // add delete, only if input exists
    });
  }
  catch (error) {
    persistErrors(error);
  }
}


export const cleanDigits = (str) => str.replace(/[^\d]+/g, ''); // remove all non-digit characters

export const sanitizeHTML = (str) => str.replace(/[&"'<>\\`:]/g, ''); // remove all dangerous tags

export const alphaNumericOnly = (str) => str.replace(/[^0-9a-zA-Z]/g, '');