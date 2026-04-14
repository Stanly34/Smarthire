import React from 'react';

const statusMap = {
  applied:     { label: 'Applied',     className: 'badge-blue' },
  shortlisted: { label: 'Shortlisted', className: 'badge-yellow' },
  rejected:    { label: 'Rejected',    className: 'badge-red' },
  selected:    { label: 'Selected',    className: 'badge-green' },
  open:        { label: 'Open',        className: 'badge-green' },
  closed:      { label: 'Closed',      className: 'badge-gray' },
};

export default function StatusBadge({ status }) {
  const config = statusMap[status] || { label: status, className: 'badge-gray' };
  return <span className={config.className + ' badge'}>{config.label}</span>;
}
