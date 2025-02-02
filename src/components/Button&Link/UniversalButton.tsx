import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classnames from 'classnames';

interface IButtonProps {
  type: 'button' | 'link';
  action: (() => void) | string;
  title: string | JSX.Element;
  classes?: string;
  isDisabled?: boolean;
}

const UniversalButton: React.FC<IButtonProps> = ({ type, action, title, classes, isDisabled }) => {
  const commonProps = {
    className: classnames(classes),
  };

  if (type === 'button') {
    return (
      <button {...commonProps} onClick={action as () => void} disabled={isDisabled}>
        {title}
      </button>
    );
  } else if (type === 'link') {
    return (
      <RouterLink {...commonProps} to={action as string}>
        {title}
      </RouterLink>
    );
  }

  return null;
};

export default UniversalButton;
