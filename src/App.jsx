import { ConfigProvider } from "antd"
import LandingPageBuilder from "./components/LandingPageBuilder"

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
        <LandingPageBuilder />
      </div>
    </ConfigProvider>
  )
}

export default App