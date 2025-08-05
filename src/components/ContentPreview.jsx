
import { useSelector } from "react-redux";
import { Card, Typography, Space, Tag, Button, Row, Col, Empty, Statistic, Divider, Image as AntImage } from "antd";
import {
  EnvironmentOutlined,
  BuildOutlined,
  HomeOutlined,
  StarOutlined,
  EyeOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Home, Landmark, ShieldCheck, TrendingUp, BedDouble, Bath, Car, Trees, Utensils, Dumbbell, Star, Mail, Phone, Clock, Building } from 'lucide-react'; // Lucide icons for a modern feel

import InvestmentHighlights from "./content/InvestmentHighlights";
import FamilyHighlights from "./content/FamilyHighlights";
import LuxuryHighlights from "./content/LuxuryHighlights";

const { Title, Paragraph, Text } = Typography;

// Helper function remains the same
const getHandoverQuarter = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    const month = date.getMonth();
    const year = date.getFullYear();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${year}`;
};
const InfoCard = ({ icon, title, value, subValue = null }) => (
    <Card className="text-center h-full border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex justify-center mb-3 text-purple-600">{icon}</div>
        <Title level={5} className="!mb-1">{title}</Title>
        <Text strong className="text-lg">{value}</Text>
        {subValue && <Text type="secondary" className="block text-xs">{subValue}</Text>}
    </Card>
);

const DUMMY_IMAGE_URL = "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
// The component now takes NO props. All data comes from Redux.
export default function ContentPreview() {
    
    // --- FINAL CORRECTED useSelector ---
    const {
        selectedProject,
        selectedUnits,
        contentPersonalization,
        dynamicData,
        
    } = useSelector(state => {
        const { landingPage } = state;
        const { selectedProject, selectedUnits, allAreas, allZones } = landingPage;

        // Default empty state to prevent errors
        let calculatedData = {
            area: null,
            zone: null,
            totalArea: 0,
            averagePricePerSqft: 0,
            bedroomDistribution: {},
            dynamicHighlights: []
        };
        
        // --- THIS IS THE FIX ---
        // We now check that `allAreas` and `allZones` themselves are truthy
        // before we try to access any of their properties like `.length`.
        if (selectedProject && selectedUnits.length > 0 && allAreas && allAreas.length > 0 && allZones && allZones.length > 0) {
            const totalPrice = selectedUnits.reduce((sum, u) => sum + u.price, 0);
            const totalArea = selectedUnits.reduce((sum, u) => sum + u.area_sqft, 0);

            calculatedData = {
                area: allAreas.find(a => a.area_id === selectedProject.area_id),
                zone: allZones.find(z => z.zone_id === selectedProject.zone_id),
                totalArea: totalArea,
                averagePricePerSqft: totalArea > 0 ? totalPrice / totalArea : 0,
                bedroomDistribution: selectedUnits.reduce((acc, u) => {
                    const key = u.bedrooms === 0 ? "Studio" : `${u.bedrooms} BR`;
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {}),
                dynamicHighlights: [
                    "8-12% Expected ROI",
                    "Prime Location",
                    selectedProject.completion_status === "ready" ? "Ready to Rent" : "High Appreciation Potential"
                ]
            };
        }

        return {
            selectedProject: landingPage.selectedProject,
            selectedUnits: landingPage.selectedUnits,
            contentPersonalization: landingPage.contentPersonalization,
            dynamicData: calculatedData,
        };
    });


  // --- Conditional Rendering for Initial State (remains the same) ---
  if (!selectedProject) {
        return <div className="p-8"><Empty description="Loading or no project selected..." /></div>;
    }
    if (selectedUnits.length === 0) {
        return <div className="p-8"><Card><Empty description={`Select units from ${selectedProject.project_name} to generate content.`} /></Card></div>;
    }
  const formatCurrency = (amount) => `AED ${Math.round(amount).toLocaleString()}`;
  
  // --- Dynamic Content Component Renderer (remains the same) ---
  const renderFocusSection = () => {
    switch (contentPersonalization.focusType) {
        case 'investment': return <InvestmentHighlights />;
        case 'family': return <FamilyHighlights />;
        case 'luxury': return <LuxuryHighlights />;
        default: return null;
    }
  };

// if (!canRenderContent) {
//         return <div className="p-8"><Empty description="Loading project details..." /></div>
//     }

 return (
        <div className="space-y-8 bg-white p-2 rounded-lg">
            
            {/* --- NEW HERO SECTION --- */}
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                <AntImage
                    src={DUMMY_IMAGE_URL} // Uses the safe variable
                    alt={selectedProject.project_name}
                    className="w-full h-full object-cover"
                    preview={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    <Title level={1} className="!text-white">{selectedProject.project_name}</Title>
                    <Paragraph className="text-white/90 text-lg max-w-2xl">
                       A premium investment portfolio of {selectedUnits.length} units located in the heart of {dynamicData.area?.area_name_en}.
                    </Paragraph>
                    <Button type="primary" size="large" className="mt-4">Download Investment Prospectus</Button>
                </div>
            </div>

            {/* --- NEW PROJECT INFORMATION CARDS --- */}
            <div>
                <Title level={3} className="mb-4">Project Information</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}><InfoCard icon={<Landmark size={32} />} title="Prime Location" value={dynamicData.area?.area_name_en} subValue={dynamicData.zone?.zone_name_en}/></Col>
                    <Col xs={24} sm={12} md={6}><InfoCard icon={<ShieldCheck size={32} />} title="Project Status" value={<Tag color="blue" className="capitalize">{selectedProject.completion_status.replace('_', ' ')}</Tag>} /></Col>
                    <Col xs={24} sm={12} md={6}><InfoCard icon={<Home size={32} />} title="Availability" value={`${dynamicData.projectUnitsAvailable} / ${selectedProject.total_units}`} subValue="Units Available" /></Col>
                    <Col xs={24} sm={12} md={6}><InfoCard icon={<TrendingUp size={32} />} title="Price Range" value={formatCurrency(selectedProject.min_price)} subValue={`to ${formatCurrency(selectedProject.max_price)}`} /></Col>
                </Row>
            </div>

            {renderFocusSection()}

            {/* --- NEW IMAGE GALLERY SECTION --- */}
            {/* <div>
                 <Title level={3} className="mb-4">Property Gallery</Title>
                 <AntImage.PreviewGroup>
                    <Row gutter={[16, 16]}>
                        {selectedProject.imageUrls.map((url, index) => (
                           <Col key={index} xs={12} sm={8} md={6}>
                              <AntImage src={url} alt={`Gallery image ${index + 1}`} className="rounded-lg object-cover w-full h-40 shadow-sm" />
                           </Col>
                        ))}
                    </Row>
                 </AntImage.PreviewGroup>
            </div> */}
            
            {/* --- NEW FEATURES & AMENITIES --- */}
            <div>
                 <Title level={3} className="mb-4">Features & Amenities</Title>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {selectedProject.amenities.map(amenity => (
                        <Card key={amenity} size="small" className="border-gray-200">
                           <div className="flex items-center gap-3"><Star size={16} className="text-purple-600"/><span>{amenity}</span></div>
                        </Card>
                     ))}
                 </div>
            </div>

            {/* --- NEW CTA SECTION --- */}
            <div className="p-8 md:p-12 text-center text-white rounded-lg" style={{background: 'linear-gradient(135deg, #10b981, #2563eb)'}}>
                <Title level={2} className="!text-white">Secure your high-yield investment today</Title>
                <Paragraph className="text-white/80 max-w-3xl mx-auto">
                    With flexible payment plans and guaranteed returns, this is a prime opportunity to grow your wealth through Dubai real estate. Our advisors are standing by.
                </Paragraph>
                <Space wrap justify="center" className="mt-6">
                    <Button type="primary" size="large" ghost className="!bg-white !text-blue-600">Contact Sales Team</Button>
                    <Button size="large">Download Brochure</Button>
                </Space>
            </div>
            
            {/* --- NEW CONTACT INFORMATION --- */}
            <div>
                 <Title level={3} className="mb-4">Contact Information</Title>
                 <Card>
                    <Row gutter={[32, 24]}>
                        <Col xs={24} md={12}>
                            <Title level={5} className="mb-4">Sales Office</Title>
                            <Space direction="vertical" size="middle" className="w-full">
                                <div className="flex items-center gap-3"><Landmark size={20} className="text-gray-500"/><Text>Dubai Marina, Dubai, UAE</Text></div>
                                <div className="flex items-center gap-3"><Phone size={20} className="text-gray-500"/><Text>+971 4 XXX XXXX</Text></div>
                                <div className="flex items-center gap-3"><Mail size={20} className="text-gray-500"/><Text>sales@thinkrealty.ae</Text></div>
                                <div className="flex items-center gap-3"><Clock size={20} className="text-gray-500"/><Text>Open 7 days a week, 9 AM - 9 PM</Text></div>
                            </Space>
                        </Col>
                        <Col xs={24} md={12}>
                             <Title level={5} className="mb-4">Project Details</Title>
                             <Space direction="vertical" size="middle" className="w-full">
                                <div className="flex items-center gap-3"><Building size={20} className="text-gray-500"/><Text>Developer: {selectedProject.developer}</Text></div>
                                <div className="flex items-center gap-3"><Clock size={20} className="text-gray-500"/><Text>Completion: {new Date(selectedProject.completion_date).getFullYear()}</Text></div>
                                <div className="flex items-center gap-3"><Home size={20} className="text-gray-500"/><Text>Total Units: {selectedProject.total_units}</Text></div>
                                <div className="flex items-center gap-3"><TrendingUp size={20} className="text-gray-500"/><Text>Handover: {getHandoverQuarter(selectedProject.completion_date)}</Text></div>
                             </Space>
                        </Col>
                    </Row>
                 </Card>
            </div>

        </div>
    );
}