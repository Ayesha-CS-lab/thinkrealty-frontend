import { useState, useMemo } from "react";
import {
  Card,
  Select,
  Typography,
  Tag,
  Row,
  Col,
  Empty,
  Button,
  Progress,
} from "antd";
import {
  BuildOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function ProjectSelector({ onProjectSelect }) {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const { projects, areas, zones, allUnits, selectedProject } = useSelector(
    (state) => ({
      projects: state.landingPage.allProjects,
      areas: state.landingPage.allAreas,
      zones: state.landingPage.allZones,
      allUnits: state.landingPage.allUnits,
      selectedProject: state.landingPage.selectedProject,
    })
  );

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    let filtered = projects;
    if (selectedAreaId)
      filtered = filtered.filter((p) => p.area_id === selectedAreaId);
    if (selectedZoneId)
      filtered = filtered.filter((p) => p.zone_id === selectedZoneId);
    return filtered;
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
    <Card
      title="Step 1: Select a Project"
      size="small"
      className="deemphasize-in-focus"
    >
      <div className="space-y-6 p-2 md:p-4">
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} md={12}>
            <Text type="secondary" className="block mb-1 font-medium">
              Area
            </Text>
            <Select
              placeholder="Filter by area"
              className="w-full"
              onChange={(value) => {
                setSelectedAreaId(value);
                setSelectedZoneId(null);
              }}
              value={selectedAreaId}
              allowClear
            >
              {areas.map((area) => (
                <Option key={area.area_id} value={area.area_id}>
                  {area.area_name_en}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={12}>
            <Text type="secondary" className="block mb-1 font-medium">
              Zone
            </Text>
            <Select
              placeholder="Filter by zone"
              className="w-full"
              value={selectedZoneId}
              onChange={setSelectedZoneId}
              disabled={!selectedAreaId}
              allowClear
            >
              {filteredZones.map((zone) => (
                <Option key={zone.zone_id} value={zone.zone_id}>
                  {zone.zone_name_en}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* --- NEW PROJECT CARDS --- */}
        <Row gutter={[24, 24]}>
          {filteredProjects.map((project) => {
            const isSelected =
              selectedProject?.project_id === project.project_id;
            const realTimeAvailable = allUnits.filter(
              (u) =>
                u.project_id === project.project_id && u.status === "available"
            ).length;

            const availablePercent = Math.round(
              (realTimeAvailable / project.total_units) * 100
            );

            return (
              <Col xs={24} sm={12} lg={8} key={project.project_id}>
                <div
                  className={`
                    bg-white rounded-lg shadow-md overflow-hidden cursor-pointer 
                    transition-all duration-300 ease-in-out border
                    hover:shadow-xl hover:scale-[1.03]
                    ${
                      isSelected
                        ? "border-blue-500 shadow-lg scale-[1.02]"
                        : "border-transparent"
                    }
                  `}
                  onClick={() => onProjectSelect(project)}
                >
                  {/* Image Section */}
                  <div className="relative">
                    <img
                      src={project.imageUrl}
                      alt={project.project_name}
                      className="w-full h-48 object-cover"
                    />
                    <Tag
                      color={getStatusColor(project.completion_status)}
                      className="absolute top-3 right-3 capitalize"
                    >
                      {project.completion_status.replace("_", " ")}
                    </Tag>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col space-y-4">
                    <Title level={4} className="!mb-0 truncate">
                      {project.project_name}
                    </Title>
                    <div className="flex items-center text-sm text-gray-500">
                      <EnvironmentOutlined className="mr-2" />
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

                    {/* Availability Meter */}
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <Text strong>Availability</Text>
                        <Text
                          strong
                          style={{
                            color: getAvailabilityColor(availablePercent),
                          }}
                        >
                          {realTimeAvailable} / {project.total_units} units
                        </Text>
                      </div>
                      <Progress
                        percent={availablePercent}
                        strokeColor={getAvailabilityColor(availablePercent)}
                        showInfo={false}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-2">
                        <BuildOutlined /> {project.developer}
                      </span>
                      {project.available_units / project.total_units < 0.2 && (
                        <span className="flex items-center gap-1 font-semibold text-red-500">
                          <ClockCircleOutlined /> Limited Units
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
                      {project.amenities.slice(0, 4).map((amenity) => (
                        <Tag key={amenity} className="text-xs">
                          {amenity}
                        </Tag>
                      ))}
                      {project.amenities.length > 4 && (
                        <Tag>+ {project.amenities.length - 4} more</Tag>
                      )}
                    </div>
                  </div>

                  {/* Price Footer */}
                  <div className="bg-gray-50 p-3 border-t flex justify-between items-center">
                    <Text type="secondary" className="text-sm">
                      Starting From
                    </Text>
                    <Text strong className="text-lg text-blue-600">
                      AED {project.min_price.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8">
            <Empty
              image={
                <BuildOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />
              }
              description="No projects found matching your criteria"
            >
              <Button
                onClick={() => {
                  setSelectedAreaId(null);
                  setSelectedZoneId(null);
                }}
              >
                Clear All Filters
              </Button>
            </Empty>
          </div>
        )}
      </div>
    </Card>
  );
}
