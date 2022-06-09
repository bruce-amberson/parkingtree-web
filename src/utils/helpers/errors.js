const errors = {
  age_limits(minAge, maxAge) { return `Age must be between ${minAge} and ${maxAge}.`; }, // eslint-disable-line
  amount_invalid: 'Enter a valid amount.',
  copy_email: 'Please type email to confirm.',
  copy_ssn_tin: 'Please type Social Security Number / TIN to confirm.',
  date_invalid: 'Select a valid date.',
  date_limits(minDate, maxDate) { return `Date must be between ${minDate} and ${maxDate}.`; }, // eslint-disable-line
  email_invalid: 'Email address is not valid.',
  emails_must_match: 'Emails must match.',
  field_max_length(max) { return `Field cannot exceed ${max} characters.`; }, // eslint-disable-line
  no_trailing_leading_spaces: 'Field cannot contain leading or trailing spaces.',
  no_spaces_anywhere: 'This field cannot contain spaces',
  password_criteria: 'Password does not meet criteria.',
  passwords_match: 'Passwords must match.',
  phone_number_too_short: 'Phone number needs to be 10 digits.',
  postal_code_reqs: 'Postal code must be 5 or 9 digits long.',
  recaptcha_unauthorized(supportNumber) { return `We have detected that you may be an unauthorized user. If this is incorrect, contact us at ${supportNumber}.`; }, // eslint-disable-line
  required: 'Field is required.',
  school_required: 'School is required. Click the button to select one.',
  select_option: 'Please select an option.',
  smarty_streets_generic: 'Address validation has stopped working. You may be sending too many requests, or your address may be malformed.',
  ssn_length: 'Social security number must be 9 digits.',
  ssns_tins_must_match: 'Social Security Numbers / TINs must match.',
  terms_agree: 'You must agree to the terms and conditions.',
  username_min_length: 'Username must be at least 6 characters.',
  username_with_numbers: 'Username cannot have more than 3 consecutive digits.',
  age_limits(minAge, maxAge) { return `Age must be between ${minAge} and ${maxAge}.`; }, // eslint-disable-line
  date_limits(minDate, maxDate) { return `Date must be between ${minDate} and ${maxDate}.`; }, // eslint-disable-line
  field_max_length_20: 'Field cannot exceed 20 characters.',
  field_max_length_40: 'Field cannot exceed 40 characters.',
  field_max_length_custom(limit) { return `Field cannot exceed ${limit} characters.`; }, // eslint-disable-line
  recaptcha_unauthorized(supportNumber) { return `We have detected that you may be an unauthorized user. If this is incorrect, contact us at ${supportNumber}.`; }, // eslint-disable-line
};

export {
  errors,
};