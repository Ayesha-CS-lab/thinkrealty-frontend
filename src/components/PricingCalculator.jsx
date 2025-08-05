import { useSelector } from "react-redux";
import { Card, Typography, Divider, Tooltip } from "antd";
import { DollarOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PricingCalculator() {
  // Read the pre-calculated pricing object from the Redux store
  const { breakdown } = useSelector((state) => state.landingPage.pricingCalculations);

  if (!breakdown || breakdown.length === 0) {
    return (
      <Card title="Pricing Calculator">
        <Text type="secondary">Select units to see a detailed price breakdown.</Text>
      </Card>
    );
  }

  const formatCurrency = (amount) => `AED ${Math.round(amount).toLocaleString()}`;
  
  return (
    <Card title={<><DollarOutlined /> Pricing Calculator</>}>
        <div className="space-y-2">
            {breakdown.map((item, index) => {
                if (item.inactive) return null; 
                return (
                    <div key={index} className={`flex justify-between items-center ${item.isBold ? 'font-semibold' : ''}`}>
                        <Text type={item.isTotal ? 'default' : 'secondary'}>{item.label}</Text>
                        <Text 
                            strong={item.isBold}
                            className={item.isDiscount ? 'text-green-600' : item.isFuture ? 'text-blue-500' : ''}
                        >
                            {formatCurrency(item.value)}
                            {item.isFuture && <Tooltip title="Estimated value based on market appreciation"><InfoCircleOutlined className="ml-2"/></Tooltip>}
                        </Text>
                    </div>
                );
            })}
        </div>
    </Card>
  );
}

