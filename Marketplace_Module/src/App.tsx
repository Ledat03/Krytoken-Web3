import Header from "./component/common/Header";
import Footer from "./component/common/Footer";
import SideBar from "./component/common/SideBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
function App() {
  return (
    <>
      <div className="flex bg-app text-foreground h-fit min-h-screen">  
        <SideBar />
        <div className="w-full">
          <Header />
          <div className="content-container min-h-screen">
            <Outlet />
          </div>
          <Footer />
        </div>
        <Toaster richColors position="top-center" />
      </div>
    </>
  );
}

export default App;
