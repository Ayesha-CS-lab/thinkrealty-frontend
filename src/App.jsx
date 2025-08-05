import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import OfflineNavigator from "./pages/errorScreen/offlineError";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
          colorBgContainer: "#ffffff",
        },
      }}
    >
      <div className="App">
        <OfflineNavigator />
        <RouterProvider router={router} />
      </div>
    </ConfigProvider>
  );
}

export default App;
