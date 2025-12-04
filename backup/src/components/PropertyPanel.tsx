import React from 'react';
import styled from 'styled-components';

const PropertyPanelContainer = styled.div`
  width: 300px;
  background: #2d2d2d;
  border-left: 1px solid #444;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const PropertyPanelHeader = styled.div`
  background: #3d3d3d;
  padding: 12px 16px;
  border-bottom: 1px solid #444;
`;

const PropertyPanelTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: #ccc;
`;

const PropertyPanelContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const PropertyGroup = styled.div`
  margin-bottom: 20px;
`;

const PropertyGroupTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #999;
  font-weight: normal;
`;

const PropertyItem = styled.div`
  margin-bottom: 8px;
`;

const PropertyLabel = styled.label`
  display: block;
  font-size: 11px;
  color: #ccc;
  margin-bottom: 4px;
`;

const PropertyInput = styled.input`
  width: 100%;
  background: #444;
  border: 1px solid #666;
  color: white;
  padding: 6px 8px;
  border-radius: 3px;
  font-size: 11px;
  
  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

const PropertySelect = styled.select`
  width: 100%;
  background: #444;
  border: 1px solid #666;
  color: white;
  padding: 6px 8px;
  border-radius: 3px;
  font-size: 11px;
  
  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

const PropertyTextarea = styled.textarea`
  width: 100%;
  background: #444;
  border: 1px solid #666;
  color: white;
  padding: 6px 8px;
  border-radius: 3px;
  font-size: 11px;
  min-height: 60px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

interface PropertyPanelProps {
  selectedNode: any;
  onPropertyChange: (nodeId: string, property: string, value: any) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedNode, onPropertyChange }) => {
  if (!selectedNode) {
    return (
      <PropertyPanelContainer>
        <PropertyPanelHeader>
          <PropertyPanelTitle>属性面板</PropertyPanelTitle>
        </PropertyPanelHeader>
        <PropertyPanelContent>
          <div style={{ color: '#999', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
            请选择一个节点或变量
          </div>
        </PropertyPanelContent>
      </PropertyPanelContainer>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    onPropertyChange(selectedNode.id, property, value);
  };

  return (
    <PropertyPanelContainer>
      <PropertyPanelHeader>
        <PropertyPanelTitle>
          {selectedNode.data?.label || '属性面板'}
        </PropertyPanelTitle>
      </PropertyPanelHeader>
      <PropertyPanelContent>
        <PropertyGroup>
          <PropertyGroupTitle>基本信息</PropertyGroupTitle>
          <PropertyItem>
            <PropertyLabel>名称</PropertyLabel>
            <PropertyInput
              type="text"
              value={selectedNode.data?.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
          </PropertyItem>
          <PropertyItem>
            <PropertyLabel>类型</PropertyLabel>
            <PropertyInput
              type="text"
              value={selectedNode.data?.nodeType || ''}
              readOnly
              style={{ background: '#333' }}
            />
          </PropertyItem>
        </PropertyGroup>

        {selectedNode.data?.properties && Object.keys(selectedNode.data.properties).length > 0 && (
          <PropertyGroup>
            <PropertyGroupTitle>属性</PropertyGroupTitle>
            {Object.entries(selectedNode.data.properties).map(([key, value]: [string, any]) => (
              <PropertyItem key={key}>
                <PropertyLabel>{key}</PropertyLabel>
                {typeof value === 'boolean' ? (
                  <PropertySelect
                    value={value.toString()}
                    onChange={(e) => handlePropertyChange(`properties.${key}`, e.target.value === 'true')}
                  >
                    <option value="true">是</option>
                    <option value="false">否</option>
                  </PropertySelect>
                ) : typeof value === 'number' ? (
                  <PropertyInput
                    type="number"
                    value={value}
                    onChange={(e) => handlePropertyChange(`properties.${key}`, parseFloat(e.target.value))}
                  />
                ) : (
                  <PropertyInput
                    type="text"
                    value={value}
                    onChange={(e) => handlePropertyChange(`properties.${key}`, e.target.value)}
                  />
                )}
              </PropertyItem>
            ))}
          </PropertyGroup>
        )}

        {selectedNode.data?.description && (
          <PropertyGroup>
            <PropertyGroupTitle>描述</PropertyGroupTitle>
            <PropertyItem>
              <PropertyTextarea
                value={selectedNode.data.description}
                onChange={(e) => handlePropertyChange('description', e.target.value)}
              />
            </PropertyItem>
          </PropertyGroup>
        )}
      </PropertyPanelContent>
    </PropertyPanelContainer>
  );
};

export default PropertyPanel;
