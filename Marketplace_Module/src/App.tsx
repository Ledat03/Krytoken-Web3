import Header from "./component/common/Header";
import Footer from "./component/common/footer";
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
