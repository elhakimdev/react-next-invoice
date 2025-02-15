import { AppSidebarMenu, SidebarMenu } from "./app-sidebar-menu"

import { AppLogo } from "./app-logo"

export const AppSidebar = ({menus} : {menus: SidebarMenu[]}) => {
  return (
    <aside className="bg-[#1c2434] w-[300px] text-white p-4">
      <AppLogo />
      <AppSidebarMenu menus={menus} />
    </aside>
  )
}