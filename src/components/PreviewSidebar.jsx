// src/components/PreviewSidebar.jsx

import { Space } from "antd";
import { useSelector } from 'react-redux'; // Import useSelector
import PricingCalculator from "./PricingCalculator";
import SelectionAnalysis from "./SelectionAnalysis";
import UnitBreakdown from "./UnitBreakdown";
import PaymentOptions from "./PaymentOptions";
import AvailabilityIndicator from "./AvailabilityIndicator";

// --- FIX: Remove props from the function signature ---
export default function PreviewSidebar() {
  
  // --- FIX: Get the selected units count directly from Redux ---
  const selectedUnitsCount = useSelector((state) => state.landingPage.selectedUnits.length);

  // The condition now works correctly
  if (selectedUnitsCount === 0) {
    return null;
  }
  
  return (
    // The `sticky` class helps keep the sidebar visible on scroll
    <div className="sticky top-4"> 
      <Space direction="vertical" size="large" className="w-full">
        {/* FIX: All child components now take NO props */}
        <PricingCalculator />
        <AvailabilityIndicator/>
        <SelectionAnalysis />
        <UnitBreakdown />
        <PaymentOptions />
      </Space>
    </div>
  );
}