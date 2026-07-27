import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ExamSessionProvider } from './context/ExamSessionContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExamListPage } from './pages/ExamListPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { ExamEnginePage } from './pages/ExamEnginePage';
import { ExamResultsPage } from './pages/ExamResultsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UserManagementPage } from './pages/UserManagementPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-700 font-mono text-sm">
        Authenticating NTMS Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
};

const ExamSessionLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-700 font-mono text-sm">
        Loading Pearson VUE Exam Environment...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">{children}</div>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExamSessionProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedLayout>
                    <DashboardPage />
                  </ProtectedLayout>
                }
              />

              <Route
                path="/exams"
                element={
                  <ProtectedLayout>
                    <ExamListPage />
                  </ProtectedLayout>
                }
              />

              <Route
                path="/questions"
                element={
                  <ProtectedLayout>
                    <QuestionBankPage />
                  </ProtectedLayout>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedLayout>
                    <AnalyticsPage />
                  </ProtectedLayout>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedLayout>
                    <UserManagementPage />
                  </ProtectedLayout>
                }
              />

              {/* Pearson VUE Dedicated Full-Screen Exam Session View */}
              <Route
                path="/exam-session/:attemptId"
                element={
                  <ExamSessionLayout>
                    <ExamEnginePage />
                  </ExamSessionLayout>
                }
              />

              <Route
                path="/results/:attemptId"
                element={
                  <ProtectedLayout>
                    <ExamResultsPage />
                  </ProtectedLayout>
                }
              />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </ExamSessionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
