import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

const ButtonContainer = styled.button<{
  $variant: 'primary' | 'secondary' | 'success' | 'danger';
  $size: 'small' | 'medium' | 'large';
  $disabled: boolean;
}>`
  background: ${props => {
    if (props.$disabled) return '#666';
    switch (props.$variant) {
      case 'primary': return '#007acc';
      case 'secondary': return '#444';
      case 'success': return '#4CAF50';
      case 'danger': return '#FF6B6B';
      default: return '#444';
    }
  }};
  border: 1px solid ${props => {
    if (props.$disabled) return '#888';
    switch (props.$variant) {
      case 'primary': return '#007acc';
      case 'secondary': return '#666';
      case 'success': return '#4CAF50';
      case 'danger': return '#FF6B6B';
      default: return '#666';
    }
  }};
  color: white;
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '4px 8px';
      case 'medium': return '6px 12px';
      case 'large': return '8px 16px';
      default: return '6px 12px';
    }
  }};
  border-radius: 4px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '11px';
      case 'medium': return '12px';
      case 'large': return '14px';
      default: return '12px';
    }
  }};
  opacity: ${props => props.$disabled ? 0.6 : 1};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => {
      if (props.$disabled) return '#666';
      switch (props.$variant) {
        case 'primary': return '#0066aa';
        case 'secondary': return '#555';
        case 'success': return '#45a049';
        case 'danger': return '#FF5252';
        default: return '#555';
      }
    }};
  }

  &:active {
    background: ${props => {
      if (props.$disabled) return '#666';
      switch (props.$variant) {
        case 'primary': return '#005599';
        case 'secondary': return '#333';
        case 'success': return '#388E3C';
        case 'danger': return '#FF1744';
        default: return '#333';
      }
    }};
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'medium',
  disabled = false,
  className
}) => {
  return (
    <ButtonContainer
      $variant={variant}
      $size={size}
      $disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </ButtonContainer>
  );
};

export default Button;