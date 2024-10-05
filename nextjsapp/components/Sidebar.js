import Adminmenu from '@/sidebar/adminmenu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image'; // Import Image from Next.js
import { X } from 'lucide-react'; 
const Sidebar = ({ isOpen ,toggleSidebar}) => {
  const [menu, setMenu] = useState([]);
  const [isReady, setIsReady] = useState(false);

  return (
    <aside
    className={`bg-gray-800 dark:bg-gray-900 z-50 text-white dark:text-gray-200 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
  >
      {/* Project Logo */}
      <div className="flex items-center justify-between mb-6 px-4">
        {/* Close Button */}
        <div>
          <h1 className='text-2xl text-blod'>SMEW</h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="md:hidden focus:outline-none text-white hover:bg-gray-700 p-2 rounded"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav>
        {Adminmenu.map((item) => (
          <SidebarItem key={item.href} item={item} />
        ))}
      </nav>
    </aside>
  );
};

const SidebarItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === item.href;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Link
          href={item.href}
          className={`flex items-center block py-2.5 my-2 px-4 rounded transition duration-200 ${
            isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-700 hover:text-white'
          }`}
          onClick={item.subMenu ? handleToggle : null}
        >
          {item.icon && <item.icon className="mr-2 w-5 h-5" />}
          {item.name}
        </Link>
        {item.subMenu && (
          <button onClick={handleToggle} className="focus:outline-none">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        )}
      </div>
      <div
        className={`ml-4 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        {item.subMenu &&
          item.subMenu.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className={`block py-1 px-4 rounded transition my-2 duration-200 ${
                pathname === subItem.href ? 'bg-blue-500 text-white' : 'hover:bg-gray-700 hover:text-white'
              }`}
            >
              {subItem.name}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
