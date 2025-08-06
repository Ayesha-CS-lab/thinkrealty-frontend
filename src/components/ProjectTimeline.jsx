import { Card, Timeline, Progress, Typography } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Calendar } from "lucide-react";

const { Title, Text } = Typography;

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ProjectTimeline() {
  const selectedProject = useSelector(
    (state) => state.landingPage.selectedProject
  );

  if (!selectedProject || !selectedProject.timeline) {
    return null;
  }

  const { timeline, completion_date } = selectedProject;

  const timelineItems = [
    { label: "Project announcement", date: timeline.announcementDate },
    { label: "Booking Started", date: timeline.bookingStartDate },
    { label: "Construction Started", date: timeline.constructionStartDate },
    {
      isProgressItem: true,
      progress: timeline.constructionProgress,
      updateDate: timeline.lastProgressUpdate,
    },
    { label: "Expected Completion", date: completion_date },
  ];

  return (
    <Card title="Project Timeline">
      <div className="p-4">
        <Timeline>
          {timelineItems.map((item, index) => (
            <Timeline.Item
              key={index}
              dot={<CheckCircleFilled className="text-teal-500 text-lg" />}
            >
              <div className="ml-2 pb-6">
                {" "}
                {/* Added padding-bottom for more space */}
                {item.isProgressItem ? (
                  // --- RENDER THE PROGRESS BAR ITEM ---
                  <div>
                    <Text strong>Construction progress: {item.progress}%</Text>
                    <Progress
                      percent={item.progress}
                      showInfo={false}
                      strokeColor="#52c41a"
                      trailColor="#e6f4ff"
                      className="my-2"
                    />
                    <div className="flex justify-end">
                      <Text
                        type="secondary"
                        className="text-xs flex items-center gap-1.5"
                      >
                        <Calendar size={14} />
                        Latest update: {formatDate(item.updateDate)}
                      </Text>
                    </div>
                  </div>
                ) : (
                  // --- RENDER A STANDARD TEXT ITEM WITH FLEXBOX ---
                  <div className="flex justify-between items-center">
                    <Text strong>{item.label}</Text>
                    <Text type="secondary">{formatDate(item.date)}</Text>
                  </div>
                )}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </Card>
  );
}
