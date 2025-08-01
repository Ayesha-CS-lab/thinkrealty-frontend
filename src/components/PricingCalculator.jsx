"use client"

import { useMemo } from "react"
import { Card, Typography, Divider, Space, Tag, Progress } from "antd"
import { DollarOutlined, PercentageOutlined, CalendarOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

export default function PricingCalculator({ selectedProject, selectedUnits }) {
  const pricingCalculations = useMemo(() => {
    if (!selectedUnits || selectedUnits.length === 0) return null

    const basePrice = selectedUnits.reduce((sum, unit) => sum + unit.price, 0)
    const discounts = []

    // Multi-unit discount
    if (selectedUnits.length > 1) {
      const multiUnitDiscount = basePrice * 0.02 // 2% discount
      discounts.push({
        description: "Multi-unit discount (2%)",
        amount: multiUnitDiscount,
      })
    }

    // Early bird discount for off-plan projects
    if (selectedProject?.completion_status === "off_plan") {
      const earlyBirdDiscount = basePrice * 0.05 // 5% discount
      discounts.push({
        description: "Early bird discount (5%)",
        amount: earlyBirdDiscount,
      })
    }

    // Luxury unit discount
    const luxuryUnits = selectedUnits.filter((unit) => unit.has_balcony && unit.has_parking && unit.bedrooms >= 3)
    if (luxuryUnits.length > 0) {
      const luxuryDiscount = luxuryUnits.reduce((sum, unit) => sum + unit.price * 0.03, 0) // 3% on luxury units
      discounts.push({
        description: `Luxury amenities discount (3% on ${luxuryUnits.length} units)`,
        amount: luxuryDiscount,
      })
    }

    const totalDiscounts = discounts.reduce((sum, discount) => sum + discount.amount, 0)
    const finalPrice = basePrice - totalDiscounts

    // Payment plan
    const paymentPlan = {
      downPayment: finalPrice * 0.2, // 20% down payment
      installments: [
        { phase: "Construction 25%", percentage: 25, amount: finalPrice * 0.25 },
        { phase: "Construction 50%", percentage: 25, amount: finalPrice * 0.25 },
        { phase: "Handover", percentage: 30, amount: finalPrice * 0.3 },
      ],
    }

    return {
      basePrice,
      discounts,
      finalPrice,
      paymentPlan,
    }
  }, [selectedProject, selectedUnits])

  if (!pricingCalculations) {
    return null
  }

  const { basePrice, discounts, finalPrice, paymentPlan } = pricingCalculations

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <span>Pricing Calculator</span>
        </div>
      }
      size="small"
    >
      <Space direction="vertical" className="w-full">
        {/* Base Price */}
        <div className="flex items-center justify-between">
          <Text>Base Price:</Text>
          <Text strong>AED {basePrice.toLocaleString()}</Text>
        </div>

        {/* Discounts */}
        {discounts.map((discount, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PercentageOutlined className="text-green-600" />
              <Text type="secondary">{discount.description}:</Text>
            </div>
            <Text className="text-green-600">-AED {discount.amount.toLocaleString()}</Text>
          </div>
        ))}

        <Divider className="my-2" />

        {/* Final Price */}
        <div className="flex items-center justify-between">
          <Title level={5} className="m-0">
            Final Price:
          </Title>
          <Title level={4} className="m-0 text-blue-600">
            AED {finalPrice.toLocaleString()}
          </Title>
        </div>

        {/* Savings */}
        {basePrice > finalPrice && (
          <div className="bg-green-50 p-3 rounded">
            <div className="flex items-center justify-between">
              <Text className="text-green-700">Total Savings:</Text>
              <Text strong className="text-green-700">
                AED {(basePrice - finalPrice).toLocaleString()}
              </Text>
            </div>
            <Progress
              percent={Math.round(((basePrice - finalPrice) / basePrice) * 100)}
              strokeColor="#52c41a"
              size="small"
            />
          </div>
        )}

        {/* Payment Plan */}
        {paymentPlan && (
          <>
            <Divider className="my-2" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarOutlined />
                <Text strong>Payment Plan</Text>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text type="secondary">Down Payment (20%):</Text>
                  <Text>AED {paymentPlan.downPayment.toLocaleString()}</Text>
                </div>

                {paymentPlan.installments.map((installment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Text type="secondary">
                      {installment.phase} ({installment.percentage}%):
                    </Text>
                    <Text>AED {installment.amount.toLocaleString()}</Text>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Unit Summary */}
        <Divider className="my-2" />
        <div>
          <Text strong>Selected Units ({selectedUnits.length}):</Text>
          <div className="mt-2 space-y-1">
            {selectedUnits.map((unit) => (
              <div key={unit.unit_id} className="flex items-center justify-between text-sm">
                <span>{unit.unit_number}</span>
                <Space>
                  <Tag size="small">{unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms}BR`}</Tag>
                  <Text type="secondary">AED {unit.price.toLocaleString()}</Text>
                </Space>
              </div>
            ))}
          </div>
        </div>
      </Space>
    </Card>
  )
}