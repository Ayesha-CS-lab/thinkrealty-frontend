import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Layout, Row, Col, Breadcrumb, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { EditOutlined, HomeOutlined } from "@ant-design/icons";
import ContentPreview from "../components/ContentPreview";
import PreviewSidebar from "../components/PreviewSidebar";
import { setMasterData } from "../features/landingPage/landingPageSlice";
import {
  mockProjects,
  mockAreas,
  mockZones,
  mockUnits,
} from "../data/mockData";

const { Content } = Layout;

export default function PreviewPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProject, hasMasterData } = useSelector((state) => ({
    selectedProject: state.landingPage.selectedProject,
    allAreas: state.landingPage.allAreas,
    hasMasterData: state.landingPage.allProjects.length > 0,
  }));

  useEffect(() => {
    if (!hasMasterData) {
      dispatch(
        setMasterData({
          projects: mockProjects,
          units: mockUnits,
          areas: mockAreas,
          zones: mockZones,
        })
      );
    }
  }, [dispatch, hasMasterData]);

  if (hasMasterData && !selectedProject) {
    return <Navigate to="/" />;
  }

  const breadcrumbItems = [
    {
      onClick: () => navigate("/"),
      title: (
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors">
          <HomeOutlined />
          <span>Home</span>
        </div>
      ),
    },
    {
      onClick: () => navigate("/"),
      title: (
        <span className="cursor-pointer hover:text-blue-500 transition-colors">
          {selectedProject?.project_name}
        </span>
      ),
    },
    {
      title: "Preview",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <Breadcrumb items={breadcrumbItems} />
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate("/")}
        >
          Edit Selection
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <ContentPreview />
        </Col>
        <Col xs={24} lg={8}>
          <PreviewSidebar />
        </Col>
      </Row>
    </div>
  );
}
