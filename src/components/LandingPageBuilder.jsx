"use client"

import { useState } from "react"
import { Layout, Typography, Space, Divider } from "antd"
import ProjectSelector from "./ProjectSelector"
import UnitMultiSelect from "./UnitMultiSelect"
import PricingCalculator from "./PricingCalculator"
import SmartNotificationCenter from "./SmartNotificationCenter"
import ContentPreview from "./ContentPreview"

const { Header, Content, Sider } = Layout
const { Title } = Typography

// Mock data
const mockAreas = [
  { area_id: 1, area_name_en: "Dubai Marina", area_name_ar: "مارينا دبي" },
  { area_id: 2, area_name_en: "Downtown Dubai", area_name_ar: "وسط مدينة دبي" },
  { area_id: 3, area_name_en: "Palm Jumeirah", area_name_ar: "نخلة الجميرا" },
  { area_id: 4, area_name_en: "Business Bay", area_name_ar: "الخليج التجاري" },
  { area_id: 5, area_name_en: "Jumeirah Beach Residence", area_name_ar: "مساكن شاطئ الجميرا" },
]

const mockZones = [
  { zone_id: 1, area_id: 1, zone_name_en: "Marina Walk", zone_name_ar: "ممشى المارينا" },
  { zone_id: 2, area_id: 1, zone_name_en: "Marina Promenade", zone_name_ar: "كورنيش المارينا" },
  { zone_id: 3, area_id: 2, zone_name_en: "DIFC", zone_name_ar: "مركز دبي المالي العالمي" },
  { zone_id: 4, area_id: 2, zone_name_en: "Opera District", zone_name_ar: "منطقة الأوبرا" },
  { zone_id: 5, area_id: 3, zone_name_en: "Palm West Beach", zone_name_ar: "شاطئ النخلة الغربي" },
  { zone_id: 6, area_id: 4, zone_name_en: "Business Bay Central", zone_name_ar: "الخليج التجاري المركزي" },
  { zone_id: 7, area_id: 5, zone_name_en: "JBR The Walk", zone_name_ar: "ممشى جي بي آر" },
]

const mockProjects = [
  {
    project_id: 1,
    project_name: "Marina Heights Tower",
    area_id: 1,
    zone_id: 1,
    completion_status: "under_construction",
    min_price: 800000,
    max_price: 2500000,
    total_units: 200,
    available_units: 150,
    completion_date: "2025-12-31",
    common_area_ratio: 1.1,
    phases: ["Phase 1", "Phase 2"],
    developer: "Emaar Properties",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Concierge"],
  },
  {
    project_id: 2,
    project_name: "Downtown Luxury Residences",
    area_id: 2,
    zone_id: 3,
    completion_status: "off_plan",
    min_price: 1200000,
    max_price: 4000000,
    total_units: 150,
    available_units: 120,
    completion_date: "2026-06-30",
    common_area_ratio: 1.2,
    phases: ["Phase 1", "Phase 2", "Phase 3"],
    developer: "DAMAC Properties",
    amenities: ["Rooftop Pool", "Spa", "Valet Parking", "Business Center", "Kids Play Area"],
  },
  {
    project_id: 3,
    project_name: "Palm Jumeirah Villas",
    area_id: 3,
    zone_id: 5,
    completion_status: "ready",
    min_price: 3000000,
    max_price: 8000000,
    total_units: 80,
    available_units: 15,
    completion_date: "2024-01-01",
    common_area_ratio: 1.5,
    phases: ["Phase 1"],
    developer: "Nakheel",
    amenities: ["Private Beach", "Marina", "Golf Course", "Retail Center", "Fine Dining"],
  },
]

const mockUnits = [
  {
    unit_id: 1,
    project_id: 1,
    unit_number: "A101",
    property_type: "apartment",
    bedrooms: 1,
    area_sqft: 650,
    price: 850000,
    status: "available",
    floor_level: 1,
    has_balcony: true,
    has_parking: false,
    base_price_per_sqft: 1308,
    phase: "Phase 1",
  },
  {
    unit_id: 2,
    project_id: 1,
    unit_number: "A102",
    property_type: "apartment",
    bedrooms: 2,
    area_sqft: 900,
    price: 1200000,
    status: "available",
    floor_level: 1,
    has_balcony: true,
    has_parking: true,
    base_price_per_sqft: 1333,
    phase: "Phase 1",
  },
  {
    unit_id: 3,
    project_id: 1,
    unit_number: "B501",
    property_type: "apartment",
    bedrooms: 3,
    area_sqft: 1200,
    price: 1800000,
    status: "available",
    floor_level: 5,
    has_balcony: true,
    has_parking: true,
    base_price_per_sqft: 1500,
    phase: "Phase 2",
  },
  {
    unit_id: 4,
    project_id: 1,
    unit_number: "C801",
    property_type: "apartment",
    bedrooms: 4,
    area_sqft: 1500,
    price: 2400000,
    status: "available",
    floor_level: 8,
    has_balcony: true,
    has_parking: true,
    base_price_per_sqft: 1600,
    phase: "Phase 2",
  },
  {
    unit_id: 5,
    project_id: 1,
    unit_number: "S201",
    property_type: "studio",
    bedrooms: 0,
    area_sqft: 450,
    price: 600000,
    status: "available",
    floor_level: 2,
    has_balcony: false,
    has_parking: false,
    base_price_per_sqft: 1333,
    phase: "Phase 1",
  },
  {
    unit_id: 6,
    project_id: 2,
    unit_number: "DL101",
    property_type: "apartment",
    bedrooms: 2,
    area_sqft: 1000,
    price: 1500000,
    status: "available",
    floor_level: 1,
    has_balcony: true,
    has_parking: true,
    base_price_per_sqft: 1500,
    phase: "Phase 1",
  },
  {
    unit_id: 7,
    project_id: 2,
    unit_number: "DL301",
    property_type: "apartment",
    bedrooms: 3,
    area_sqft: 1400,
    price: 2200000,
    status: "available",
    floor_level: 3,
    has_balcony: true,
    has_parking: true,
    base_price_per_sqft: 1571,
    phase: "Phase 1",
  },
  {
    unit_id: 8,
    project_id: 2,
    unit_number: "DL601",
    property_type: "apartment",
    bedrooms: 4,
    area_sqft: 1800,
    price: 3200000,
    status: "available",
    floor_level: 6,
    has_balcony: true,
    has_parking: true,
    base_price_per_sqft: 1778,
    phase: "Phase 2",
  },
  {
    unit_id: 9,
    project_id: 3,
    unit_number: "PV001",
    property_type: "villa",
    bedrooms: 5,
    area_sqft: 3500,
    price: 6000000,
    status: "available",
    floor_level: 0,
    has_balcony: true,
    has_parking: true,
    base_price_per_sqft: 1714,
    phase: "Phase 1",
  },
  {
    unit_id: 10,
    project_id: 3,
    unit_number: "PV002",
    property_type: "villa",
    bedrooms: 6,
    area_sqft: 4200,
    price: 7500000,
    status: "available",
    floor_level: 0,
    has_balcony: true,
    has_parking: true,
    base_price_per_sqft: 1786,
    phase: "Phase 1",
  },
]

export default function LandingPageBuilder() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedUnits, setSelectedUnits] = useState([])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      message: "Welcome to Dubai Realty Landing Page Builder",
      description: "Select a project to get started",
      timestamp: Date.now(),
      severity: "info",
    },
  ])

  const projectUnits = selectedProject ? mockUnits.filter((unit) => unit.project_id === selectedProject.project_id) : []

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setSelectedUnits([])
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "success",
        message: `Project "${project.project_name}" selected`,
        description: `${project.available_units} units available for selection`,
        timestamp: Date.now(),
        severity: "success",
      },
    ])
  }

  const handleUnitToggle = (unit) => {
    setSelectedUnits((prev) => {
      const isSelected = prev.some((u) => u.unit_id === unit.unit_id)
      if (isSelected) {
        return prev.filter((u) => u.unit_id !== unit.unit_id)
      } else {
        return [...prev, unit]
      }
    })
  }

  const handleRemoveNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleClearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
          <Title level={3} className="m-0 text-blue-600">
            Dubai Realty Landing Page Builder
          </Title>
          <SmartNotificationCenter
            notifications={notifications}
            onRemoveNotification={handleRemoveNotification}
            onClearAll={handleClearAllNotifications}
          />
        </div>
      </Header>

      <Layout>
        <Sider width={400} className="bg-white shadow-sm">
          <div className="p-6 space-y-6">
            <ProjectSelector
              projects={mockProjects}
              zones={mockZones}
              areas={mockAreas}
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
            />
            <Divider />
            {selectedProject && (
              <>
                <UnitMultiSelect units={projectUnits} selectedUnits={selectedUnits} onUnitToggle={handleUnitToggle} />
                <Divider />
                {selectedUnits.length > 0 && (
                  <PricingCalculator selectedProject={selectedProject} selectedUnits={selectedUnits} />
                )}
              </>
            )}
          </div>
        </Sider>

        <Content className="bg-gray-50">
          <div className="p-6">
            <Space direction="vertical" size="large" className="w-full">
              <ContentPreview
                selectedProject={selectedProject}
                selectedUnits={selectedUnits}
                areas={mockAreas}
                zones={mockZones}
              />
            </Space>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
