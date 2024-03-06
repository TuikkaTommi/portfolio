import { useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const Togglable = forwardRef((props, ref) => {
  // State inside a component
  const [visible, setVisible] = useState(false);

  // Change the visibility with styles
  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  // Method to toggle visibility-status
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // useimperativeHandle allows for the function to be called from outside the component
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button id={props.id} onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button id="cancel" variant="secondary" onClick={toggleVisibility}>
          Cancel
        </Button>
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = 'Togglable';

export default Togglable;
