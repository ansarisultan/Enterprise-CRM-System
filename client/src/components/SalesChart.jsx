import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales Revenue',
      data: [4200, 5300, 4800, 6200, 7100, 7800],
      fill: false,
      borderColor: '#0f172a',
      backgroundColor: '#0f172a',
      tension: 0.3
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Quarterly CRM Sales'
    }
  }
};

export default function SalesChart() {
  return <Line data={data} options={options} />;
}
