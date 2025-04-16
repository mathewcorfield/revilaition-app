
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from '@/components/ui/checkbox';

const SignupForm: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isInterested, setIsInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      });
      
      // Reset form
      setEmail('');
      setName('');
      setRole('');
      setIsInterested(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6">Join our waitlist</h3>
      <p className="text-gray-600 mb-6">Be among the first to experience our AI-powered study assistant.</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <Label htmlFor="role">I am a</Label>
          <select 
            id="role"
            className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>Select your role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="other">Other</option>
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
          {isLoading ? "Submitting..." : "Join Waitlist"}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
