import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Enterprise CRM</h1>
              <p className="text-sm text-slate-500">React, Tailwind, Router, Axios, Chart.js</p>
            </div>
            <nav className="flex gap-3">
              <NavLink className={({ isActive }) => isActive ? 'rounded-lg bg-slate-900 px-4 py-2 text-white' : 'rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100'} to="/">Home</NavLink>
              <NavLink className={({ isActive }) => isActive ? 'rounded-lg bg-slate-900 px-4 py-2 text-white' : 'rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100'} to="/dashboard">Dashboard</NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
