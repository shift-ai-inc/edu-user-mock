import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import { Layout } from './App';
import Dashboard from './pages/Dashboard';
import AssessmentList from './pages/AssessmentList';
import AssessmentPage from './pages/Assessment';
import AssessmentResultsList from './pages/AssessmentResultsList';
import AssessmentResults from './pages/AssessmentResults';
import AssessmentDetailPage from './pages/AssessmentDetailPage'; // Added for completeness
import SurveyList from './pages/SurveyList';
import SurveyResultsList from './pages/SurveyResultsList';
import SurveyDetailPage from './pages/SurveyDetailPage'; // Added for completeness
import TakeSurvey from './pages/TakeSurvey'; // Added for completeness
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage'; // Assuming you have a login page
import PasswordResetPage from './pages/PasswordResetPage'; // Assuming this page

import './index.css'; // Global styles
import { Toaster } from "@/components/ui/toaster";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "assessments",
        children: [
          { index: true, element: <AssessmentList /> },
          { path: "take/:assessmentId", element: <AssessmentPage /> },
          { path: "results", element: <AssessmentResultsList /> },
          { path: "results/:assessmentId", element: <AssessmentResults /> }, // Ensures :assessmentId is used
          { path: "detail/:assessmentId", element: <AssessmentDetailPage /> },
        ],
      },
      {
        path: "surveys",
        children: [
          { index: true, element: <SurveyList /> },
          { path: "take/:surveyId", element: <TakeSurvey /> }, // Matched param name with component if needed
          { path: "results", element: <SurveyResultsList /> },
          { path: "results/:surveyResultId", element: <SurveyDetailPage /> }, // Example, adjust if SurveyResultDetail page exists
          { path: "detail/:surveyId", element: <SurveyDetailPage /> },
        ],
      },
      { path: "settings", element: <SettingsPage /> },
      // Add other pages accessible within the Layout if any
      // e.g. Profile, Company Management etc. based on your sidebar/navigation needs
    ],
  },
  { path: "/login", element: <LoginPage /> }, // Login page outside main layout
  { path: "/password-reset", element: <PasswordResetPage /> }, // Password reset outside main layout
  // Add any other top-level routes here
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
);
