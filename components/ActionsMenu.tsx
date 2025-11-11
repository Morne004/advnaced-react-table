import React, { useState, useRef } from 'react';
import MoreHorizontalIcon from './icons/MoreHorizontalIcon';
import EyeIcon from './icons/EyeIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
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
    <div className="relative flex justify-center" ref={menuRef}>
      <button
        id={`actions-menu-button-${row.id}`}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded-full hover:bg-gray-200 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-50 group-hover:opacity-100 focus:opacity-100'}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={`actions-menu-${row.id}`}
      >
        <MoreHorizontalIcon className="h-5 w-5 text-gray-600" />
        <span className="sr-only">Open actions menu</span>
      </button>
      <div 
        id={`actions-menu-${row.id}`}
        className={`absolute right-0 z-40 mt-2 w-36 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg transition transform ease-out duration-100 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={`actions-menu-button-${row.id}`}
      >
          <div className="py-1" role="none">
            <button
              onClick={() => handleAction('view')}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <EyeIcon className="h-4 w-4" />
              <span>View</span>
            </button>
            <button
              onClick={() => handleAction('edit')}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleAction('delete')}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              role="menuitem"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
    </div>
  );
};

export default ActionsMenu;