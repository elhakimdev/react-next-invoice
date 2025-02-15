'use client';

import { AppNavbar } from "src/components/app-navbar";
import { AppSidebar } from "src/components/app-sidebar";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export interface Menu {
  title: string;
  href: string;
  children?: Menu[];
}

export const defaultMenus: Menu[] = [
  {
    title: 'Add Invoice',
    href: '/invoices/add'
  },
  {
    title: 'List Invoices',
    href: '/invoices/listing'
  }
];

export const Layout = ({ children }: LayoutProps) => { 
  
  const [menus] = useState(defaultMenus);

  return (
    <div>
        <div className="flex h-screen">
        
          {/* Sidebar */}
          <AppSidebar menus={menus} />
          
          {/* Main Content */}
          <main className="bg-[#f1f5f9] flex flex-col w-full h-screen">
            <AppNavbar />
            <div className="flex-1 flex justify-center items-center">
              {children}
            </div>
          </main>
        </div>
    </div>
  );
}

export default Layout