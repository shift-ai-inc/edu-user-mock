import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // デモ用にタイムアウトを設定
    setTimeout(() => {
      // 通常はここでAPI呼び出しを行いますが、モックのためにテスト認証を行います
      if (email === "admin@example.com" && password === "admin123") {
        navigate("/");
      } else {
        setError("メールアドレスまたはパスワードが正しくありません。");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // パスワードリセットのモック
    setTimeout(() => {
      setResetSuccess(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            SHIFT AI管理ポータル
          </h1>
          <p className="text-gray-600 mt-2">
            企業アカウント・契約・アセスメント・サーベイの一元管理
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">ログイン</TabsTrigger>
            <TabsTrigger value="reset">パスワードリセット</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>ログイン</CardTitle>
                <CardDescription>
                  アカウント情報を入力してログインしてください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">メールアドレス</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">パスワード</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "ログイン中..." : "ログイン"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reset">
            <Card>
              <CardHeader>
                <CardTitle>パスワードリセット</CardTitle>
                <CardDescription>
                  登録済みメールアドレスにリセットリンクを送信します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset}>
                  {resetSuccess && (
                    <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>
                        パスワードリセットのリンクを送信しました。メールをご確認ください。
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="reset-email">メールアドレス</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="登録済みのメールアドレス"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || resetSuccess}
                    >
                      {isLoading ? "送信中..." : "リセットリンクを送信"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("login")}
                >
                  ログイン画面に戻る
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
