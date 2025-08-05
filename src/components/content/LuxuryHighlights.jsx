// src/components/content/LuxuryHighlights.jsx

import { Card, Row, Col, Typography, Statistic, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { StarOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export default function LuxuryHighlights() {
    // Select relevant data from the Redux store
    const { avgPricePerSqft, hasBalcony, hasParking } = useSelector(state => {
        const { selectedUnits } = state.landingPage;

        if (selectedUnits.length === 0) {
            return { avgPricePerSqft: 0, hasBalcony: false, hasParking: false };
        }

        const totalPrice = selectedUnits.reduce((sum, u) => sum + u.price, 0);
        const totalArea = selectedUnits.reduce((sum, u) => sum + u.area_sqft, 0);
        
        return {
            avgPricePerSqft: totalArea > 0 ? totalPrice / totalArea : 0,
            hasBalcony: selectedUnits.some(u => u.has_balcony),
            hasParking: selectedUnits.some(u => u.has_parking),
        }
    });

    const formatCurrency = (amount) => `${Math.round(amount).toLocaleString()}`;

    return (
        <Card title="Luxury Focus" bordered={false} className="bg-purple-50 border border-purple-200">
            <Paragraph>
                This portfolio has been identified as a luxury collection, characterized by high value, premium features, and exclusive lifestyle amenities.
            </Paragraph>
            <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                    <Statistic 
                        title="Average Value (Price per sqft)" 
                        value={avgPricePerSqft} 
                        prefix="AED" 
                        valueStyle={{ color: '#5b21b6' }} 
                        formatter={formatCurrency}
                    />
                </Col>
                <Col xs={24} md={12}>
                    <div className="space-y-2">
                        <div className="font-semibold text-gray-600">Key Luxury Indicators:</div>
                        <div className='flex flex-wrap gap-2'>
                           <Tag icon={<StarOutlined />} color="purple">Premium Finishes</Tag>
                           <Tag icon={<StarOutlined />} color="purple">Prime Views</Tag>
                           {hasBalcony && <Tag icon={<StarOutlined />} color="purple">Spacious Balconies</Tag>}
                           {hasParking && <Tag icon={<StarOutlined />} color="purple">Dedicated Parking</Tag>}
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}