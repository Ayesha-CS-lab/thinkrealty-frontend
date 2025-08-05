// src/components/content/InvestmentHighlights.jsx
import { Card, Statistic, Row, Col, Typography } from 'antd';
import { RiseOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

export default function InvestmentHighlights() {
    const { totalPrice } = useSelector(state => state.landingPage.contentData); // Assumes you create this selector
    const annualRental = totalPrice * 0.08; // 8% yield assumption
    
    return (
        <Card title="Investment Focus" bordered={false} className="bg-blue-50">
            <Typography.Paragraph>This selection is optimized for high rental yields and capital appreciation, ideal for investors.</Typography.Paragraph>
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic title="Projected Annual Rent" value={annualRental} prefix="AED" valueStyle={{ color: '#3f8600' }} formatter={(val) => val.toLocaleString()} />
                </Col>
                <Col span={12}>
                    <Statistic title="Expected Net Yield" value="8 - 12%" prefix={<RiseOutlined />} valueStyle={{ color: '#3f8600' }} />
                </Col>
            </Row>
        </Card>
    );
}