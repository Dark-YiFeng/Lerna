import React from 'react';
import PropTypes from 'prop-types';

const isArray =
  Array.isArray ||
  function (obj) {
    return toString.call(obj) === '[object Array]';
  };

export default function AuthWrapper(props) {
  try {
    if (isArray(props.children)) {
      console.error(
        'AuthWrapper Error: There must be only one child in AuthWrapper, but got ' +
          props.children.length +
          ' children',
      );
      return null;
    }
    const { rule, roleId } = props;
    const R = rule.get(roleId);
    /* Did not set rule for this role */
    if (R === undefined) {
      return props.children;
    }
    const { isShow, disabled } = R;
    if (!isShow) return null;
    if (typeof props.children === 'string') {
      return props.children;
    }
    const CP = props.children.props;
    /* AuthWrapper will overwrite disabled prop, if setted disable rule is true. */
    if (CP.hasOwnProperty('disabled') && disabled === true) {
      console.warn(
        "AuthWrapper Warnning: Children's porps 'disabled' would be overwrite by AuthWrapper.'",
      );
    }
    let DP = disabled === true ? { disabled } : {};
    return React.cloneElement(props.children, DP);
  } catch (e) {
    console.error('AuthWrapper Error: ', e);
    return null;
  }
}

AuthWrapper.propTypes = {
  rule: PropTypes.instanceOf(Map).isRequired,
  roleId: PropTypes.number.isRequired,
};

export const AuthCheck = function ({ rule, roleId }) {
  const R = rule.get(roleId);
  if (R === undefined) {
    return { isShow: true, disabled: false };
  }
  return R;
};
