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
import { Link } from "react-router-dom"; // Import Link for navigation

const PasswordResetPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">パスワード再設定</CardTitle>
          <CardDescription>
            パスワード再設定リンクを受け取るためにメールアドレスを入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full">再設定リンクを送信</Button>
           <div className="mt-4 text-center text-sm">
            ログインページに戻る{' '}
            <Link to="/login" className="underline">
              ログイン
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordResetPage;
