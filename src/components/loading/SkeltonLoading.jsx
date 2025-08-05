import React from 'react';
import { Skeleton } from 'antd';

const SkeltonLoading = ({ rows = 20, active = true }) => {
  return <Skeleton active={active} paragraph={{ rows }} />;
};

export default SkeltonLoading;
