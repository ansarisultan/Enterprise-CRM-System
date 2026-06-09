import SalesChart from '../components/SalesChart';

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="mt-2 text-slate-600">Visualize sales performance and get quick CRM insights.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Sales Chart</h3>
        <div className="mt-6">
          <SalesChart />
        </div>
      </div>
    </section>
  );
}
