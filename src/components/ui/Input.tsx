import React from 'react';
import styled from 'styled-components';

interface InputProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'password' | 'email';
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

const InputContainer = styled.input<{
  $disabled: boolean;
  $readOnly: boolean;
}>`
  width: 100%;
  background: ${props => {
    if (props.$disabled || props.$readOnly) return '#333';
    return '#444';
  }};
  border: 1px solid ${props => {
    if (props.$disabled) return '#666';
    return '#666';
  }};
  color: white;
  padding: 6px 8px;
  border-radius: 3px;
  font-size: 11px;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'text'};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007acc;
  }

  &::placeholder {
    color: #999;
  }
`;

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  readOnly = false,
  className
}) => {
  return (
    <InputContainer
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      $disabled={disabled}
      $readOnly={readOnly}
      className={className}
    />
  );
};

export default Input;