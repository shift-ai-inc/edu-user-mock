import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleLogin = () => {
    // Navigate to the dashboard without validation
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">ログイン</CardTitle>
          <CardDescription>
            アカウントにログインするためにメールアドレスとパスワードを入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">パスワード</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          {/* Add onClick handler to the button */}
          <Button className="w-full" onClick={handleLogin}>
            ログイン
          </Button>
          <div className="mt-4 text-center text-sm">
            パスワードをお忘れですか？{' '}
            <Link to="/reset-password" className="underline">
              パスワード再設定
            </Link>
          </div>
          {/* Optional: Add link to sign up if needed */}
          {/* <div className="mt-2 text-center text-sm">
            アカウントをお持ちでないですか？{' '}
            <Link to="/signup" className="underline">
              新規登録
            </Link>
          </div> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
