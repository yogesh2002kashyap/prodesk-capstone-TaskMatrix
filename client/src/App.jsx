import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import KanbanPage from './pages/KanbanPage';
import HeatmapPage from './pages/HeatmapPage';

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/board"
            element={
              <ProtectedRoute>
                <KanbanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/heatmap"
            element={
              <ProtectedRoute>
                <HeatmapPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;