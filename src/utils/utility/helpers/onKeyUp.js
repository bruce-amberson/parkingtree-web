/**
 * onKeyUp Wrapper
 * @param callback {Function}
 * @returns {Function}
 * @desc This function enables normal accessibility through keyboard input on custom button implementations.
 * @see Modal for an example.
 * @link [Using the button Role - Keyboard and Focus](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role#Keyboard_and_focus)
 */
export function onKeyUp(callback) {
  return (event) => {
    // enabling keyboard accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      callback(event);
    }
  };
}
