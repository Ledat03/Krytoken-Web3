import { Home, Settings, BookText, BadgeDollarSign } from "lucide-react";
import { Sidebar, SidebarContent as UISidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import Logo from "../../../public/background/Gingerbrave.webp";
const SidebarContent = () => {
  const { open, setOpen } = useSidebar();

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const items = [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Settings",
      url: "/home/setting ",
      icon: Settings,
    },
    {
      title: "Contract Information",
      url: "/home/feature/contact_info",
      icon: BookText,
    },
    {
      title: "Buy Token",
      url: "/home/buy_token",
      icon: BadgeDollarSign,
    },
  ];

  return (
    <Sidebar variant="inset" collapsible="icon" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <SidebarHeader className="p-0">
        <SidebarMenu className="stable-scrollbar px-0">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="/"
                className="min-h-[50px] relative [&:hover]:!text-[#2a3028] data-[state=open]:[&:hover]:!bg-[#e8a317] data-[state=open]:[&:hover]:!text-[#2a3028]"
              >
                <img src={Logo} className="absolute -left-0.75 min-w-12.5 h-[50px]" alt="" />
                <span className={`absolute right-10 cookie-text text-2xl bg-[#e8a317] text-[#2a3028] border-2 border-[#2a3028] rounded-2xl px-2 ${open ? "opacity-100 transition-all duration-500 ease-in" : "opacity-0 transition-all ease-in-out"}`}>Magic Oven</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <UISidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-[18px] cookie-text">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </UISidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

const SideBar = () => {
  return (
    <>
      <SidebarProvider defaultOpen={false} className="w-auto">
        <SidebarContent />
      </SidebarProvider>
    </>
  );
};
export default SideBar;
