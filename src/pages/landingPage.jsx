import { useLocation,useNavigate } from "react-router-dom";
import ContentPreview from "../components/ContentPreview";
import { Breadcrumb } from "antd";

export default function ContentPreviewPage() {
   const location = useLocation();
  const navigate = useNavigate();
  const { selectedProject, selectedUnits, areas, zones } = location.state || {};

  const breadcrumbItems = [
    { title: "Home", onClick: () => navigate("/") },
    { title: selectedProject?.project_name || "Project" },
    { title: "Content Preview" },
  ];

  return (
    <div className="p-4">
         <Breadcrumb style={{ marginBottom: 16 }}>
        {breadcrumbItems.map((item, idx) => (
          <Breadcrumb.Item key={idx}>
            <span onClick={item.onClick} style={{ cursor: "pointer" }}>
              {item.title}
            </span>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
        <ContentPreview
      selectedProject={selectedProject}
      selectedUnits={selectedUnits}
      areas={areas}
      zones={zones}
    />
        
     </div>
    
  );
}
