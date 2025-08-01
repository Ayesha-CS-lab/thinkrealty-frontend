"use client"

import { Badge, Dropdown, Button, Typography } from "antd"
import { BellOutlined, CloseOutlined } from "@ant-design/icons"

const { Text } = Typography

export default function SmartNotificationCenter({ notifications, onRemoveNotification, onClearAll }) {
  const getNotificationColor = (severity) => {
    switch (severity) {
      case "error":
        return "#ff4d4f"
      case "warning":
        return "#faad14"
      case "info":
        return "#1890ff"
      case "success":
        return "#52c41a"
      default:
        return "#d9d9d9"
    }
  }

  const notificationMenu = {
    items: [
      {
        key: "header",
        label: (
          <div className="flex items-center justify-between p-2">
            <Text strong>Notifications</Text>
            {notifications.length > 0 && (
              <Button type="link" size="small" onClick={onClearAll}>
                Clear All
              </Button>
            )}
          </div>
        ),
        disabled: true,
      },
      ...(notifications.length === 0
        ? [
            {
              key: "empty",
              label: (
                <div className="p-4 text-center">
                  <Text type="secondary">No notifications</Text>
                </div>
              ),
              disabled: true,
            },
          ]
        : notifications.map((notification) => ({
            key: notification.id,
            label: (
              <div className="p-2 max-w-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div
                      className="w-2 h-2 rounded-full inline-block mr-2"
                      style={{ backgroundColor: getNotificationColor(notification.severity) }}
                    />
                    <Text className="text-sm">{notification.message}</Text>
                    {notification.description && (
                      <div className="text-xs text-gray-500 mt-1">{notification.description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveNotification(notification.id)
                    }}
                  />
                </div>
              </div>
            ),
          }))),
    ],
  }

  return (
    <Dropdown
      menu={notificationMenu}
      trigger={["click"]}
      placement="bottomRight"
      overlayStyle={{ maxHeight: "400px", overflowY: "auto" }}
    >
      <Badge count={notifications.length} size="small" className="notification-badge">
        <Button type="text" icon={<BellOutlined />} />
      </Badge>
    </Dropdown>
  )
}
