import { useSelector, useDispatch } from "react-redux";
import { Avatar, Dropdown, Space, Tag, Typography } from "antd";
import {
  CrownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import SmartNotificationCenter from "../../components/SmartNotificationCenter";
import {
  removeNotification,
  clearAllNotifications,
} from "../../features/landingPage/landingPageSlice";

const { Title, Text } = Typography;

export default function HeaderComponent() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.landingPage.notifications);

  const handleRemoveNotification = (id) => dispatch(removeNotification(id));
  const handleClearAll = () => dispatch(clearAllNotifications());

  const userMenu = {
    items: [
      { key: "profile", label: "User Profile", icon: <UserOutlined /> },
      { key: "settings", label: "Settings", icon: <SettingOutlined /> },
      { type: "divider" },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
  };

  return (
    <header className="bg-white flex items-center justify-between px-6 shadow-sm border-b border-gray-200 sticky top-0 z-50 h-16">
      {/* Left Side: Brand & Title */}
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
      {/* Right Side: Actions & User Info */}
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
          <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
            <Avatar className="cursor-pointer" icon={<UserOutlined />} />
          </Dropdown>
        </Space>
      </div>
    </header>
  );
}
