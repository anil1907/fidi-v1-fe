import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLogin, MOCK_CREDENTIALS } from "@/store/auth";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Şifre boş olamaz"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(data);
      if (success) {
        setLocation("/");
      } else {
        setError("E-posta veya şifre hatalı");
      }
    } catch (err) {
      setError("Giriş sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const fillMockCredentials = () => {
    form.setValue("email", MOCK_CREDENTIALS.email);
    form.setValue("password", MOCK_CREDENTIALS.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
            <img 
              src="/attached_assets/fidi-logo_1757925085635.jpg" 
              alt="Fidi Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">Fidi</h1>
            <p className="text-muted-foreground">Diyetisyen Yönetim Sistemine Hoş Geldiniz</p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Giriş Yap</CardTitle>
            <CardDescription className="text-center">
              Hesabınıza giriş yapın ve danışanlarınızı yönetmeye başlayın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mock User Info */}
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <AlertDescription className="text-sm">
                <div className="space-y-2">
                  <p className="font-medium">Test için aşağıdaki bilgileri kullanabilirsiniz:</p>
                  <div className="space-y-1 text-xs font-mono bg-blue-100 dark:bg-blue-900 p-2 rounded">
                    <p>E-posta: {MOCK_CREDENTIALS.email}</p>
                    <p>Şifre: {MOCK_CREDENTIALS.password}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={fillMockCredentials}
                    className="w-full"
                    data-testid="button-fill-mock"
                  >
                    Test Bilgilerini Doldur
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@fidi.com"
                  {...form.register("email")}
                  className={form.formState.errors.email ? "border-destructive" : ""}
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive" data-testid="error-email">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("password")}
                    className={`pr-10 ${form.formState.errors.password ? "border-destructive" : ""}`}
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive" data-testid="error-password">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive" data-testid="alert-error">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Giriş Yapılıyor...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Giriş Yap
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Hesabınız yok mu?{" "}
                <Link href="/register" className="text-primary hover:underline" data-testid="link-register">
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}