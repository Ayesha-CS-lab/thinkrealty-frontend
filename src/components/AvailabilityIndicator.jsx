// src/components/AvailabilityIndicator.jsx

import { useSelector } from 'react-redux';
import { Card, Progress, Typography, Alert } from 'antd';
import { Clock } from 'lucide-react';

const { Text, Title } = Typography;

const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export default function AvailabilityIndicator() {
  const { mode } = useSelector(state => state.landingPage.availabilityStatus);
  const timers = useSelector(state => state.landingPage.countdownTimers);
  const selectedProject = useSelector(state => state.landingPage.selectedProject) ;
   const allUnits = useSelector(state => state.landingPage.allUnits);
  
  if(!selectedProject) return null;

  const projectUnits = allUnits.filter(u => u.project_id === selectedProject.project_id);
  const availableCount = projectUnits.filter(u => u.status === 'available').length;
  const totalCount = selectedProject.total_units;
  const availablePercent = (availableCount / totalCount) * 100;
  
  return (
    <Card title="Project Availability Status">
      {mode === 'limited_availability' && (
        <Alert
          message="Limited Availability Mode Active"
          description="Fewer than 20% of units remain. Units are selling fast."
          type="warning"
          showIcon
          className="mb-4"
        />
      )}

      <div className="flex justify-between items-center mb-1">
        <Text strong>Available Units</Text>
        <Text strong>{availableCount} / {totalCount}</Text>
      </div>
      <Progress percent={parseFloat(availablePercent.toFixed(1))} strokeColor={availablePercent < 20 ? '#faad14' : '#52c41a'} />

      {Object.keys(timers).length > 0 && (
        <div className="mt-4 border-t pt-4">
            <Title level={5}>Active Reservations</Title>
            <div className='space-y-2'>
                {Object.entries(timers).map(([unitId, time]) => (
                    <div key={unitId} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                        <Text>Unit <Text strong>{allUnits.find(u=>u.unit_id == unitId)?.unit_number}</Text></Text>
                        <div className="flex items-center gap-2 text-blue-600">
                            <Clock size={16}/>
                            <Text strong className="text-blue-600 font-mono">{formatTime(time)}</Text>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </Card>
  );
}