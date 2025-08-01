"use client";

import { useState, useEffect } from "react";
import { Card, Select, Typography, Tag, Row, Col, Empty, Button } from "antd";
import {
  BuildOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  RiseOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export default function ProjectSelector({
  projects,
  zones,
  areas,
  selectedProject,
  onProjectSelect,
}) {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    let filtered = projects;

    if (selectedAreaId) {
      filtered = filtered.filter((p) => p.area_id === selectedAreaId);
    }

    if (selectedZoneId) {
      filtered = filtered.filter((p) => p.zone_id === selectedZoneId);
    }

    setFilteredProjects(filtered);
  }, [selectedAreaId, selectedZoneId, projects]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ready":
        return "green";
      case "under_construction":
        return "orange";
      case "off_plan":
        return "blue";
      default:
        return "default";
    }
  };

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage < 20) return "red";
    if (percentage < 50) return "orange";
    return "green";
  };

  const filteredZones = selectedAreaId
    ? zones.filter((z) => z.area_id === selectedAreaId)
    : zones;

  return (
    <Card title="Select Project" className="w-full" size="small">
      <div className="space-y-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-2">Area</label>
              <Select
                placeholder="Select an area"
                className="w-full"
                onChange={(value) => {
                  setSelectedAreaId(value);
                  setSelectedZoneId(null);
                }}
                allowClear
              >
                {areas.map((area) => (
                  <Option key={area.area_id} value={area.area_id}>
                    <div className="flex items-center gap-2">
                      <span>{area.area_name_en}</span>
                      {area.area_name_ar && (
                        <span className="text-gray-500 text-sm" dir="rtl">
                          ({area.area_name_ar})
                        </span>
                      )}
                    </div>
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-2">Zone</label>
              <Select
                placeholder="Select a zone"
                className="w-full"
                onChange={setSelectedZoneId}
                disabled={!selectedAreaId}
                allowClear
              >
                {filteredZones.map((zone) => (
                  <Option key={zone.zone_id} value={zone.zone_id}>
                    <div className="flex items-center gap-2">
                      <span>{zone.zone_name_en}</span>
                      {zone.zone_name_ar && (
                        <span className="text-gray-500 text-sm" dir="rtl">
                          ({zone.zone_name_ar})
                        </span>
                      )}
                    </div>
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {filteredProjects.map((project) => (
            <Col xs={24} key={project.project_id}>
              <Card
                hoverable
                className={`cursor-pointer transition-all unit-card ${
                  selectedProject?.project_id === project.project_id
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => onProjectSelect(project)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold mb-0">
                      {project.project_name}
                    </h3>
                    <Tag color={getStatusColor(project.completion_status)}>
                      {project.completion_status.replace("_", " ")}
                    </Tag>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <EnvironmentOutlined />
                    <span>
                      {
                        areas.find((a) => a.area_id === project.area_id)
                          ?.area_name_en
                      }{" "}
                      -{" "}
                      {
                        zones.find((z) => z.zone_id === project.zone_id)
                          ?.zone_name_en
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <TeamOutlined />
                    <span
                      style={{
                        color:
                          getAvailabilityColor(
                            project.available_units,
                            project.total_units
                          ) === "red"
                            ? "#ff4d4f"
                            : getAvailabilityColor(
                                project.available_units,
                                project.total_units
                              ) === "orange"
                            ? "#fa8c16"
                            : "#52c41a",
                      }}
                    >
                      {project.available_units} / {project.total_units} units
                      available
                    </span>
                    <span className="text-xs text-gray-500">
                      (
                      {Math.round(
                        (project.available_units / project.total_units) * 100
                      )}
                      %)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <RiseOutlined />
                    <span>
                      AED {project.min_price.toLocaleString()} -{" "}
                      {project.max_price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BuildOutlined />
                    <span>Developer: {project.developer}</span>
                  </div>

                  {project.completion_status === "off_plan" && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <CalendarOutlined />
                      <span>Future Value Potential: +15%</span>
                    </div>
                  )}

                  {project.available_units / project.total_units < 0.2 && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      <ClockCircleOutlined />
                      <span className="font-medium">Limited Availability!</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {project.amenities.slice(0, 3).map((amenity) => (
                        <Tag key={amenity} size="small" color="blue">
                          {amenity}
                        </Tag>
                      ))}
                      {project.amenities.length > 3 && (
                        <Tag size="small" color="default">
                          +{project.amenities.length - 3} more
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8">
            <Empty
              image={
                <BuildOutlined
                  style={{ fontSize: "48px", color: "#d9d9d9" }}
                />
              }
              description="No projects found matching your criteria"
            >
              <Button
                onClick={() => {
                  setSelectedAreaId(null);
                  setSelectedZoneId(null);
                }}
              >
                Clear Filters
              </Button>
            </Empty>
          </div>
        )}
      </div>
    </Card>
  );
}
