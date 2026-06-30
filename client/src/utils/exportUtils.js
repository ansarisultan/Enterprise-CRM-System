import toast from 'react-hot-toast';

export const exportToJSON = (data, filename = 'leads_export') => {
  if (!data || data.length === 0) {
    toast.error('No leads available to export.');
    return;
  }
  
  const toastId = toast.loading('Exporting to JSON...');
  
  try {
    const cleanData = data.map(({ _id, name, email, phone, company, status, createdAt }) => ({
      id: _id,
      name,
      email,
      phone,
      company,
      status,
      createdAt
    }));
    
    const blob = new Blob([JSON.stringify(cleanData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Successfully exported to JSON! 📄', { id: toastId });
  } catch (error) {
    console.error('JSON export failed:', error);
    toast.error('Failed to export to JSON.', { id: toastId });
  }
};

export const exportToCSV = (data, filename = 'leads_export') => {
  if (!data || data.length === 0) {
    toast.error('No leads available to export.');
    return;
  }
  
  const toastId = toast.loading('Exporting to CSV...');
  
  try {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Created At'];
    
    const rows = data.map(lead => [
      lead._id || '',
      lead.name || '',
      lead.email || '',
      lead.phone || '',
      lead.company || '',
      lead.status || '',
      lead.createdAt ? new Date(lead.createdAt).toISOString() : ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(val => {
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Successfully exported to CSV! 📊', { id: toastId });
  } catch (error) {
    console.error('CSV export failed:', error);
    toast.error('Failed to export to CSV.', { id: toastId });
  }
};
