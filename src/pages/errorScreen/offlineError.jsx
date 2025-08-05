import { useEffect, useState } from "react";
import { Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const OfflineNavigator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    const handleUserClick = () => {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000); // hide after 2 seconds
    };

    return (
      <div style={styles.overlay} onClick={handleUserClick}>
        {showMessage && (
          <div style={styles.topToast}>
            <ExclamationCircleOutlined style={{ marginRight: 8 }} />
            You're offline. Please connect to the internet to use the app.
          </div>
        )}
        <div style={styles.content}>
          {/* <LoadingOutlined style={styles.spinner} /> */}

          <div role="status" className="flex justify-center flex-col items-center p-3">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lightWhite" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>

          <Typography.Title level={4} style={{ color: "#fff" }}>
            Lost Connection
          </Typography.Title>
          <Typography.Text style={{ color: "#eee", marginBottom: 8 }}>
            Looks like you're not connected to the internet.
          </Typography.Text>
          <Typography.Text style={{ color: "#ccc" }}>
            Please check your connection and try again.
          </Typography.Text>
        </div>
      </div>
    );
  }

  return null;
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#222",
    color: "#fff",
    zIndex: 9999,
    pointerEvents: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  content: {
    textAlign: "center",
    position: "relative",
  },
  spinner: {
    fontSize: 48,
    color: "#fff",
    marginBottom: 16,
    animation: "spin 2s linear infinite",
  },
  topToast: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%) translateY(16px)",
    padding: "10px 16px",
    backgroundColor: "#f5222d",
    color: "#fff",
    borderRadius: 6,
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
    zIndex: 10000,
    animation: "fadeIn 0.3s ease-in-out",
  },
};

export default OfflineNavigator;