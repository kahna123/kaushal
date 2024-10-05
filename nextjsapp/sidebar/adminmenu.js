// SidebarMenu.js

import {
	Home,
	BarChart,
	DollarSign,
	Users,
	Settings,
	User,
	Lock,
	Table,
	PenTool,
  } from 'lucide-react'; // Import icons from lucide-react
  
  const Adminmenu = [
	{
	  name: 'Order',
	  href: '/admin',
	  icon: Home, // Assign an icon to the menu item
	},
	{
	  name: 'Delivery',
	  href: '/admin/Delivery',
	  icon: DollarSign
	},
	{
		name: 'Deliverd',
		href: '/admin/Deliverd',
		icon: BarChart,
	  },
	  {
		name: 'Tools',
		href: '/admin/tools',
		icon: PenTool 
		
	},
	// {
	//   name: 'Customers',
	//   href: '/customers',
	//   icon: Users,
	// },
	// {
	//   name: 'Settings',
	//   href: '/settings',
	//   icon: Settings,
	//   subMenu: [
	// 	{ name: 'Profile Settings', href: '/settings/profile' },
	// 	{ name: 'Account Settings', href: '/settings/account' },
	//   ],
	// },
  ];
  
  export default Adminmenu;
  