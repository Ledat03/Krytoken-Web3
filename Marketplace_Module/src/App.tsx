import Header from "./component/common/Header";
import SideBar from "./component/common/SideBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
function App() {
  return (
    <>
      <div className="flex bg-gray-950 text-white h-fit">
        <SideBar />
        <div className="w-full">
          <Header />
          <div className="content-container">
            <Outlet />
          </div>
        </div>
        <Toaster richColors position="top-center" />
      </div>
    </>
  );
}

export default App;
