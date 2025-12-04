import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: fixed;
  background: #2d2d2d;
  border: 1px solid #444;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 250px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  transform: none;
  transform-origin: top left;
`;

const SearchInput = styled.input`
  padding: 8px;
  margin: 8px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #1e1e1e;
  color: white;
  font-size: 12px;
  outline: none;

  &:focus {
    border-color: #007acc;
  }
`;

const MenuContent = styled.div`
  overflow-y: auto;
  padding: 4px 0;

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
`;

const CategoryHeader = styled.div`
  padding: 6px 12px;
  font-size: 11px;
  color: #999;
  background: #333;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background: #444;
  }
`;

const ExpandIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})<{ isExpanded: boolean }>`
  font-size: 8px;
  transition: transform 0.2s;
  transform: ${props => props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};
`;

const MenuItem = styled.div`
  padding: 6px 12px;
  font-size: 12px;
  color: white;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #007acc;
  }
`;

const NoResults = styled.div`
  padding: 12px;
  font-size: 12px;
  color: #999;
  text-align: center;
`;

interface NodeItem {
  id: string;
  name: string;
  category: string;
  type: string;
}

type MenuType = 'nodeCreation' | 'nodeOperations';

interface ContextMenuProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  onSelectNode?: (nodeType: string, position: { x: number; y: number }) => void;
  onCopyNode?: () => void;
  onPasteNode?: () => void;
  onDeleteNode?: () => void;
  nodeTypes?: NodeItem[];
  menuType: MenuType;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
  position, 
  onClose, 
  onSelectNode, 
  onCopyNode, 
  onPasteNode, 
  onDeleteNode, 
  nodeTypes, 
  menuType 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 过滤并按类别和名称排序节点
  const filteredNodes = useMemo(() => {
    if (!nodeTypes) return [];
    
    return nodeTypes
      .filter(node => 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });
  }, [nodeTypes, searchTerm]);
  
  // 按类别分组
  const nodesByCategory = useMemo(() => {
    return filteredNodes.reduce((acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = [];
      }
      acc[node.category].push(node);
      return acc;
    }, {} as Record<string, NodeItem[]>);
  }, [filteredNodes]);
  
  // 获取所有唯一的类别
  const categories = useMemo(() => Object.keys(nodesByCategory), [nodesByCategory]);
  
  // 跟踪每个类别的展开状态
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // 当类别变化时更新展开状态
  useEffect(() => {
    setExpandedCategories(prev => {
      const newExpanded = { ...prev };
      // 确保所有新类别都被添加到展开状态
      categories.forEach(category => {
        if (newExpanded[category] === undefined) {
          newExpanded[category] = true; // 默认展开新类别
        }
      });
      return newExpanded;
    });
  }, [categories]);
  
  // 切换类别展开状态
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (position) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [position, onClose]);

  if (!position) return null;

  // 节点创建菜单（空白处右键）
  const renderNodeCreationMenu = () => {
    if (!nodeTypes || !onSelectNode) return null;

    return (
      <>
        <SearchInput
          type="text"
          placeholder="搜索节点..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        <MenuContent>
          {filteredNodes.length === 0 ? (
            <NoResults>没有找到匹配的节点</NoResults>
          ) : (
            Object.entries(nodesByCategory).map(([category, nodes]) => (
              <React.Fragment key={category}>
                <CategoryHeader onClick={() => toggleCategory(category)}>
                  <span>{category}</span>
                  <ExpandIcon isExpanded={expandedCategories[category]}>▶</ExpandIcon>
                </CategoryHeader>
                {expandedCategories[category] && nodes.map((node) => (
                  <MenuItem
                    key={node.id}
                    onClick={() => {
                      if (position) {
                        onSelectNode(node.type, position);
                      }
                      onClose();
                    }}
                  >
                    {node.name}
                  </MenuItem>
                ))}
              </React.Fragment>
            ))
          )}
        </MenuContent>
      </>
    );
  };

  // 节点操作菜单（节点上右键）
  const renderNodeOperationsMenu = () => {
    return (
      <MenuContent>
        <MenuItem onClick={() => {
          if (onCopyNode) onCopyNode();
          onClose();
        }}>
          复制
        </MenuItem>
        <MenuItem onClick={() => {
          if (onPasteNode) onPasteNode();
          onClose();
        }}>
          粘贴
        </MenuItem>
        <MenuItem onClick={() => {
          if (onDeleteNode) onDeleteNode();
          onClose();
        }}>
          删除
        </MenuItem>
      </MenuContent>
    );
  };

  return (
    <MenuContainer
      ref={menuRef}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      {menuType === 'nodeCreation' ? renderNodeCreationMenu() : renderNodeOperationsMenu()}
    </MenuContainer>
  );
};

export default ContextMenu;