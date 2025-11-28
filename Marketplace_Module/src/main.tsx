import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import Dashboard from "./component/HomePage/Dashboard.tsx";
import InfoSmartContract from "./component/HomePage/Feature/InfoSmartContract.tsx";
import CreateNFT from "./component/HomePage/Feature/CreateNFT.tsx";
import NFTManager from "./component/ManageNFT.tsx";
import MarketplaceSettings from "./component/HomePage/Feature/MarketSetting.tsx";
import WelcomePage from "./component/Welcome.tsx";
import Setting from "./component/HomePage/Feature/Setting.tsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="/home/feature/contact_info" element={<InfoSmartContract />} />
            <Route path="/home/nft/manage" element={<NFTManager />} />
            <Route path="/home/nft/new" element={<CreateNFT />} />
            <Route path="/home/setting" element={<Setting />} />
          </Route>
          <Route path="/market/configuration" element={<MarketplaceSettings />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);
