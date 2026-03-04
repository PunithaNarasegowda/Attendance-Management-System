import { useState } from 'react';
import { supabase } from '../../utils/supabase-client';
import { projectId } from '/utils/supabase/info';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage({ onLogin, onShowSetup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Login failed: ${error.message}`);
        return;
      }

      if (data.session) {
        localStorage.setItem('accessToken', data.session.access_token);
        
        // Get user profile to determine role
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-005ee2bb/admin/users`, {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`,
          },
        });
        
        const userData = await response.json();
        const currentUser = userData.users?.find((u) => u.id === data.user.id);
        
        if (currentUser) {
          onLogin(data.user.id, currentUser.role);
          toast.success('Login successful!');
        } else {
          toast.error('User profile not found');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#1a237e] p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">NIT Hamirpur</CardTitle>
          <CardDescription>Student Attendance Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@nith.ac.in"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#1a237e] hover:bg-[#283593]" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 mb-2">New User?</p>
            <p className="text-xs text-blue-700">Contact admin to create your account</p>
          </div>
          {onShowSetup && (
            <div className="mt-4">
              <Button variant="link" onClick={onShowSetup} className="w-full text-sm">
                First time setup? Create admin account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
