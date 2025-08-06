import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Layout } from "antd";
import ScrollToTop from "../utils/ScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../Layout/Header/header";
import {
  reconcileExternalChanges,
  tick,
} from "../features/landingPage/landingPageSlice";
import { mockUnits } from "../data/mockData";

const { Content } = Layout;

export default function RootLayout() {
  const dispatch = useDispatch();
  const previousMockUnitsRef = useRef(mockUnits);
  const layoutMode = useSelector((state) => state.landingPage.layoutMode);

  useEffect(() => {
    const previousMasterUnitList = previousMockUnitsRef.current;
    const newMasterUnitList = mockUnits;

    if (!Object.is(newMasterUnitList, previousMasterUnitList)) {
      dispatch(
        reconcileExternalChanges({
          newMasterUnitList: newMasterUnitList,
          previousMasterUnitList: previousMasterUnitList,
        })
      );

      previousMockUnitsRef.current = newMasterUnitList;
    }
  }, [mockUnits, dispatch]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [dispatch]);

  return (
    <Layout className="min-h-screen bg-gray-50">
      <ScrollToTop />

      <HeaderComponent />

      <Content
        className={`w-full max-w-7xl mx-auto p-4 md:p-6 ${
          layoutMode === "focus" ? "focus-mode" : ""
        }`}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}
