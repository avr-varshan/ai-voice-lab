import AuthForm from '@/components/AuthForm';
import LavenderBlobs from '@/components/LavenderBlobs';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <LavenderBlobs />
      <AuthForm />
    </div>
  );
}