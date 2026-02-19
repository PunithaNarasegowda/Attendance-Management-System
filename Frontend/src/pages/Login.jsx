import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import Alert from '../components/Alert';
import { UserCircle, Users, GraduationCap } from 'lucide-react';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const { login } = useAuth();

  const handleRoleLogin = async (role) => {
    setLoading(true);
    setError('');

    const result = await login({ role });
    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login({ email, password });
    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">NIT Hamirpur</CardTitle>
          <CardDescription>Student Attendance Management System</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
          )}

          {!showEmailLogin ? (
            <div className="space-y-4">
              <Button
                variant="default"
                className="w-full flex items-center justify-center py-4 text-lg"
                disabled={loading}
                onClick={() => handleRoleLogin('admin')}
              >
                <UserCircle size={24} className="mr-3" />
                Login as Admin
              </Button>

              <Button
                variant="secondary"
                className="w-full flex items-center justify-center py-4 text-lg"
                disabled={loading}
                onClick={() => handleRoleLogin('faculty')}
              >
                <Users size={24} className="mr-3" />
                Login as Faculty
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center py-4 text-lg"
                disabled={loading}
                onClick={() => handleRoleLogin('student')}
              >
                <GraduationCap size={24} className="mr-3" />
                Login as Student
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="link"
                className="w-full"
                onClick={() => setShowEmailLogin(true)}
              >
                Sign in with email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => setShowEmailLogin(false)}
              >
                Back to role selection
              </Button>
            </form>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">Development Mode</p>
            <p className="text-xs text-blue-700">⚠️ No authentication required - select a role to continue</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
