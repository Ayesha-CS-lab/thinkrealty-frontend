"use client";

import { useMemo } from "react";
import {
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Row,
  Col,
  Empty,
  Statistic,
} from "antd";
import {
  EnvironmentOutlined,
  BuildOutlined,
  DollarOutlined,
  HomeOutlined,
  StarOutlined,
  EyeOutlined,
  RiseOutlined,
  SafetyOutlined,
  WifiOutlined,
  CoffeeOutlined,
  // SwimmingPoolOutlined,
  CarOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function ContentPreview({
  selectedProject,
  selectedUnits,
  areas,
  zones,
}) {
  const contentData = useMemo(() => {
    if (!selectedProject || !selectedUnits || selectedUnits.length === 0)
      return null;

    const area = areas.find((a) => a.area_id === selectedProject.area_id);
    const zone = zones.find((z) => z.zone_id === selectedProject.zone_id);

    const totalPrice = selectedUnits.reduce((sum, unit) => sum + unit.price, 0);
    const totalArea = selectedUnits.reduce(
      (sum, unit) => sum + unit.area_sqft,
      0
    );
    const averagePrice = totalPrice / selectedUnits.length;
    const averagePricePerSqft = totalPrice / totalArea;

    const bedroomDistribution = selectedUnits.reduce((acc, unit) => {
      const key = unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms} BR`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Determine focus type based on selection
    let focusType = "standard";
    const luxuryUnits = selectedUnits.filter(
      (unit) => unit.has_balcony && unit.has_parking && unit.bedrooms >= 3
    );
    const familyUnits = selectedUnits.filter((unit) => unit.bedrooms >= 2);

    if (luxuryUnits.length > selectedUnits.length * 0.5) {
      focusType = "luxury";
    } else if (familyUnits.length > selectedUnits.length * 0.7) {
      focusType = "family";
    } else if (selectedUnits.length > 1) {
      focusType = "investment";
    }

    return {
      area,
      zone,
      totalPrice,
      totalArea,
      averagePrice,
      averagePricePerSqft,
      bedroomDistribution,
      focusType,
    };
  }, [selectedProject, selectedUnits, areas, zones]);

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty
          description="Select a project to preview the landing page"
          image={
            <HomeOutlined style={{ fontSize: "64px", color: "#d9d9d9" }} />
          }
        />
      </div>
    );
  }

  if (!selectedUnits || selectedUnits.length === 0) {
    return (
      <Card
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined className="text-purple-500" />
            <span>Landing Page Preview</span>
          </div>
        }
        className="w-full"
      >
        <Empty
          image={
            <BuildOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />
          }
          description="Select units to preview landing page content"
        />
      </Card>
    );
  }

  const getHeroContent = () => {
    const baseTitle = selectedProject.project_name;
    const location = `${contentData.area?.area_name_en}, ${contentData.zone?.zone_name_en}`;

    switch (contentData.focusType) {
      case "investment":
        return {
          title: `Premium Investment Opportunity - ${baseTitle}`,
          subtitle: `High-yield rental returns in ${location}`,
          cta: "Calculate ROI",
          highlights: ["8-12% Expected ROI", "Prime Location", "Ready to Rent"],
        };
      case "family":
        return {
          title: `Your Dream Family Home - ${baseTitle}`,
          subtitle: `Spacious living with world-class amenities in ${location}`,
          cta: "Explore Family Features",
          highlights: [
            "Top Schools Nearby",
            "Family Amenities",
            "Safe Community",
          ],
        };
      case "luxury":
        return {
          title: `Exclusive Luxury Living - ${baseTitle}`,
          subtitle: `Unparalleled elegance and sophistication in ${location}`,
          cta: "Schedule Private Tour",
          highlights: [
            "Luxury Finishes",
            "Premium Services",
            "Exclusive Access",
          ],
        };
      default:
        return {
          title: `Discover ${baseTitle}`,
          subtitle: `Modern living in the heart of ${location}`,
          cta: "Learn More",
          highlights: ["Modern Design", "Prime Location", "Quality Living"],
        };
    }
  };

  const heroContent = getHeroContent();
  const formatCurrency = (amount) => `AED ${amount.toLocaleString()}`;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <EyeOutlined className="text-purple-500" />
          <span>Landing Page Preview</span>
        </div>
      }
      className="w-full"
    >
      <div className="space-y-6">
        {/* Hero Section Preview */}
        <div className="hero-section text-white p-8 rounded-lg">
          <div className="max-w-4xl">
            <Title level={1} className="text-white mb-4">
              {heroContent.title}
            </Title>

            <Paragraph className="text-xl text-white opacity-90 mb-6">
              {heroContent.subtitle}
            </Paragraph>

            <Space wrap className="mb-6">
              <Tag className="bg-white/20 text-white border-white/20 px-3 py-1">
                {selectedUnits.length} Units Selected
              </Tag>
              <Tag className="bg-white/20 text-white border-white/20 px-3 py-1">
                From{" "}
                {formatCurrency(Math.min(...selectedUnits.map((u) => u.price)))}
              </Tag>
              <Tag className="bg-white/20 text-white border-white/20 px-3 py-1">
                {contentData.totalArea.toLocaleString()} sqft Total
              </Tag>
              {contentData.focusType === "investment" && (
                <Tag className="bg-green-500 text-white border-green-500 px-3 py-1">
                  8-12% ROI Expected
                </Tag>
              )}
            </Space>

            <Space wrap className="mb-8">
              {heroContent.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full"
                >
                  <StarOutlined />
                  <span className="text-sm">{highlight}</span>
                </div>
              ))}
            </Space>

            <Space>
              <Button
                type="primary"
                size="large"
                className="bg-white text-blue-600 hover:bg-gray-100 border-white"
              >
                {heroContent.cta}
              </Button>
              <Button
                size="large"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                Download Brochure
              </Button>
            </Space>
          </div>
        </div>

        {/* Project Overview */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card title="Project Overview">
              <Space direction="vertical" className="w-full">
                <div className="flex items-center gap-2">
                  <EnvironmentOutlined className="text-blue-600" />
                  <Text strong>Location:</Text>
                  <Text>
                    {contentData.area?.area_name_en},{" "}
                    {contentData.zone?.zone_name_en}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <BuildOutlined className="text-blue-600" />
                  <Text strong>Developer:</Text>
                  <Text>{selectedProject.developer}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <HomeOutlined className="text-blue-600" />
                  <Text strong>Total Units:</Text>
                  <Text>{selectedProject.total_units}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text strong>Available Units:</Text>
                  <Tag color="green">
                    {selectedProject.available_units} Available
                  </Tag>
                </div>
                <div className="flex items-center gap-2">
                  <Text strong>Completion Status:</Text>
                  <Tag
                    color={
                      selectedProject.completion_status === "ready"
                        ? "green"
                        : "blue"
                    }
                  >
                    {selectedProject.completion_status.replace("_", " ")}
                  </Tag>
                </div>
              </Space>

              {/* Amenities */}
              <div className="mt-6">
                <Title level={4}>Premium Amenities</Title>
                <Row gutter={[16, 16]}>
                  {selectedProject.amenities.map((amenity, index) => (
                    <Col xs={24} sm={12} key={index}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <Text>{amenity}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="Investment Summary">
              <Space direction="vertical" className="w-full">
                <Statistic
                  title="Total Investment"
                  value={contentData.totalPrice}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: "#1890ff" }}
                />
                <Statistic
                  title="Total Area (sqft)"
                  value={contentData.totalArea}
                  formatter={(value) => value.toLocaleString()}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Statistic
                  title="Avg Price/sqft"
                  value={Math.round(contentData.averagePricePerSqft)}
                  formatter={(value) => `AED ${value.toLocaleString()}`}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Selected Units Summary */}
        <Card title="Your Selection">
          <Row gutter={[16, 16]}>
            {selectedUnits.map((unit) => (
              <Col xs={24} sm={12} md={8} key={unit.unit_id}>
                <Card size="small" className="border border-blue-200">
                  <Space direction="vertical" className="w-full">
                    <div className="flex items-center justify-between">
                      <Text strong>{unit.unit_number}</Text>
                      <Tag color="blue">{unit.property_type}</Tag>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <Text type="secondary">Bedrooms:</Text>
                        <Text>
                          {unit.bedrooms === 0 ? "Studio" : unit.bedrooms}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Area:</Text>
                        <Text>{unit.area_sqft} sqft</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Floor:</Text>
                        <Text>{unit.floor_level}</Text>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <DollarOutlined className="text-green-600" />
                        <Text strong className="text-green-600">
                          AED {unit.price.toLocaleString()}
                        </Text>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Features Section Preview */}
        <Card title="Features & Amenities">
          <Row gutter={[24, 24]}>
            {contentData.focusType === "investment" && (
              <>
                <Col xs={24} md={8}>
                  <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                    <RiseOutlined className="text-4xl text-green-600 mb-4" />
                    <Title level={5} className="mb-3">
                      High ROI Potential
                    </Title>
                    <Paragraph type="secondary" className="mb-3">
                      Average rental yields of 8-12% in prime Dubai locations
                    </Paragraph>
                    <div className="bg-green-50 p-3 rounded">
                      <Statistic
                        value={contentData.totalPrice * 0.1}
                        formatter={(value) => formatCurrency(value)}
                        valueStyle={{ color: "#52c41a", fontSize: "18px" }}
                        suffix={
                          <div className="text-xs text-green-700">
                            Expected Annual Return
                          </div>
                        }
                      />
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                    <HomeOutlined className="text-4xl text-blue-600 mb-4" />
                    <Title level={5} className="mb-3">
                      Ready to Rent
                    </Title>
                    <Paragraph type="secondary">
                      Fully furnished units ready for immediate rental income
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                    <EnvironmentOutlined className="text-4xl text-purple-600 mb-4" />
                    <Title level={5} className="mb-3">
                      Strategic Location
                    </Title>
                    <Paragraph type="secondary">
                      Walking distance to metro, malls, and business districts
                    </Paragraph>
                  </div>
                </Col>
              </>
            )}

            {contentData.focusType === "family" && (
              <>
                <Col xs={24} md={8}>
                  <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                    <BuildOutlined className="text-4xl text-green-600 mb-4" />
                    <Title level={5} className="mb-3">
                      Top Schools Nearby
                    </Title>
                    <Paragraph type="secondary">
                      Access to premium international schools within 10 minutes
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                    {/* <SwimmingPoolOutlined className="text-4xl text-blue-600 mb-4" /> */}
                    <Title level={5} className="mb-3">
                      Family Pool & Beach
                    </Title>
                    <Paragraph type="secondary">
                      Kids pool, adult pool, and private beach access
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                    <HomeOutlined className="text-4xl text-purple-600 mb-4" />
                    <Title level={5} className="mb-3">
                      Spacious Layouts
                    </Title>
                    <Paragraph type="secondary">
                      2-4 bedroom units with large living areas and balconies
                    </Paragraph>
                  </div>
                </Col>
              </>
            )}

            {contentData.focusType === "luxury" && (
              <>
                <Col xs={24} md={8}>
                  <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                    <StarOutlined className="text-4xl text-green-600 mb-4" />
                    <Title level={5} className="mb-3">
                      Private Gym & Spa
                    </Title>
                    <Paragraph type="secondary">
                      State-of-the-art fitness center with personal trainers
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                    <CarOutlined className="text-4xl text-blue-600 mb-4" />
                    <Title level={5} className="mb-3">
                      Valet Parking
                    </Title>
                    <Paragraph type="secondary">
                      24/7 valet service with covered parking spaces
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                    <BuildOutlined className="text-4xl text-purple-600 mb-4" />
                    <Title level={5} className="mb-3">
                      Concierge Service
                    </Title>
                    <Paragraph type="secondary">
                      Personal concierge for all your lifestyle needs
                    </Paragraph>
                  </div>
                </Col>
              </>
            )}

            {/* Standard amenities for all focus types */}
            <Col xs={24} md={8}>
              <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                <SafetyOutlined className="text-4xl text-red-600 mb-4" />
                <Title level={5} className="mb-3">
                  24/7 Security
                </Title>
                <Paragraph type="secondary">
                  Round-the-clock security with CCTV monitoring
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                <WifiOutlined className="text-4xl text-indigo-600 mb-4" />
                <Title level={5} className="mb-3">
                  High-Speed Internet
                </Title>
                <Paragraph type="secondary">
                  Fiber optic internet connectivity throughout
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center p-6 border rounded hover:shadow-md transition-shadow feature-card">
                <CoffeeOutlined className="text-4xl text-amber-600 mb-4" />
                <Title level={5} className="mb-3">
                  Retail & Dining
                </Title>
                <Paragraph type="secondary">
                  On-site cafes, restaurants, and retail outlets
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Selection Summary */}
        <Card title="Your Selection Summary">
          <div className="bg-gray-50 p-6 rounded">
            <div className="text-center mb-6">
              <Title level={3} className="mb-2">
                {selectedUnits.length} Premium Units Selected
              </Title>
              <Paragraph type="secondary">
                in {selectedProject.project_name},{" "}
                {contentData.area?.area_name_en}
              </Paragraph>
            </div>

            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} md={8}>
                <div className="text-center p-4 bg-white rounded">
                  <Statistic
                    title="Total Investment"
                    value={contentData.totalPrice}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center p-4 bg-white rounded">
                  <Statistic
                    title="Total Area (sqft)"
                    value={contentData.totalArea}
                    formatter={(value) => value.toLocaleString()}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center p-4 bg-white rounded">
                  <Statistic
                    title="Avg Price/sqft"
                    value={Math.round(contentData.averagePricePerSqft)}
                    formatter={(value) => `AED ${value.toLocaleString()}`}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </div>
              </Col>
            </Row>

            {/* Bedroom Distribution */}
            <div className="mb-6">
              <Title level={5} className="mb-3">
                Unit Distribution
              </Title>
              <Space wrap>
                {Object.entries(contentData.bedroomDistribution).map(
                  ([bedrooms, count]) => (
                    <Tag key={bedrooms} className="px-3 py-1">
                      {bedrooms}: {count} units
                    </Tag>
                  )
                )}
              </Space>
            </div>

            {contentData.focusType === "investment" && (
              <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                <Title level={5} className="text-green-800 mb-2">
                  Investment Analysis
                </Title>
                <Row gutter={[16, 16]} className="text-sm">
                  <Col span={12}>
                    <div>
                      <Text type="secondary">Expected Annual Rental:</Text>
                      <div className="font-semibold">
                        {formatCurrency(contentData.totalPrice * 0.08)}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text type="secondary">ROI (8% yield):</Text>
                      <div className="font-semibold">8.0%</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text type="secondary">Break-even Period:</Text>
                      <div className="font-semibold">12.5 years</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text type="secondary">Capital Appreciation:</Text>
                      <div className="font-semibold">5-7% annually</div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            <div className="text-center">
              <Space>
                <Button type="primary" size="large">
                  Schedule Viewing
                </Button>
                <Button size="large">Request Callback</Button>
              </Space>
            </div>
          </div>
        </Card>

        {/* Call-to-Action Section Preview */}
        <Card className="text-center hero-section text-white">
          <Title level={2} className="text-white mb-4">
            {contentData.focusType === "investment"
              ? "Start Your Investment Journey Today"
              : contentData.focusType === "family"
              ? "Find Your Perfect Family Home"
              : contentData.focusType === "luxury"
              ? "Experience Luxury Living"
              : "Make This Your New Home"}
          </Title>

          <Paragraph className="text-xl text-white opacity-90 mb-6">
            {contentData.focusType === "investment"
              ? "Secure your high-yield investment with flexible payment plans and guaranteed returns"
              : contentData.focusType === "family"
              ? "Move into your dream home with our family-friendly payment options and amenities"
              : contentData.focusType === "luxury"
              ? "Exclusive units available with VIP payment terms and premium services"
              : "Discover modern living in Dubai's most sought-after location"}
          </Paragraph>

          <Space wrap className="mb-6">
            <div className="bg-white/10 px-4 py-2 rounded-full">
              <span className="text-sm">✓ Flexible Payment Plans</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-full">
              <span className="text-sm">✓ No Hidden Fees</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-full">
              <span className="text-sm">✓ Ready to Move</span>
            </div>
            {contentData.focusType === "investment" && (
              <div className="bg-white/10 px-4 py-2 rounded-full">
                <span className="text-sm">✓ Guaranteed ROI</span>
              </div>
            )}
          </Space>

          <Space wrap>
            <Button
              type="primary"
              size="large"
              className="bg-white text-blue-600 hover:bg-gray-100 border-white"
            >
              Contact Sales Team
            </Button>
            <Button
              size="large"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              Download Brochure
            </Button>
            <Button
              size="large"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              Virtual Tour
            </Button>
          </Space>

          <div className="mt-6 text-sm opacity-75">
            <Text className="text-white">
              Limited time offer • {selectedProject.available_units} units
              remaining
            </Text>
          </div>
        </Card>

        {/* Contact Information */}
        <Card title="Contact Information">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div>
                <Title level={5} className="mb-3">
                  Sales Office
                </Title>
                <div className="space-y-2 text-sm">
                  <p>📍 {contentData.area?.area_name_en}, Dubai, UAE</p>
                  <p>📞 +971 4 XXX XXXX</p>
                  <p>✉️ sales@thinkrealty.ae</p>
                  <p>🕒 Open 7 days a week, 9 AM - 9 PM</p>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div>
                <Title level={5} className="mb-3">
                  Project Information
                </Title>
                <div className="space-y-2 text-sm">
                  <p>🏗️ Developer: {selectedProject.developer}</p>
                  <p>
                    📅 Completion:{" "}
                    {selectedProject.completion_status === "ready"
                      ? "Ready"
                      : "2025-2026"}
                  </p>
                  <p>🏢 Total Units: {selectedProject.total_units}</p>
                  <p>🎯 Handover: Q4 2025</p>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </Card>
  );
}
