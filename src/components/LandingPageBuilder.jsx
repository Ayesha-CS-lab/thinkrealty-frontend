import { useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Breadcrumb, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import ProjectSelector from "./ProjectSelector";
import UnitMultiSelect from "./UnitMultiSelect";
import ValidationReport from "./ValidationReports";

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
  validateSelection,
} from "../features/landingPage/landingPageSlice";

const { Text } = Typography;

export default function LandingPageBuilder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const unitSectionRef = useRef(null);

  const { selectedProject, selectedUnits, allAreas, validationErrors } =
    useSelector((state) => state.landingPage);
  const totalInvestment = useSelector(
    (state) => state.landingPage.pricingCalculations.finalPrice
  );
  // This hook runs only once when the component mounts.
  useEffect(() => {
    dispatch(
      setMasterData({
        units: mockUnits,
        areas: mockAreas,
        zones: mockZones,
        projects: mockProjects,
      })
    );
  }, [dispatch]);

  // This hook runs whenever the selectedProject changes
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

  // --- Event Handlers ---
  const handleProjectSelect = (project) => {
    dispatch(setProject(project));
  };

  const handleUnitsChange = (units) => {
    dispatch(setSelectedUnits(units));
    dispatch(updatePricing());
    dispatch(validateSelection());
  };

  const handlePreview = () => {
    if (selectedUnits.length > 0) {
      navigate("/preview");
    }
  };

  const hasCriticalErrors = validationErrors.some(
    (e) => e.severity === "critical"
  );

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

  return (
    <div className="space-y-6 pb-24">
      {" "}
      <Breadcrumb items={breadcrumbItems} />
      <ProjectSelector
        projects={mockProjects}
        zones={mockZones}
        areas={mockAreas}
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
      />
      {selectedProject && (
        <div ref={unitSectionRef} className="space-y-6 pt-4">
          {selectedUnits.length > 0 && <ValidationReport />}

          <UnitMultiSelect
            onUnitsChange={handleUnitsChange}
            selectedUnits={selectedUnits}
          />
        </div>
      )}
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
                : "Generate Preview & Calculate Pricing"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
