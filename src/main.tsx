import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import React from 'react';
console.log("Before RootElement");
const rootElement = document.getElementById('root');
console.log("App initialization started");
console.log("Root element:", rootElement);

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('React ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something broke: {String(this.state.error)}</div>;
    }

    return this.props.children;
  }
}

if (rootElement) {
  console.log("Before rendering App");
  createRoot(rootElement).render(
    <StrictMode>
      <HashRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HashRouter>
    </StrictMode>
  );
  console.log("App rendered successfully");
} else {
  throw new Error('Root element not found');
}
