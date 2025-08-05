import { useMemo } from "react";
import { Card, Progress, Typography } from "antd";
import { useSelector } from 'react-redux'; 

const { Text } = Typography;

export default function SelectionAnalysis() {
  
    const { selectedUnits, selectedProject } = useSelector(state => state.landingPage);
const analysis = useMemo(() => {
    if (!selectedUnits || selectedUnits.length === 0) return null;

    const totalArea = selectedUnits.reduce((sum, u) => sum + u.area_sqft, 0);
    const totalPrice = selectedUnits.reduce((sum, u) => sum + u.price, 0);
    
    // Define a luxury unit as > 3M AED or > 2000 sqft
    const luxuryUnitsCount = selectedUnits.filter(
      (u) => u.price > 3000000 || u.area_sqft > 2000
    ).length;

    return {
      totalArea,
      avgPricePerUnit: totalPrice / selectedUnits.length,
      avgPricePerSqft: totalPrice / totalArea,
      luxuryUnitsCount,
      luxuryUnitsPercent: (luxuryUnitsCount / selectedUnits.length) * 100,
      selectionProgress: (selectedUnits.length / selectedProject.total_units) * 100
    };
  }, [selectedUnits, selectedProject]);

  if (!analysis) return null;

  return (
    <Card title="Selection Analysis" size="small">
      <div className="grid grid-cols-2 gap-y-4 text-sm">
        <div>
          <Text type="secondary">Total Area</Text>
          <div className="font-bold text-base">{analysis.totalArea.toLocaleString()} sqft</div>
        </div>
        <div>
          <Text type="secondary">Average Price/Unit</Text>
          <div className="font-bold text-base">AED {Math.round(analysis.avgPricePerUnit).toLocaleString()}</div>
        </div>
        <div>
          <Text type="secondary">Average Price/sqft</Text>
          <div className="font-bold text-base">AED {Math.round(analysis.avgPricePerSqft).toLocaleString()}</div>
        </div>
        <div>
          <Text type="secondary">Luxury Units</Text>
          <div className="font-bold text-base">{analysis.luxuryUnitsCount} ({analysis.luxuryUnitsPercent.toFixed(1)}%)</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
            <Text strong>Project Selection Progress</Text>
            <Text type="secondary">{selectedUnits.length} / {selectedProject.total_units} units</Text>
        </div>
        <Progress percent={parseFloat(analysis.selectionProgress.toFixed(2))} size="small" />
      </div>
    </Card>
  );
}