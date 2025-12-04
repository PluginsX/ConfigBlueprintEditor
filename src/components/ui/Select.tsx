import React from 'react';
import styled from 'styled-components';

interface SelectProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string | number; label: string }>;
  disabled?: boolean;
  className?: string;
}

const SelectContainer = styled.select<{
  $disabled: boolean;
}>`
  width: 100%;
  background: ${props => props.$disabled ? '#333' : '#444'};
  border: 1px solid ${props => props.$disabled ? '#666' : '#666'};
  color: white;
  padding: 6px 8px;
  border-radius: 3px;
  font-size: 11px;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007acc;
  }

  option {
    background: #444;
    color: white;
  }
`;

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  className
}) => {
  return (
    <SelectContainer
      value={value}
      onChange={onChange}
      $disabled={disabled}
      className={className}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </SelectContainer>
  );
};

export default Select;