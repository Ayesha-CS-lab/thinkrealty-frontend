import { Space } from "antd";
import { useSelector } from "react-redux";
import PricingCalculator from "./PricingCalculator";
import ProjectTimeline from "./ProjectTimeline";
import UnitBreakdown from "./UnitBreakdown";
import PaymentOptions from "./PaymentOptions";
import AvailabilityIndicator from "./AvailabilityIndicator";

export default function PreviewSidebar() {
  const selectedUnitsCount = useSelector(
    (state) => state.landingPage.selectedUnits.length
  );

  if (selectedUnitsCount === 0) {
    return null;
  }

  return (
    <div className="sticky top-4">
      <Space direction="vertical" size="large" className="w-full">
        <PricingCalculator />
        <AvailabilityIndicator />
        <ProjectTimeline />
        <UnitBreakdown />
        <PaymentOptions />
      </Space>
    </div>
  );
}
