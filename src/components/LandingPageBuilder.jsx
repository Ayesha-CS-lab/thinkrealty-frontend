import { useRef, useEffect, useMemo } from "react"; // Add useMemo
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Typography,
  Tag,
  Breadcrumb,
  Button,
  Space,
  Avatar,
  Dropdown,
} from "antd";
import {
  CrownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import ProjectSelector from "./ProjectSelector";
import UnitMultiSelect from "./UnitMultiSelect";
import ValidationReport from "./ValidationReports";

import SmartNotificationCenter from "./SmartNotificationCenter";
import {
  mockProjects,
  mockAreas,
  mockZones,
  mockUnits,
} from "../data/mockData";
import {
  setProject,
  setSelectedUnits,
  updatePricing,
  setMasterData,
  tick,
  validateSelection,
  simulateExternalPriceUpdate, simulateConcurrentReservation, removeNotification, clearAllNotifications
} from "../features/landingPage/landingPageSlice";
// const mockNotifications = [
//   {
//     id: 1,
//     severity: "info",
//     message: 'New project "Palm Views" was added.',
//     timestamp: new Date(),
//   },
//   {
//     id: 2,
//     severity: "warning",
//     message: "7 units in Marina Heights are reserved.",
//     timestamp: new Date(),
//   },
// ];
const { Header, Content } = Layout;
const { Title, Text } = Typography;

// const mockAreas = [
//   { area_id: 1, area_name_en: "Dubai Marina", area_name_ar: "مرسى دبي" },
//   { area_id: 2, area_name_en: "Downtown Dubai", area_name_ar: "وسط مدينة دبي" },
//   { area_id: 3, area_name_en: "Palm Jumeirah" },
//   { area_id: 4, area_name_en: "Business Bay" },
//   { area_id: 5, area_name_en: "JBR" },
// ];

// const mockZones = [
//   { zone_id: 1, area_id: 1, zone_name_en: "Marina Walk" },
//   { zone_id: 2, area_id: 1, zone_name_en: "Marina Promenade" },
//   { zone_id: 3, area_id: 2, zone_name_en: "DIFC" },
//   { zone_id: 4, area_id: 2, zone_name_en: "Opera District" },
//   { zone_id: 5, area_id: 3, zone_name_en: "Palm West Beach" },
//   { zone_id: 6, area_id: 4, zone_name_en: "Business Bay Central" },
//   { zone_id: 7, area_id: 5, zone_name_en: "JBR The Walk" },
// ];

// const mockProjects = [
//   {
//     project_id: 1,
//     project_name: "Marina Heights Tower",
//     // highlight-start
//     imageUrl:
//       "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     // highlight-end
//     area_id: 1,
//     zone_id: 1,
//     completion_status: "under_construction",
//     min_price: 800000,
//     max_price: 2500000,
//     total_units: 200,
//     available_units: 35, // This is < 20% of 200    completion_date: "2025-12-31",
//     developer: "Emaar Properties",
//     amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Concierge"],
//   },
//   {
//     project_id: 2,
//     project_name: "Downtown Luxury Residences",
//     // highlight-start
//     imageUrl:
//       "https://images.pexels.com/photos/3935320/pexels-photo-3935320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     // highlight-end
//     area_id: 2,
//     zone_id: 3,
//     completion_status: "off_plan",
//     min_price: 1200000,
//     max_price: 4000000,
//     total_units: 150,
//     available_units: 25, // Reduced to show the "low availability" state
//     completion_date: "2026-06-30",
//     developer: "DAMAC Properties",
//     amenities: [
//       "Rooftop Pool",
//       "Spa",
//       "Valet Parking",
//       "Business Center",
//       "Kids Play Area",
//     ],
//   },
// ];

export default function LandingPageBuilder() {
  const navigate = useNavigate();
  const unitSectionRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedProject, selectedUnits, allAreas, validationErrors } =
    useSelector((state) => state.landingPage);
    const notifications = useSelector(state => state.landingPage.notifications); // Get notifications from store

  useEffect(() => {
    // Dispatch all mock data to the store on initial load
    dispatch(
      setMasterData({
        units: mockUnits,
        areas: mockAreas,
        zones: mockZones,
        projects: mockProjects,
      })
    );

    const timerInterval = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(timerInterval);
  }, [dispatch]);
    useEffect(() => {
        const simulatorInterval = setInterval(() => {
            // No more 'if' check here. We just dispatch the actions unconditionally.
            // The thunks themselves will decide if they should run.
            const randomChoice = Math.random();
            if (randomChoice < 0.5) {
                dispatch(simulateExternalPriceUpdate());
            } else {
                dispatch(simulateConcurrentReservation());
            }
        }, 15000); // Runs every 15 seconds

        return () => clearInterval(simulatorInterval);
    }, [dispatch]);
  // Derive totalInvestment for the sticky footer
  const totalInvestment = useSelector(
    (state) => state.landingPage.pricingCalculations.finalPrice
  );
  const handleRemoveNotification = (id) => dispatch(removeNotification(id));
    const handleClearAll = () => dispatch(clearAllNotifications());


  const handleProjectSelect = (project) => {
    dispatch(setProject(project)); // Dispatch action to set project
  };

  // This useEffect for scrolling remains the same
  // useEffect(() => {
  //   if (selectedProject && unitSectionRef.current) { /* ...scroll logic... */ }
  // }, [selectedProject]);

  // const handleProjectSelect = (project) => {
  //   setSelectedProject(project);
  //   const area = mockAreas.find((a) => a.area_id === project.area_id);
  //   const zone = mockZones.find((z) => z.zone_id === project.zone_id);
  //   setSelectedArea(area);
  //   setSelectedZone(zone);
  //       setSelectedUnits([]); // Reset units when a new project is selected

  // };
  useEffect(() => {
    if (selectedProject && unitSectionRef.current) {
      setTimeout(() => {
        unitSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedProject]);

  const handleUnitsChange = (units) => {
    dispatch(setSelectedUnits(units)); // Dispatch action to set units
    dispatch(updatePricing());
    dispatch(validateSelection()); // Dispatch action to trigger price recalculation
  };
  const hasCriticalErrors = validationErrors.some(
    (e) => e.severity === "critical"
  );

  const handlePreview = () => {
    if (selectedUnits.length > 0) {
      navigate("/preview");
    }
  };

  const projectUnits = selectedProject
    ? mockUnits.filter((u) => u.project_id === selectedProject.project_id)
    : [];

  const breadcrumbItems = useMemo(() => {
    const items = [{ title: "Home" }];
    if (selectedProject && allAreas.length > 0) {
      const area = allAreas.find((a) => a.area_id === selectedProject.area_id);
      if (area) items.push({ title: area.area_name_en });
      items.push({ title: selectedProject.project_name });
    } else {
      items.push({ title: "Projects" });
    }
    return items;
  }, [selectedProject, allAreas]);

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "User Profile",
        icon: <UserOutlined />,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <SettingOutlined />,
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
  };
  return (
    <Layout className="h-screen bg-gray-50">
      <Header className="bg-white flex items-center justify-between px-6 shadow-sm border-b border-gray-200 sticky top-0 z-10 mt-2 h-28">
        <div className="flex items-center gap-3">
          <Avatar
            size="large"
            icon={<CrownOutlined />}
            className="bg-purple-600 text-white"
          />
          <div>
            <Title level={5} className="!m-0 leading-tight">
              ThinkRealty CRM
            </Title>
            <Text type="secondary" className="text-sm">
              Landing Page Builder
            </Text>
          </div>
        </div>
        <div className="flex items-center">
          <Space size="large" align="center">
            <Tag color="blue" className="hidden md:block">
              Standard Mode
            </Tag>
 <SmartNotificationCenter 
                            notifications={notifications}
                            onRemoveNotification={handleRemoveNotification}
                            onClearAll={handleClearAll}
                        />
                                    <Dropdown
              menu={userMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Avatar className="cursor-pointer" icon={<UserOutlined />} />
            </Dropdown>
          </Space>
        </div>
      </Header>

      <Content className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        <ProjectSelector
          projects={mockProjects}
          zones={mockZones}
          areas={mockAreas}
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
        />

        {selectedProject && (
          <div ref={unitSectionRef} className="space-y-6 py-10">
                       {selectedUnits.length > 0 && <ValidationReport />}

            <UnitMultiSelect
              units={projectUnits}
              onUnitsChange={handleUnitsChange}
              selectedUnits={selectedUnits}
            />
          </div>
        )}
      </Content>
      {selectedUnits.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="w-full max-w-7xl mx-auto p-3 flex justify-between items-center">
            <div>
              <Text strong>
                {selectedUnits.length}{" "}
                {selectedUnits.length > 1 ? "units" : "unit"} selected
              </Text>
              <Text className="block sm:inline sm:ml-4" type="secondary">
                Total Investment:
                <span className="font-bold text-blue-600 ml-1">
                  AED {totalInvestment.toLocaleString()}
                </span>
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handlePreview}
              icon={<ArrowRightOutlined />}
              disabled={hasCriticalErrors}
              danger={hasCriticalErrors}
            >
              {hasCriticalErrors
                ? "Please Fix Errors to Proceed"
                : "Generate Preview & Calculate Pricing"}{" "}
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
