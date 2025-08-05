import { Card, Tag, Typography } from 'antd';
import { useSelector } from 'react-redux';
const { Text } = Typography;

const getPriceComponents = (unit) => {
    const BASE_PRICE_PERCENT = 0.95;
    const FLOOR_PREMIUM_RATE = 500;
    const BALCONY_PREMIUM_PERCENT = 0.08;
    const PARKING_FEE = 15000;
    const basePrice = unit.price * BASE_PRICE_PERCENT;
    const floorPremium = unit.floor_level * FLOOR_PREMIUM_RATE;
    const balconyPremium = unit.has_balcony ? basePrice * BALCONY_PREMIUM_PERCENT : 0;
    const parkingFee = unit.has_parking ? PARKING_FEE : 0;
    const calculatedTotal = basePrice + floorPremium + balconyPremium + parkingFee;
    const adjustment = unit.price - calculatedTotal;
    
    return {
        basePrice: basePrice + adjustment,
        floorPremium,
        balconyPremium,
        parkingFee,
    };
}

export default function UnitBreakdown() {
   const selectedUnits = useSelector(state => state.landingPage.selectedUnits);

  if (!selectedUnits || selectedUnits.length === 0) return null;

  const formatTinyCurrency = (amount) => `+AED ${Math.round(amount).toLocaleString()}`;

  return (
    <Card title="Unit-by-Unit Breakdown" size="small">
      <div className="space-y-3">
        {selectedUnits.map(unit => {
          const components = getPriceComponents(unit);
          return (
            <div key={unit.unit_id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Text strong className="mr-2">{unit.unit_number}</Text>
                  <Tag>{unit.property_type}</Tag>
                  <Tag color="blue">{unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms} BR`}</Tag>
                </div>
                <Text strong className="text-blue-600">AED {unit.price.toLocaleString()}</Text>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <Text type="secondary">Base Price</Text>
                  <div className="font-semibold">AED {Math.round(components.basePrice).toLocaleString()}</div>
                </div>
                <div>
                  <Text type="secondary">Floor Adj.</Text>
                  <div className="font-semibold text-green-600">{formatTinyCurrency(components.floorPremium)}</div>
                </div>
                 <div>
                  <Text type="secondary">Balcony</Text>
                  <div className="font-semibold text-green-600">{formatTinyCurrency(components.balconyPremium)}</div>
                </div>
                 <div>
                  <Text type="secondary">Parking</Text>
                  <div className="font-semibold text-green-600">{formatTinyCurrency(components.parkingFee)}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}