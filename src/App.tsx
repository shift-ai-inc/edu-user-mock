import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Bell,
  User,
  FileText, // Keep for Assessments
  BarChart4, // Keep for Surveys
  ChevronDown, // Icon for dropdown indicator
  ChevronRight, // Icon for non-active dropdown
} from "lucide-react";
import { useState } from "react"; // Import useState for managing dropdown state
import Dashboard from "@/pages/Dashboard";
import SurveyList from "@/pages/SurveyList";
import TakeSurvey from "@/pages/TakeSurvey";
import SurveyResults from "@/pages/SurveyResults";
import SurveyResultsList from "@/pages/SurveyResultsList";
import AssessmentPage from "@/pages/Assessment";
import AssessmentList from "@/pages/AssessmentList";
import AssessmentResults from "@/pages/AssessmentResults";
import AssessmentResultsList from "@/pages/AssessmentResultsList";
import LoginPage from "@/pages/LoginPage"; // Import Login Page
import PasswordResetPage from "@/pages/PasswordResetPage"; // Import Password Reset Page

// Updated sidebar items structure
const sidebarItems = [
  { icon: BarChart3, label: "ダッシュボード", path: "/" },
  {
    icon: FileText, // Icon for Assessments
    label: "アセスメント",
    basePath: "/assessments", // Base path for highlighting parent
    subItems: [
      { label: "アセスメント一覧", path: "/assessments" },
      // { label: "新規作成", path: "/assessments/create" }, // Keep commented or remove
      { label: "結果一覧", path: "/assessments/results" },
    ],
  },
  {
    icon: BarChart4, // Icon for Surveys
    label: "サーベイ",
    basePath: "/surveys", // Base path for highlighting parent
    subItems: [
      { label: "サーベイ一覧", path: "/surveys" },
      { label: "結果一覧", path: "/surveys/results" },
    ],
  },
];

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  // State to manage which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(() => {
    // Initialize open dropdown based on current path
    const activeParent = sidebarItems.find(
      (item) => item.basePath && currentPath.startsWith(item.basePath)
    ); // Corrected &&
    return activeParent?.basePath ?? null;
  });

  const isActiveParent = (basePath: string | undefined) => {
    if (!basePath) return false; // Dashboard has no basePath for subitems
    return currentPath.startsWith(basePath);
  };

  const isActiveSubItem = (path: string) => {
    // Exact match is the primary condition
    if (currentPath === path) return true;

    // Handle detail pages activating their corresponding list item visually
    if (
      path === "/assessments/results" &&
      currentPath.startsWith("/assessments/results/")
    ) {
      // Corrected &&
      return true; // Highlight results list when viewing a specific result detail
    }
    if (
      path === "/surveys/results" &&
      currentPath.startsWith("/surveys/results/")
    ) {
      // Corrected &&
      return true; // Highlight results list when viewing a specific result detail
    }
    if (
      path === "/assessments" &&
      currentPath.startsWith("/assessments/take/")
    ) {
      // Corrected &&
      return true; // Highlight assessment list when taking an assessment
    }
    if (path === "/surveys" && currentPath.startsWith("/surveys/take/")) {
      // Corrected &&
      return true; // Highlight survey list when taking a survey
    }

    return false; // Default no match
  };

  const handleParentClick = (item: (typeof sidebarItems)[0]) => {
    if (item.subItems && item.basePath) {
      // Corrected &&
      // Toggle dropdown for items with subItems
      setOpenDropdown(openDropdown === item.basePath ? null : item.basePath);
    } else if (item.path) {
      // Navigate directly for items without subItems (like Dashboard)
      navigate(item.path);
      setOpenDropdown(null); // Close any open dropdown
    }
  };

  // Determine if sidebar should be shown
  const isLoginPage = currentPath === "/login";
  const isPasswordResetPage = currentPath === "/reset-password";
  const isTakingAssessment = currentPath.startsWith("/assessments/take/");
  const isTakingSurvey = currentPath.startsWith("/surveys/take/");
  const showSidebar =
    !isLoginPage &&
    !isPasswordResetPage &&
    !isTakingAssessment &&
    !isTakingSurvey; // Corrected &&

  // If it's a page without the main layout (like login), render only children
  if (isLoginPage || isPasswordResetPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow fixed w-full z-20 print:hidden">
        <div className="flex justify-between items-center px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            SHIFT AI管理ポータル
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            {/* Update User button to navigate to login */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/login")} // Navigate to login on click
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {showSidebar && ( // Corrected &&
        <aside className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg pt-16 overflow-y-auto z-10 print:hidden">
          <nav className="p-4">
            {sidebarItems.map((item, index) => (
              <div key={index} className="mb-1">
                <Button
                  variant={
                    (item.path && currentPath === item.path) || // Corrected &&
                    (item.basePath &&
                      isActiveParent(item.basePath) &&
                      !item.subItems) || // Corrected &&
                    (item.basePath &&
                      isActiveParent(item.basePath) &&
                      item.subItems &&
                      openDropdown === item.basePath) // Corrected &&
                      ? "secondary"
                      : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => handleParentClick(item)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.subItems && ( // Corrected &&
                    <span className="ml-auto">
                      {openDropdown === item.basePath ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </Button>

                {item.subItems &&
                  openDropdown === item.basePath && ( // Corrected &&
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                      {item.subItems.map((subItem, subIndex) => (
                        <Button
                          key={subIndex}
                          variant={
                            isActiveSubItem(subItem.path)
                              ? "secondary"
                              : "ghost"
                          }
                          size="sm"
                          className={`w-full justify-start text-sm ${
                            isActiveSubItem(subItem.path)
                              ? "bg-gray-100 font-semibold"
                              : ""
                          }`}
                          onClick={() => navigate(subItem.path)}
                        >
                          {subItem.label}
                        </Button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </aside>
      )}

      <main
        className={`pt-16 ${
          showSidebar ? "pl-64" : "pl-0"
        } print:pt-0 print:pl-0`}
      >
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main application routes */}
          <Route path="/" element={<Dashboard />} />

          {/* サーベイ関連 */}
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/surveys/take/:id" element={<TakeSurvey />} />
          <Route path="/surveys/results/:id" element={<SurveyResults />} />
          <Route path="/surveys/results" element={<SurveyResultsList />} />
          {/* Restored the route for /surveys/create */}
          <Route
            path="/surveys/create"
            element={<div className="p-8">サーベイ作成ページ（実装予定）</div>}
          />

          {/* アセスメント関連 */}
          <Route path="/assessments" element={<AssessmentList />} />
          <Route path="/assessments/take/:id" element={<AssessmentPage />} />
          <Route
            path="/assessments/results/:id"
            element={<AssessmentResults />}
          />
          <Route
            path="/assessments/results"
            element={<AssessmentResultsList />}
          />
          {/* <Route
            path="/assessments/create"
            element={<div className="p-8">アセスメント作成ページ（実装予定）</div>}
          /> */}

          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />

          {/* Not Found - Redirect to Dashboard (or login if not authenticated in future) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
