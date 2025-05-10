import {
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  BarChart4,
  ChevronDown,
  ChevronRight,
  Menu,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  { icon: Settings, label: "設定", path: "/settings" },
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [openDropdown, setOpenDropdown] = useState<string[]>(() =>
    sidebarItems
      .filter((item) => item.subItems && item.basePath)
      .map((item) => item.basePath!)
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    if (path === "/settings" && currentPath === "/settings") {
        return true;
    }


    return false;
  };

  const handleParentClick = (item: (typeof sidebarItems)[0]) => {
    if (item.subItems && item.basePath) {
      setOpenDropdown((prevOpen) =>
        prevOpen.includes(item.basePath!)
          ? prevOpen.filter((path) => path !== item.basePath)
          : [...prevOpen, item.basePath!]
      );
    } else if (item.path) {
      navigate(item.path);
    }
    setIsMobileSidebarOpen(false);
  };

  const handleSubItemClick = (path: string) => {
    navigate(path);
    setIsMobileSidebarOpen(false);
  }

  const isTakingAssessment = currentPath.startsWith("/assessments/take/");
  const isTakingSurvey = currentPath.startsWith("/surveys/take/");

  const showDesktopSidebar =
    !isTakingAssessment &&
    !isTakingSurvey;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-900">
          SHIFT AI管理ポータル
        </h1>
      </div>
      <nav className="flex-grow p-4 overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <div key={index} className="mb-1">
            <Button
              variant={
                (item.path && isActiveSubItem(item.path)) ||
                (item.basePath &&
                  isActiveParent(item.basePath) &&
                  item.subItems &&
                  openDropdown.includes(item.basePath)) 
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
              onClick={() => handleParentClick(item)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
              {item.subItems && item.basePath && (
                <span className="ml-auto">
                  {openDropdown.includes(item.basePath) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
              )}
            </Button>

            {item.subItems && item.basePath && openDropdown.includes(item.basePath) && (
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
                      onClick={() => handleSubItemClick(subItem.path)}
                    >
                      {subItem.label}
                    </Button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-100 flex">
      {showDesktopSidebar && (
        <aside className="hidden md:flex fixed left-0 top-0 w-64 h-full bg-white shadow-lg flex-col print:hidden">
          <SidebarContent />
        </aside>
      )}

      <header className="md:hidden fixed top-0 left-0 right-0 bg-white shadow h-16 flex items-center justify-between px-4 z-20 print:hidden">
        <h1 className="text-lg font-semibold text-gray-900">
          SHIFT AI
        </h1>
        {showDesktopSidebar && ( 
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        )}
      </header>
      
      <main
        className={`flex-grow ${
          showDesktopSidebar ? "md:pl-64" : "pl-0"
        } pt-16 md:pt-0 print:pt-0 print:pl-0`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export { Layout };
