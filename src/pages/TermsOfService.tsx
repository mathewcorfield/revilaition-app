import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-left text-base text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p><strong>Effective Date:</strong> 2nd May 2025</p>
      <p>Please read these Terms of Service ("Terms") carefully before using Revilaition (“we”, “us”, or “our”).</p>
      <p>By accessing or using Revilaition, you agree to these Terms. If you are under 18, you must have a parent or guardian review and accept these Terms on your behalf.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Who Can Use Revilaition</h2>
      <p>Revilaition is designed for:</p>
      <ul className="list-disc list-inside">
        <li>Students aged 15–18</li>
        <li>Their parents or guardians</li>
        <li>Teachers and educators</li>
      </ul>
      <p>To use our platform, you must:</p>
      <ul className="list-disc list-inside">
        <li>Have permission from a parent or guardian if you are under 18</li>
        <li>Agree to use the platform only for educational purposes</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Your Account</h2>
      <p>When you create an account, you agree to:</p>
      <ul className="list-disc list-inside">
        <li>Provide accurate and truthful information</li>
        <li>Keep your login credentials private</li>
        <li>Notify us immediately if you suspect unauthorized use</li>
      </ul>
      <p>We may suspend or remove accounts that violate these Terms or engage in misuse.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul className="list-disc list-inside">
        <li>Post harmful, offensive, or misleading content</li>
        <li>Disrupt or harm the platform</li>
        <li>Attempt to access data or accounts that aren't yours</li>
        <li>Use the app for commercial or non-educational purposes</li>
      </ul>
      <p>We reserve the right to remove content or suspend access if these terms are violated.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Content and Ownership</h2>
      <p>All learning materials, features, and content on Revilaition are protected by intellectual property laws.</p>
      <ul className="list-disc list-inside">
        <li>You may use content for personal, non-commercial educational use only</li>
        <li>You cannot copy, distribute, or resell any part of the app without permission</li>
      </ul>
      <p>User-generated content (e.g. responses or progress logs) remains yours, but by using the app, you grant us permission to process it to provide services.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Privacy</h2>
      <p>Your privacy matters. Please review our <a href="#/privacy-policy" className="text-blue-600 underline">Privacy Policy</a> to understand how we collect and use your data.</p>
      <p>If you are under 18, we do not collect more information than necessary, and we encourage parent or teacher oversight.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Availability and Changes</h2>
      <p>We aim to keep Revilaition running smoothly, but:</p>
      <ul className="list-disc list-inside">
        <li>We may change or remove features at any time</li>
        <li>We may interrupt service for maintenance or improvements</li>
      </ul>
      <p>We are not liable for any disruption or data loss due to technical issues or changes.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Termination</h2>
      <p>We may suspend or terminate your account if:</p>
      <ul className="list-disc list-inside">
        <li>You violate these Terms</li>
        <li>We believe your use risks the safety of others</li>
        <li>You request deletion of your data</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Liability and Disclaimer</h2>
      <p>Revilaition provides educational tools and guidance, but:</p>
      <ul className="list-disc list-inside">
        <li>We cannot guarantee academic results</li>
        <li>We are not responsible for decisions made based on platform feedback</li>
      </ul>
      <p>Use of the app is at your own risk, and we are not liable for indirect or accidental damages.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Governing Law</h2>
      <p>These Terms are governed by the laws of the United Kingdom.</p>
      <p>If a dispute arises, we encourage you to contact us first to resolve it informally.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">10. Contact Us</h2>
      <p>If you have questions about these Terms, please contact us:</p>
      <p>📧 <strong>info@revilaition.com</strong></p>
      <p>🌍 <strong>www.revilaition.com</strong></p>
    </div>
  );
};

export default TermsOfService;
