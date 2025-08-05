import { useEffect, useState } from "react";
import { Typography } from "antd";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

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
          <LoadingOutlined style={styles.spinner} />
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
