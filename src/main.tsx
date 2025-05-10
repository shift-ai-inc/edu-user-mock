import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './App';
import Dashboard from './pages/Dashboard.tsx';
import LoginPage from './pages/LoginPage.tsx';
import PasswordResetPage from './pages/PasswordResetPage.tsx';
import AssessmentList from './pages/AssessmentList.tsx';
import AssessmentDetailPage from './pages/AssessmentDetailPage.tsx';
import AssessmentResultsList from './pages/AssessmentResultsList.tsx';
import AssessmentResults from './pages/AssessmentResults.tsx';
import TakeAssessment from './pages/Assessment.tsx';
import SurveyList from './pages/SurveyList.tsx';
import SurveyDetailPage from './pages/SurveyDetailPage.tsx';
import SurveyResultsList from './pages/SurveyResultsList.tsx';
import SurveyResults from './pages/SurveyResults.tsx';
import TakeSurvey from './pages/TakeSurvey.tsx';
import SettingsPage from './pages/SettingsPage.tsx'; // Import the new SettingsPage

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "assessments", element: <AssessmentList /> },
      { path: "assessments/detail/:assessmentId", element: <AssessmentDetailPage /> },
      { path: "assessments/results", element: <AssessmentResultsList /> },
      { path: "assessments/results/:resultId", element: <AssessmentResults /> },
      { path: "assessments/take/:assessmentId", element: <TakeAssessment /> },
      { path: "surveys", element: <SurveyList /> },
      { path: "surveys/detail/:surveyId", element: <SurveyDetailPage /> },
      { path: "surveys/results", element: <SurveyResultsList /> },
      { path: "surveys/results/:resultId", element: <SurveyResults /> },
      { path: "surveys/take/:surveyId", element: <TakeSurvey /> },
      { path: "settings", element: <SettingsPage /> }, // Add route for SettingsPage
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/password-reset",
    element: <PasswordResetPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
)
