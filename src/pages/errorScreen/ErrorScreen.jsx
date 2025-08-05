import { Alert, Button } from "antd";
import PropTypes from "prop-types";

export default function NetworkErrorFallback({ error, resetErrorBoundary }) {
  const isNetworkError = error?.message?.toLowerCase().includes("network");

  return (
    <div
      className="flex flex-col items-center justify-center h-screen w-full"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        gap: "1rem",
        padding: "1rem",
        width: "100%",
      }}
    >
      <Alert
        message={
          isNetworkError ? "Slow or Unstable Network" : "Something went wrong"
        }
        description={
          isNetworkError
            ? "Please check your internet connection or try refreshing the page."
            : error?.message || "Unexpected error occurred."
        }
        type="warning"
        showIcon
      />

      <Button
        className="bg-secondaryColor text-whiteColor font-custom border-none text-xs"
        onClick={resetErrorBoundary}
      >
        Refresh Page
      </Button>
    </div>
  );
}

NetworkErrorFallback.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func,
};
