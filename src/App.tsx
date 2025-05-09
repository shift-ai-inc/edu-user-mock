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
  FileText, 
  BarChart4, 
  ChevronDown, 
  ChevronRight, 
} from "lucide-react";
import { useState, useEffect } from "react"; 
import Dashboard from "@/pages/Dashboard";
import SurveyList from "@/pages/SurveyList";
import TakeSurvey from "@/pages/TakeSurvey";
import SurveyResults from "@/pages/SurveyResults";
import SurveyResultsList from "@/pages/SurveyResultsList";
import SurveyDetailPage from "@/pages/SurveyDetailPage"; // Import Survey Detail Page
import AssessmentPage from "@/pages/Assessment";
import AssessmentList from "@/pages/AssessmentList";
import AssessmentResults from "@/pages/AssessmentResults";
import AssessmentResultsList from "@/pages/AssessmentResultsList";
import AssessmentDetailPage from "@/pages/AssessmentDetailPage"; 
import LoginPage from "@/pages/LoginPage"; 
import PasswordResetPage from "@/pages/PasswordResetPage"; 

const sidebarItems = [
  { icon: BarChart3, label: "ダッシュボード", path: "/" },
  {
    icon: FileText, 
    label: "アセスメント",
    basePath: "/assessments", 
    subItems: [
      { label: "アセスメント一覧", path: "/assessments" },
      { label: "結果一覧", path: "/assessments/results" },
    ],
  },
  {
    icon: BarChart4, 
    label: "サーベイ",
    basePath: "/surveys", 
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
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const activeParent = sidebarItems.find(
      (item) => item.basePath && currentPath.startsWith(item.basePath)
    );
    setOpenDropdown(activeParent?.basePath ?? null);
  }, [currentPath]); 


  const isActiveParent = (basePath: string | undefined) => {
    if (!basePath) return false; 
    return currentPath.startsWith(basePath);
  };

  const isActiveSubItem = (path: string) => {
    if (currentPath === path) return true;

    if (path === "/assessments" && (currentPath.startsWith("/assessments/take/") || currentPath.startsWith("/assessments/detail/"))) {
      return true;
    }
    if (path === "/assessments/results" && currentPath.startsWith("/assessments/results/")) {
      return true; 
    }
    if (path === "/surveys" && (currentPath.startsWith("/surveys/take/") || currentPath.startsWith("/surveys/detail/"))) { 
      return true; 
    }
    if (path === "/surveys/results" && currentPath.startsWith("/surveys/results/")) {
      return true; 
    }

    return false;
  };

  const handleParentClick = (item: (typeof sidebarItems)[0]) => {
    if (item.subItems && item.basePath) {
      setOpenDropdown(openDropdown === item.basePath ? null : item.basePath);
    } else if (item.path) {
      navigate(item.path);
      setOpenDropdown(null); 
    }
  };

  const isLoginPage = currentPath === "/login";
  const isPasswordResetPage = currentPath === "/reset-password";
  const isTakingAssessment = currentPath.startsWith("/assessments/take/");
  const isTakingSurvey = currentPath.startsWith("/surveys/take/");
  const isViewingAssessmentDetail = currentPath.startsWith("/assessments/detail/");
  const isViewingSurveyDetail = currentPath.startsWith("/surveys/detail/"); // For Survey Detail Page

  const showSidebar =
    !isLoginPage &&
    !isPasswordResetPage &&
    !isTakingAssessment &&
    !isTakingSurvey &&
    !isViewingAssessmentDetail &&
    !isViewingSurveyDetail; // Hide sidebar on survey detail page as well

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/login")} 
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {showSidebar && ( 
        <aside className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg pt-16 overflow-y-auto z-10 print:hidden">
          <nav className="p-4">
            {sidebarItems.map((item, index) => (
              <div key={index} className="mb-1">
                <Button
                  variant={
                    (item.path && currentPath === item.path) || 
                    (item.basePath &&
                      isActiveParent(item.basePath) &&
                      !item.subItems) || 
                    (item.basePath &&
                      isActiveParent(item.basePath) &&
                      item.subItems &&
                      openDropdown === item.basePath) 
                      ? "secondary"
                      : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => handleParentClick(item)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.subItems && ( 
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
                  openDropdown === item.basePath && ( 
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
          <Route path="/surveys/detail/:id" element={<SurveyDetailPage />} /> {/* New Survey Detail Route */}
          <Route path="/surveys/results/:id" element={<SurveyResults />} />
          <Route path="/surveys/results" element={<SurveyResultsList />} />
          <Route
            path="/surveys/create"
            element={<div className="p-8">サーベイ作成ページ（実装予定）</div>}
          />

          {/* アセスメント関連 */}
          <Route path="/assessments" element={<AssessmentList />} />
          <Route path="/assessments/take/:id" element={<AssessmentPage />} />
          <Route path="/assessments/detail/:id" element={<AssessmentDetailPage />} /> 
          <Route
            path="/assessments/results/:id"
            element={<AssessmentResults />}
          />
          <Route
            path="/assessments/results"
            element={<AssessmentResultsList />}
          />
          
          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />

          {/* Not Found - Redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
