// src/components/ValidationReport.jsx

import { useSelector } from "react-redux";
import { Card, Alert } from "antd";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function ValidationReport() {
  const validationErrors = useSelector((state) => state.landingPage.validationErrors);

  // Don't render anything if there are no errors.
  if (!validationErrors || validationErrors.length === 0) {
    return (
        <Card size="small">
             <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18}/>
                <span className="font-semibold">Selection Validated</span>
             </div>
        </Card>
    );
  }

  return (
    <Card size="small" title={
        <div className="flex items-center gap-2 text-orange-600">
            <AlertTriangle size={18} />
            <span className="font-semibold">Selection Review Required</span>
        </div>
    }>
      <div className="space-y-3">
        {validationErrors.map((error) => (
          <Alert
            key={error.id}
            message={error.message}
            description={error.description}
            type={error.severity === 'critical' ? 'error' : 'warning'}
            showIcon
          />
        ))}
      </div>
    </Card>
  );
}