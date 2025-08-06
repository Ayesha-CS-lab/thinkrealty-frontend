import { useMemo } from "react";
import { Card, Typography, Divider } from "antd";
import { RiseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const BASE_PRICE_PERCENT = 0.95;
const FLOOR_PREMIUM_RATE = 500;
const BALCONY_PREMIUM_PERCENT = 0.08;
const PARKING_FEE = 15000;

// Calculate detailed price components for a single unit
const getPriceComponents = (unit) => {
  const basePrice = unit.price * BASE_PRICE_PERCENT;
  const floorPremium = unit.floor_level * FLOOR_PREMIUM_RATE;
  const balconyPremium = unit.has_balcony
    ? basePrice * BALCONY_PREMIUM_PERCENT
    : 0;
  const parkingFee = unit.has_parking ? PARKING_FEE : 0;

  const calculatedTotal =
    basePrice + floorPremium + balconyPremium + parkingFee;
  const adjustment = unit.price - calculatedTotal;

  return {
    basePrice: basePrice + adjustment,
    floorPremium,
    balconyPremium,
    parkingFee,
    total: unit.price,
  };
};

export default function PricingBreakdown({ selectedUnits }) {
  const totals = useMemo(() => {
    if (!selectedUnits || selectedUnits.length === 0) return null;

    return selectedUnits.reduce(
      (acc, unit) => {
        const components = getPriceComponents(unit);
        acc.basePrice += components.basePrice;
        acc.floorPremium += components.floorPremium;
        acc.balconyPremium += components.balconyPremium;
        acc.parkingFee += components.parkingFee;
        acc.total += components.total;
        return acc;
      },
      {
        basePrice: 0,
        floorPremium: 0,
        balconyPremium: 0,
        parkingFee: 0,
        total: 0,
      }
    );
  }, [selectedUnits]);

  if (!totals) return null;

  const formatCurrency = (amount) =>
    `AED ${Math.round(amount).toLocaleString()}`;
  const formatTinyCurrency = (amount) =>
    `+AED ${Math.round(amount).toLocaleString()}`;

  return (
    <Card title="Pricing Breakdown" size="small">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <Text type="secondary" className="text-xs">
            Total Investment
          </Text>
          <Title level={5} className="!mt-1 !mb-0 text-blue-600">
            {formatCurrency(totals.total)}
          </Title>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <Text type="secondary" className="text-xs">
            Units Selected
          </Text>
          <Title level={5} className="!mt-1 !mb-0 text-green-600">
            {selectedUnits.length}
          </Title>
        </div>
      </div>

      <Text strong>Calculation Steps</Text>
      <div className="space-y-3 mt-2">
        <div className="flex justify-between items-center text-sm">
          <Text type="secondary">Base price for all selected units</Text>
          <Text className="text-green-600 flex items-center gap-1">
            <RiseOutlined /> {formatTinyCurrency(totals.basePrice)}
          </Text>
        </div>
        <div className="flex justify-between items-center text-sm">
          <Text type="secondary">Floor level premiums</Text>
          <Text className="text-green-600 flex items-center gap-1">
            <RiseOutlined /> {formatTinyCurrency(totals.floorPremium)}
          </Text>
        </div>
        <div className="flex justify-between items-center text-sm">
          <Text type="secondary">Balcony premiums (+8%)</Text>
          <Text className="text-red-500">
            {formatCurrency(totals.balconyPremium)}
          </Text>
        </div>
        <div className="flex justify-between items-center text-sm">
          <Text type="secondary">Parking fees (AED 15,000 per unit)</Text>
          <Text className="text-red-500">
            {formatCurrency(totals.parkingFee)}
          </Text>
        </div>
      </div>

      <Divider className="my-3" />
      <div className="flex justify-between items-center">
        <Title level={5} className="!mb-0">
          Total Investment
        </Title>
        <Title level={4} className="!mb-0 text-blue-600">
          {formatCurrency(totals.total)}
        </Title>
      </div>
    </Card>
  );
}
