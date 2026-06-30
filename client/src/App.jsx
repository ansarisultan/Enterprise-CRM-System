import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import CustomCursor from './components/ui/CustomCursor';
import { useAuth } from './context/AuthContext';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Leads = React.lazy(() => import('./pages/Leads'));
const AddLead = React.lazy(() => import('./pages/AddLead'));
const EditLead = React.lazy(() => import('./pages/EditLead'));
const Login = React.lazy(() => import('./pages/Login'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PageLoader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin mx-auto" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary-500/10 animate-ping mx-auto" />
      </div>
      <p className="text-slate-400 mt-4">Loading page...</p>
    </div>
  </div>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-dark-900">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/leads" element={<Leads />} />
                <Route 
                  path="/leads/add" 
                  element={
                    <ProtectedRoute>
                      <AddLead />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/leads/edit/:id" 
                  element={
                    <ProtectedRoute>
                      <EditLead />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
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
