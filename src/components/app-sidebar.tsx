import { AppSidebarMenu, SidebarMenu } from "./app-sidebar-menu"

import { AppLogo } from "./app-logo"

export const AppSidebar = ({menus} : {menus: SidebarMenu[]}) => {
  return (
    <aside className="bg-[#1c2434] w-[300px] text-white px-[40px] py-[30px]">
      <AppLogo />
      <AppSidebarMenu menus={menus} />
    </aside>
  )
}