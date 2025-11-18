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
import MarketplaceSettings from "./component/MarketSetting.tsx";
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
          <Route path="/" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="/feature/contact_info" element={<InfoSmartContract />} />
            <Route path="/nft/manage" element={<NFTManager />} />
            <Route path="/nft/new" element={<CreateNFT />} />
          </Route>
          <Route path="/market/configuration" element={<MarketplaceSettings />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);
