"use client";

import { useState, useMemo } from "react";
import {
  Card,
  Checkbox,
  Tag,
  Button,
  Input,
  Select,
  Row,
  Col,
  Space,
  Empty,
  Typography,
} from "antd";
import {
  HomeOutlined,
  ExpandOutlined,
  BuildOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  SearchOutlined,
  CarOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

export default function UnitMultiSelect({
  units,
  selectedUnits,
  onUnitToggle,
}) {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterBedrooms, setFilterBedrooms] = useState("all");
  const [sortBy, setSortBy] = useState("price");

  // Filter and sort units
  const filteredAndSortedUnits = useMemo(() => {
    if (!units) return [];

    const filtered = units.filter((unit) => {
      const matchesSearch = unit.unit_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" || unit.property_type === filterType;
      const matchesBedrooms =
        filterBedrooms === "all" || unit.bedrooms.toString() === filterBedrooms;

      return matchesSearch && matchesType && matchesBedrooms;
    });

    // Sort units
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "area":
          return a.area_sqft - b.area_sqft;
        case "floor":
          return a.floor_level - b.floor_level;
        default:
          return 0;
      }
    });

    return filtered;
  }, [units, searchTerm, filterType, filterBedrooms, sortBy]);

  const isSelected = (unitId) => {
    return selectedUnits.some((u) => u.unit_id === unitId);
  };

  const getStatusColor = (unit) => {
    if (unit.status !== "available") return "red";
    return "green";
  };

  const getPropertyTypeIcon = (type) => {
    switch (type) {
      case "villa":
        return <HomeOutlined />;
      case "apartment":
        return <BuildOutlined />;
      case "townhouse":
        return <HomeOutlined />;
      case "studio":
        return <ExpandOutlined />;
      default:
        return <HomeOutlined />;
    }
  };

  if (!units || units.length === 0) {
    return (
      <Card title="Unit Selection">
        <Empty description="No units available for this project" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>Unit Selection</span>
            <Space>
              <Button
                icon={
                  viewMode === "grid" ? <BarsOutlined /> : <AppstoreOutlined />
                }
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              />
              <Tag>{selectedUnits.length} selected</Tag>
            </Space>
          </div>
        }
        size="small"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search units..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Property Type"
              className="w-full"
              value={filterType}
              onChange={setFilterType}
            >
              <Option value="all">All Types</Option>
              <Option value="studio">Studio</Option>
              <Option value="apartment">Apartment</Option>
              <Option value="villa">Villa</Option>
              <Option value="townhouse">Townhouse</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Bedrooms"
              className="w-full"
              value={filterBedrooms}
              onChange={setFilterBedrooms}
            >
              <Option value="all">All Bedrooms</Option>
              <Option value="0">Studio</Option>
              <Option value="1">1 BR</Option>
              <Option value="2">2 BR</Option>
              <Option value="3">3 BR</Option>
              <Option value="4">4+ BR</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Sort By"
              className="w-full"
              value={sortBy}
              onChange={setSortBy}
            >
              <Option value="price">Price</Option>
              <Option value="area">Area</Option>
              <Option value="floor">Floor Level</Option>
            </Select>
          </Col>
        </Row>
        <div className="mt-4">
          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setFilterBedrooms("all");
              setSortBy("price");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Units Display */}
      <Card title="Available Units">
        <Row gutter={[16, 16]}>
          {filteredAndSortedUnits.map((unit) => (
            <Col
              xs={24}
              sm={viewMode === "grid" ? 12 : 24}
              md={viewMode === "grid" ? 8 : 24}
              lg={viewMode === "grid" ? 24 : 24}
              key={unit.unit_id}
            >
              <div
                className={`border rounded-lg p-4 transition-all cursor-pointer unit-card ${
                  isSelected(unit.unit_id)
                    ? "border-blue-500 bg-blue-50"
                    : unit.status !== "available"
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  unit.status === "available" && onUnitToggle(unit)
                }
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Space>
                      {getPropertyTypeIcon(unit.property_type)}
                      <Text strong>{unit.unit_number}</Text>
                    </Space>
                    <Space>
                      {unit.status === "available" && (
                        <Checkbox
                          checked={isSelected(unit.unit_id)}
                          disabled={unit.status !== "available"}
                        />
                      )}
                    </Space>
                  </div>

                  <div className="flex items-center justify-between">
                    <Tag color={getStatusColor(unit)}>
                      {unit.status === "available" ? "Available" : "Sold"}
                    </Tag>
                    <Text type="secondary" className="text-sm">
                      Floor {unit.floor_level}
                    </Text>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Bedrooms:</span>
                      <span>
                        {unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms} BR`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Area:</span>
                      <span>{unit.area_sqft} sqft</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Type:</span>
                      <span className="capitalize">{unit.property_type}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {unit.has_balcony && (
                        <Tag color="green" size="small">
                          Balcony
                        </Tag>
                      )}
                      {unit.has_parking && (
                        <Tag color="blue" size="small" icon={<CarOutlined />}>
                          Parking
                        </Tag>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-lg font-bold text-blue-600">
                      AED {unit.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      AED{" "}
                      {Math.round(unit.price / unit.area_sqft).toLocaleString()}
                      /sqft
                    </div>
                  </div>

                  {unit.phase && (
                    <div className="text-xs text-gray-500">
                      Phase: {unit.phase}
                    </div>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {filteredAndSortedUnits.length === 0 && (
          <Empty
            image={
              <BuildOutlined
                style={{ fontSize: "48px", color: "#d9d9d9" }}
              />
            }
            description="No units found matching your criteria"
          >
            <Button
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
                setFilterBedrooms("all");
              }}
            >
              Clear Filters
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
}
