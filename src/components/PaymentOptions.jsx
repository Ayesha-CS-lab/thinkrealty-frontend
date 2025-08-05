import { Card, Typography, Button, Divider } from 'antd';
import { useSelector } from 'react-redux';
import { DollarOutlined, CreditCardOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function PaymentOptions() {
  // Get the FINAL calculated price from the Redux store. This is after all discounts and premiums.
  const finalPrice = useSelector(state => state.landingPage.pricingCalculations.finalPrice);
  
  // If no units are selected, the price will be 0, so we don't render the component.
  if (finalPrice === 0) {
    return null;
  }
  
  // These calculations are now based on the authoritative final price.
  const cashPrice = finalPrice * 0.95; // 5% discount for paying in full
  const installmentPrice = finalPrice / 24; 

  const formatCurrency = (amount, includeDecimals = false) => 
      `AED ${includeDecimals ? parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}) : Math.round(amount).toLocaleString()}`;
  
  return (
    <Card title="Final Payment Options" size="small">
      <div className="grid grid-cols-1 gap-4">
        {/* Cash Payment Option */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center transition-all hover:shadow-lg">
          <div className='flex items-center justify-center gap-2 mb-2'>
              <DollarOutlined className='text-green-600'/>
              <Title level={5} className='!m-0 text-green-700'>Cash Payment</Title>
          </div>
          <Text strong className="text-3xl text-green-600 block">{formatCurrency(cashPrice)}</Text>
          <Text type="secondary" className="text-xs mt-1 block">Includes 5% upfront payment discount</Text>
        </div>

        {/* Installment Plan Option */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center transition-all hover:shadow-lg">
           <div className='flex items-center justify-center gap-2 mb-2'>
              <CreditCardOutlined className='text-blue-600'/>
              <Title level={5} className='!m-0 text-blue-700'>Installment Plan</Title>
          </div>
          <Text strong className="text-3xl text-blue-600 block">{formatCurrency(installmentPrice)}</Text>
          <Text type="secondary" className="text-xs mt-1 block">per month, over 24 months (0% interest)</Text>
        </div>
      </div>
      
      <Divider />

      <Button type="primary" size="large" block icon={<ArrowRightOutlined />}>
        Proceed to Secure Payment
      </Button>
    </Card>
  );
}