import Link from "next/link";

export interface SidebarMenu {
  title: string;
  href: string;
  icon:(() => React.ReactNode) | null | undefined;
  children?: SidebarMenu[];
}

export const AppSidebarMenu = ({ menus }: { menus: SidebarMenu[] }) => { 
  return (
    <div className="flex flex-col gap-y-5">
      <div className="text-[#9D9D9D] mt-8">
        Menu
      </div>
      <div className="flex flex-col space-y-5">
        {menus.map(({title, href, icon}) => {
          return(
            <div key={title} className="flex flex-row items-center justify-start h-full space-x-4">
              <div>{icon?.()}</div>
              <Link key={title} href={href} className="text-[#9D9D9D]">{title}</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
