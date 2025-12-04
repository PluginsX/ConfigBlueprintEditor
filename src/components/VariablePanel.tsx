import React, { useState } from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  width: 250px;
  background: #2d2d2d;
  border-left: 1px solid #444;
  padding: 16px;
  color: white;
`;

const PanelTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #ccc;
`;

const VariableList = styled.div`
  margin-bottom: 16px;
`;

const VariableItem = styled.div`
  background: #444;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  font-size: 12px;
`;

const VariableName = styled.span`
  font-weight: bold;
  color: #4ECDC4;
`;

const VariableValue = styled.span`
  color: #FFD700;
  margin-left: 8px;
`;

const AddVariableButton = styled.button`
  width: 100%;
  background: #4CAF50;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #45a049;
  }
`;

const VariableForm = styled.div`
  background: #444;
  padding: 12px;
  border-radius: 4px;
  margin-top: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  background: #333;
  border: 1px solid #666;
  color: white;
  padding: 4px;
  margin-bottom: 8px;
  border-radius: 2px;
  font-size: 12px;
`;

const FormSelect = styled.select`
  width: 100%;
  background: #333;
  border: 1px solid #666;
  color: white;
  padding: 4px;
  margin-bottom: 8px;
  border-radius: 2px;
  font-size: 12px;
`;

const FormButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const FormButton = styled.button`
  flex: 1;
  background: #666;
  border: none;
  color: white;
  padding: 4px;
  border-radius: 2px;
  cursor: pointer;
  font-size: 11px;
  
  &:hover {
    background: #777;
  }
`;

interface Variable {
  name: string;
  type: 'string' | 'number' | 'boolean';
  value: any;
}

interface VariablePanelProps {
  variables: Variable[];
  onAddVariable: (variable: Variable) => void;
  onRemoveVariable: (name: string) => void;
}

const VariablePanel: React.FC<VariablePanelProps> = ({ 
  variables, 
  onAddVariable, 
  onRemoveVariable 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newVariable, setNewVariable] = useState<{
    name: string;
    type: 'string' | 'number' | 'boolean';
    value: string;
  }>({
    name: '',
    type: 'string',
    value: ''
  });

  const handleAddVariable = () => {
    if (newVariable.name.trim()) {
      let value: any;
      
      switch (newVariable.type) {
        case 'number':
          value = Number(newVariable.value);
          break;
        case 'boolean':
          value = newVariable.value === 'true';
          break;
        default:
          value = newVariable.value;
      }
      
      onAddVariable({
        ...newVariable,
        value
      });
      
      setNewVariable({ name: '', type: 'string', value: '' });
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setNewVariable({ name: '', type: 'string', value: '' });
    setShowForm(false);
  };

  return (
    <PanelContainer>
      <PanelTitle>变量面板</PanelTitle>
      
      <VariableList>
        {variables.map((variable) => (
          <VariableItem key={variable.name}>
            <VariableName>{variable.name}</VariableName>
            <VariableValue>
              ({variable.type}): {String(variable.value)}
            </VariableValue>
            <button 
              onClick={() => onRemoveVariable(variable.name)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FF6B6B',
                cursor: 'pointer',
                float: 'right',
                fontSize: '10px'
              }}
            >
              删除
            </button>
          </VariableItem>
        ))}
      </VariableList>

      {!showForm ? (
        <AddVariableButton onClick={() => setShowForm(true)}>
          + 添加变量
        </AddVariableButton>
      ) : (
        <VariableForm>
          <FormInput
            placeholder="变量名"
            value={newVariable.name}
            onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
          />
          <FormSelect
            value={newVariable.type}
            onChange={(e) => setNewVariable({...newVariable, type: e.target.value as any})}
          >
            <option value="string">字符串</option>
            <option value="number">数字</option>
            <option value="boolean">布尔值</option>
          </FormSelect>
          <FormInput
            placeholder="值"
            value={newVariable.value}
            onChange={(e) => setNewVariable({...newVariable, value: e.target.value})}
          />
          <FormButtons>
            <FormButton onClick={handleAddVariable}>确认</FormButton>
            <FormButton onClick={handleCancel}>取消</FormButton>
          </FormButtons>
        </VariableForm>
      )}
    </PanelContainer>
  );
};

export default VariablePanel;
