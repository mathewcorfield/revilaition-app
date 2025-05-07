import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ErrorFallback = () => {
  return (
    <div className="h-screen flex items-center justify-center p-4 bg-muted">
      <Alert variant="destructive" className="max-w-md text-center">
        <AlertTriangle className="w-6 h-6 mb-2 mx-auto text-red-600" />
        <AlertTitle>Something went wrong.</AlertTitle>
        <AlertDescription>
          An unexpected error occurred. We are still building our application so please be patient.
          If you need urgent support, please contact us at <a href="mailto:support@revilaition.com" className="text-blue-500">support@example.com</a>.
        </AlertDescription>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </Alert>
    </div>
  );
};

export default ErrorFallback;
