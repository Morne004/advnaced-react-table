import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';

interface ActionsMenuProps {
  row: User;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));
  
  const handleAction = (action: 'view' | 'edit' | 'delete') => {
    setIsOpen(false);
    switch(action) {
      case 'view':
        alert(`Viewing user ${row.firstName} ${row.lastName} (ID: ${row.id})`);
        break;
      case 'edit':
        alert(`Editing user ${row.firstName} ${row.lastName} (ID: ${row.id})`);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete user ${row.firstName} ${row.lastName} (ID: ${row.id})?`)) {
          console.log("User deleted (simulation)");
        }
        break;
    }
  };

  return (
    <div ref={menuRef}>
      <button
        id={`actions-menu-button-${row.id}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={`actions-menu-${row.id}`}
      >
        ...
        <span >Open actions menu</span>
      </button>
      <div 
        id={`actions-menu-${row.id}`}
        style={{ display: isOpen ? 'block' : 'none' }}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={`actions-menu-button-${row.id}`}
      >
          <div role="none">
            <button
              onClick={() => handleAction('view')}
              role="menuitem"
            >
              <span>View</span>
            </button>
            <button
              onClick={() => handleAction('edit')}
              role="menuitem"
            >
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleAction('delete')}
              role="menuitem"
            >
              <span>Delete</span>
            </button>
          </div>
        </div>
    </div>
  );
};

export default ActionsMenu;