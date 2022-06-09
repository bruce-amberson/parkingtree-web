export function emailValidate(email) {
  const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; // eslint-disable-line no-useless-escape
  return emailRegex.test(email);
}