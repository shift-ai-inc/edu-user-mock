import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import { Layout } from './App';
// import Dashboard from './pages/Dashboard'; // Removed Dashboard import
import AssessmentList from './pages/AssessmentList';
import AssessmentPage from './pages/Assessment';
import AssessmentResultsList from './pages/AssessmentResultsList';
import AssessmentResults from './pages/AssessmentResults';
import AssessmentDetailPage from './pages/AssessmentDetailPage'; 
import SurveyList from './pages/SurveyList';
import SurveyResultsList from './pages/SurveyResultsList';
import SurveyDetailPage from './pages/SurveyDetailPage'; 
import TakeSurvey from './pages/TakeSurvey'; 
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage'; 
import PasswordResetPage from './pages/PasswordResetPage'; 

import './index.css'; // Global styles
import { Toaster } from "@/components/ui/toaster";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <AssessmentList /> }, // Changed to AssessmentList
      {
        path: "assessments",
        children: [
          { index: true, element: <AssessmentList /> },
          { path: "take/:assessmentId", element: <AssessmentPage /> },
          { path: "results", element: <AssessmentResultsList /> },
          { path: "results/:assessmentId", element: <AssessmentResults /> }, 
          { path: "detail/:assessmentId", element: <AssessmentDetailPage /> },
        ],
      },
      {
        path: "surveys",
        children: [
          { index: true, element: <SurveyList /> },
          { path: "take/:surveyId", element: <TakeSurvey /> }, 
          { path: "results", element: <SurveyResultsList /> },
          { path: "results/:surveyResultId", element: <SurveyDetailPage /> }, 
          { path: "detail/:surveyId", element: <SurveyDetailPage /> },
        ],
      },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> }, 
  { path: "/password-reset", element: <PasswordResetPage /> }, 
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
);
