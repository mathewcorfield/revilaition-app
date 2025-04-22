import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Welcome back!', description: `Logged in as ${email}` });

    // 👇 Navigate to main app/dashboard
    window.location.href = '/dashboard';
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit">Log In</Button>
    </form>
  );
};

export default LoginForm;
