import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import AddLead from './pages/AddLead';
import EditLead from './pages/EditLead';
import CustomCursor from './components/ui/CustomCursor';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-dark-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/leads/add" element={<AddLead />} />
              <Route path="/leads/edit/:id" element={<EditLead />} />
            </Routes>
          </main>
        </div>
        <CustomCursor />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(10,15,36,0.95)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
