// src/components/content/InvestmentHighlights.jsx

import { Card, Statistic, Row, Col, Typography } from 'antd';
import { RiseOutlined } from '@ant-design/icons'; // DollarCircleOutlined is not in the library, removed.
import { useSelector } from 'react-redux';

export default function InvestmentHighlights() {
    // --- THIS IS THE FIX ---
    // We now select `finalPrice` directly from the `pricingCalculations` object.
    // The `?.` (optional chaining) and `|| 0` make this safe, ensuring we always have a number.
    const totalPrice = useSelector(state => state.landingPage.pricingCalculations?.finalPrice || 0); 
    
    // This calculation is now based on the correct, final price from the pricing engine.
    const annualRental = totalPrice * 0.08; // 8% yield assumption
    
    // If there is no price, don't render an empty card.
    if (totalPrice === 0) {
        return null;
    }
    
    return (
        <Card title="Investment Focus" bordered={false} className="bg-blue-50 border border-blue-200">
            <Typography.Paragraph>
                This portfolio is optimized for high rental yields and capital appreciation, making it an ideal selection for investors.
            </Typography.Paragraph>
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic 
                        title="Projected Annual Rent" 
                        value={annualRental} 
                        prefix="AED" 
                        valueStyle={{ color: '#3f8600' }} 
                        formatter={(val) => Math.round(val).toLocaleString()} 
                    />
                </Col>
                <Col span={12}>
                    <Statistic 
                        title="Expected Net Yield" 
                        value="8 - 12%" 
                        prefix={<RiseOutlined />} 
                        valueStyle={{ color: '#3f8600' }} 
                    />
                </Col>
            </Row>
        </Card>
    );
}