import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import Alert from '../components/Alert';
import { GraduationCap } from 'lucide-react';
import loginIllustrationSvg from '../assets/login-illustration (2).svg?raw';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const syncedIllustrationSvg = loginIllustrationSvg
    .replaceAll('#6c63ff', '#7C5CFC')
    .replaceAll('#6C63FF', '#7C5CFC')
    .replaceAll('#BA68C8', '#7C5CFC')
    .replaceAll('#ba68c8', '#7C5CFC')
    // The "WWW" mark in this SVG is drawn as paths (not a <text> node).
    // Hide that group and overlay "AMS" in the same spot.
    .replace(
      '<g id="freepik--www--inject-76">',
      '<g id="freepik--www--inject-76" style="display:none">',
    )
    .replace(
      '</g></g></g><g id="freepik--Server--inject-76">',
      '</g><g id="ams-label--inject-76"><rect x="290" y="227" width="58" height="26" rx="8" fill="#ffffff" opacity="0.85"/><text x="319" y="245" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="16" font-weight="800" fill="#7C5CFC">AMS</text></g></g></g><g id="freepik--Server--inject-76">',
    );

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
    <div className="min-h-screen w-full bg-white text-[#1A1A1A]">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 overflow-hidden rounded-3xl border border-[rgba(124,92,252,0.18)] bg-white shadow-[0_20px_60px_rgba(124,92,252,0.14)]">
          {/* Darker edge vignette for clearer separation */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-[rgba(0,0,0,0.10)] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_30px_80px_rgba(0,0,0,0.22)]" />
          {/* Left: content */}
          <div className="lg:col-span-3 flex items-center justify-center p-6 sm:p-10 bg-white">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <div className="size-12 rounded-2xl bg-[rgba(124,92,252,0.12)] border border-[rgba(124,92,252,0.22)] flex items-center justify-center">
                  <GraduationCap className="size-6 text-[#7C5CFC]" />
                </div>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-3xl font-semibold tracking-tight">NIT Hamirpur</h1>
                <p className="mt-2 text-sm text-[#717171]">Student Attendance Management System</p>
              </div>

              {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
              )}

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-[#717171]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@yourdomain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#F7F7FB] border-[rgba(0,0,0,0.08)] text-[#1A1A1A] placeholder:text-[#717171] focus-visible:border-[#7C5CFC] focus-visible:ring-[rgba(124,92,252,0.20)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-[#717171]">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#F7F7FB] border-[rgba(0,0,0,0.08)] text-[#1A1A1A] placeholder:text-[#717171] focus-visible:border-[#7C5CFC] focus-visible:ring-[rgba(124,92,252,0.20)]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-[12px] bg-[#7C5CFC] text-white hover:bg-[#7C5CFC]/90 hover:shadow-[0_0_0_4px_rgba(124,92,252,0.22)]"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </div>

          {/* Right: visual (hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-2 relative overflow-hidden">
            {/* Clean light base */}
            <div className="absolute inset-0 bg-white" />

            {/* Nested ripple layers (lavender-only, soft depth) */}
            <div className="absolute -right-28 top-1/2 -translate-y-1/2 size-[560px] rounded-full bg-[#DAD0FF] opacity-[0.27] shadow-[0_18px_60px_rgba(90,70,160,0.10)]" />
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 size-[440px] rounded-full bg-[#EBE6FF] opacity-[0.29] shadow-[0_14px_46px_rgba(90,70,160,0.09)]" />
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 size-[320px] rounded-full bg-[#F8F6FF] opacity-[0.31] shadow-[0_10px_34px_rgba(90,70,160,0.08)]" />

            <div className="relative h-full w-full flex items-center justify-center p-10">
              <div
                aria-hidden="true"
                className="[&_svg]:mx-auto [&_svg]:h-56 [&_svg]:w-auto"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(124, 92, 252, 0.22))',
                  opacity: 0.9,
                }}
                dangerouslySetInnerHTML={{ __html: syncedIllustrationSvg }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
