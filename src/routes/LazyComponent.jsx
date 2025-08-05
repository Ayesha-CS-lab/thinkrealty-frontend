import { Suspense, lazy } from "react";
import Loading from "../components/loading/Loading";
import NetworkErrorFallback from "../pages/errorScreen/ErrorScreen";
import { ErrorBoundary } from "react-error-boundary";
import PropTypes from "prop-types";
const componentMap = {
 
  "/": lazy(() => import("../components/LandingPageBuilder")),
  // "/project/:projectId/units": lazy(() => import("../components/UnitMultiSelect")),
  "/preview": lazy(() => import("../pages/PreviewPage")),
};

const LazyComponent = ({ path }) => {
  const Component = componentMap[path];
  if (!Component) {
    return <div>Component not found</div>;
  }
  return (
    <ErrorBoundary FallbackComponent={NetworkErrorFallback}>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};
LazyComponent.propTypes = {
  path: PropTypes.string,
};
export default LazyComponent;
