const statusMap = {
  'New': 'badge-new',
  'Contacted': 'badge-contacted',
  'Qualified': 'badge-qualified',
  'Won': 'badge-won',
  'Lost': 'badge-lost',
};

export default function StatusBadge({ status }) {
  return (
    <span className={statusMap[status] || 'badge'}>
      {status}
    </span>
  );
}
