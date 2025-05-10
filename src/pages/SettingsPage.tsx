import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real application, you would also clear any auth tokens or session data here
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">設定</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">ここは設定ページです。今後、各種設定オプションが追加されます。</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">アカウント</h3>
            {/* Placeholder for account related settings */}
            <p className="text-sm text-muted-foreground mb-3">アカウント情報の編集やパスワード変更など。</p>
            {/* Add more account settings components here if needed */}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">通知</h3>
            {/* Placeholder for notification settings */}
            <p className="text-sm text-muted-foreground mb-3">通知設定のカスタマイズ。</p>
            {/* Add more notification settings components here if needed */}
          </div>

          <hr className="my-6" />

          <div>
            <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              ログアウトすると、ログインページに戻ります。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
