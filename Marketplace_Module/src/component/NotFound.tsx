import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="dark flex h-screen w-full flex-col items-center justify-center gap-6 bg-background">
      <h1 className="text-8xl font-bold text-primary cookie-text">404</h1>
      <p className="text-2xl font-semibold text-foreground cookie-text">Page Not Found</p>
      <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
      <Button onClick={() => navigate("/")} className="rounded-full px-8">
        Back to Home
      </Button>
    </div>
  );
}
