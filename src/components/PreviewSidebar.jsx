import { Space } from "antd";
import { useSelector } from 'react-redux'; 
import PricingCalculator from "./PricingCalculator";
import SelectionAnalysis from "./SelectionAnalysis";
import UnitBreakdown from "./UnitBreakdown";
import PaymentOptions from "./PaymentOptions";
import AvailabilityIndicator from "./AvailabilityIndicator";

export default function PreviewSidebar() {
  
  //  Get the selected units count directly from Redux ---
  const selectedUnitsCount = useSelector((state) => state.landingPage.selectedUnits.length);

  if (selectedUnitsCount === 0) {
    return null;
  }
  
  return (
    <div className="sticky top-4"> 
      <Space direction="vertical" size="large" className="w-full">
        <PricingCalculator />
        <AvailabilityIndicator/>
        <SelectionAnalysis />
        <UnitBreakdown />
        <PaymentOptions />
      </Space>
    </div>
  );
}