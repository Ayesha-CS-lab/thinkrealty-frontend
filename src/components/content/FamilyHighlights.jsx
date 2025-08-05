// src/components/content/FamilyHighlights.jsx

import { Card, Row, Col, Typography, Statistic, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { HomeOutlined, SmileOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export default function FamilyHighlights() {
    // Select relevant data from the Redux store
    const { avgBedrooms, projectAmenities } = useSelector(state => {
        const { selectedUnits, selectedProject } = state.landingPage;
        
        if (selectedUnits.length === 0) {
            return { avgBedrooms: 0, projectAmenities: [] };
        }
        
        const totalBedrooms = selectedUnits.reduce((sum, u) => sum + u.bedrooms, 0);
        
        return {
            avgBedrooms: (totalBedrooms / selectedUnits.length).toFixed(1),
            projectAmenities: selectedProject?.amenities || []
        };
    });

    // Filter for amenities typically relevant to families
    const familyFriendlyAmenities = projectAmenities.filter(amenity => 
        ['Kids Play Area', 'Swimming Pool', 'Security', 'Parking'].includes(amenity)
    );

    return (
        <Card title="Family Focus" bordered={false} className="bg-green-50 border border-green-200">
            <Paragraph>
                This selection of units is well-suited for family living, offering spacious layouts and access to essential family-oriented amenities.
            </Paragraph>
            <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                     <Statistic 
                        title="Average Bedrooms per Unit" 
                        value={avgBedrooms} 
                        prefix={<HomeOutlined />} 
                        valueStyle={{ color: '#22c55e' }}
                     />
                </Col>
                <Col xs={24} md={12}>
                   <div className="space-y-2">
                        <div className="font-semibold text-gray-600">Project's Family Amenities:</div>
                         <div className='flex flex-wrap gap-2'>
                            {familyFriendlyAmenities.length > 0 ? (
                                familyFriendlyAmenities.map(amenity => (
                                    <Tag key={amenity} icon={<SmileOutlined />} color="success">{amenity}</Tag>
                                ))
                            ) : (
                                <Text type="secondary">No specific family amenities listed.</Text>
                            )}
                         </div>
                   </div>
                </Col>
            </Row>
        </Card>
    );
}