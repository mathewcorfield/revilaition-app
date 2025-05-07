import React from "react";
import { Link } from "react-router-dom";

const TermsAndPrivacy = ({ isLogin }: { isLogin: boolean }) => {
  return (
    !isLogin && (
      <div className="mt-4 text-sm text-center text-muted-foreground">
        <p>By signing up you agree to our</p>
        <div className="mt-2 text-center">
          <Link to="/terms-of-service" className="text-blue-500 hover:underline">
            Terms of Service
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link to="/privacy-policy" className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    )
  );
};

export default TermsAndPrivacy;
