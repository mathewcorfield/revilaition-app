import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-left text-base text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
      <p><strong>Effective Date:</strong>2nd May 2025</p>

      <p>This Cookie Policy explains how Revilaition (“we”, “our”, or “us”) uses cookies and similar technologies to recognize you when you visit our website or use our app.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit a website. They help us understand how you interact with our app so we can improve your experience.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Why We Use Cookies</h2>
      <ul className="list-disc list-inside">
        <li><strong>Essential Cookies:</strong> Needed for the site to function properly (e.g. login and navigation)</li>
        <li><strong>Performance Cookies:</strong> Help us understand how users use the app (anonymously)</li>
        <li><strong>Functional Cookies:</strong> Remember your preferences (e.g. dark mode or subject selections)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Managing Cookies</h2>
      <p>You can control or delete cookies through your browser settings. You may also choose to disable non-essential cookies when you first visit the app using the cookie banner.</p>

      <p>Note: Disabling cookies may affect your experience and some features might not work as intended.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Third-Party Cookies</h2>
      <p>We may use third-party services (e.g., analytics providers) that set their own cookies to help us monitor usage and improve the platform.</p>
      <p>We do not allow third parties to use cookies for advertising or profiling our users, especially given that many are under 18.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to This Policy</h2>
      <p>We may update this Cookie Policy occasionally. Any updates will be posted on this page with a revised date at the top.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p>If you have questions about this policy, please contact us:</p>
      <p>📧 <strong>info@revilaition.com</strong></p>
      <p>🌍 <strong>www.revilaition.com</strong></p>
    </div>
  );
};

export default CookiePolicy;
