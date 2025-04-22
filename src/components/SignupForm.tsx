_import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

type Role = 'student' | 'teacher' | 'parent';

const SignupForm: React.FC = () => {
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [isInterested, setIsInterested] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sign up user via Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        toast({ title: 'Signup Failed', description: signUpError.message, variant: 'destructive' });
        return;
      }

      const user = authData.user;
      if (!user) {
        toast({ title: 'Error', description: 'No user returned from Supabase.' });
        return;
      }

      // 2. Insert user into public "users" table
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: user.user_id,
          full_name: fullName,
          role: role,
        },
      ]);

      if (insertError) {
        toast({ title: 'Database Error', description: insertError.message, variant: 'destructive' });
        return;
      }

      toast({
        title: 'Success!',
        description: 'Account created. Check your email to confirm.',
      });

      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setRole('student');
      setIsInterested(true);
    } catch (err) {
      console.error(err);
      toast({ title: 'Unexpected Error', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6">Join our waitlist</h3>
      <p className="text-gray-600 mb-6">Be among the first to experience our AI-powered study assistant.</p>

      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">I am a</Label>
          <select
            id="role"
            className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="interest"
            checked={isInterested}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') {
                setIsInterested(checked);
              }
            }}
          />
          <Label htmlFor="interest" className="text-sm text-gray-600">
            I'm interested in beta testing the platform
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-purple hover:bg-brand-darkPurple"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Join Waitlist'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
