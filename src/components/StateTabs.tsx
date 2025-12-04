import React from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  background: #2d2d2d;
  border-bottom: 1px solid #444;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 40px;
`;

const TabList = styled.div`
  display: flex;
  flex: 1;
  gap: 2px;
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#007acc' : '#444'};
  border: 1px solid ${props => props.active ? '#007acc' : '#666'};
  color: white;
  padding: 6px 12px;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-size: 12px;
  min-width: 80px;
  text-align: center;
  position: relative;
  
  &:hover {
    background: ${props => props.active ? '#007acc' : '#555'};
  }
`;

const AddTabButton = styled.button`
  background: #444;
  border: 1px solid #666;
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;
  
  &:hover {
    background: #555;
  }
`;

const CloseTabButton = styled.button`
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 10px;
  margin-left: 4px;
  padding: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

interface StateTabsProps {
  states: Array<{ id: string; name: string; isFunction?: boolean }>;
  currentStateId: string;
  onStateChange: (stateId: string) => void;
  onAddState: () => void;
  onCloseState: (stateId: string) => void;
}

const StateTabs: React.FC<StateTabsProps> = ({
  states,
  currentStateId,
  onStateChange,
  onAddState,
  onCloseState
}) => {
  return (
    <TabsContainer>
      <TabList>
        {states.map((state) => (
          <Tab
            key={state.id}
            active={state.id === currentStateId}
            onClick={() => onStateChange(state.id)}
          >
            {state.name}
            {state.id !== 'main' && (
              <CloseTabButton
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseState(state.id);
                }}
                title="关闭"
              >
                ×
              </CloseTabButton>
            )}
          </Tab>
        ))}
      </TabList>
      <AddTabButton onClick={onAddState} title="添加新蓝图">
        +
      </AddTabButton>
    </TabsContainer>
  );
};

export default StateTabs;
