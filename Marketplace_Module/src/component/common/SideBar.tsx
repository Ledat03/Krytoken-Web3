import { Home, Inbox, Calendar, Search, Settings, Airplay, BookText } from "lucide-react";
import { Sidebar, SidebarContent as UISidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar } from "@/components/ui/sidebar";

const SidebarContent = () => {
  const { setOpen } = useSidebar();

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Contract Information",
      url: "/feature/contact_info",
      icon: BookText,
    },
  ];

  return (
    <Sidebar variant="inset" collapsible="icon" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <SidebarHeader>
        <SidebarMenu className="stable-scrollbar">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/">
                <Airplay />
                <span >Exclusive Cookies</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <UISidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
