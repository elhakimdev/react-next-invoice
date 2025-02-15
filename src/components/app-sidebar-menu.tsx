import Link from "next/link";

export interface SidebarMenu {
  title: string;
  href: string;
  children?: SidebarMenu[];
}

export const AppSidebarMenu = ({ menus }: { menus: SidebarMenu[] }) => { 
  return (
    <div>
      <div className="flex flex-col space-y-4 mt-8">
        {menus.map(({title, href}) => {
          return(
            <Link key={title} href={href}>{title}</Link>
          )
        })}
      </div>
    </div>
  )
}
