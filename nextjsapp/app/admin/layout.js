'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  


  useEffect(() => {
    const userdata = sessionStorage.getItem('userdata')


    if (userdata) {
      setIsAuthorized(true);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!isAuthorized) {
    return <div>Loading...</div>;
  }


  
  return <div><div className="flex h-screen">
  <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
  <div className="flex-1 flex flex-col overflow-hidden">
    <Header toggleSidebar={toggleSidebar}/>
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 py-3 px-2">
      {children}
    </main>
    {/* <Footer /> */}
  </div>
</div></div>;
}
