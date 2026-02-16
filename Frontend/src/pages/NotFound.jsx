import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl font-bold text-gray-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="flex items-center justify-center mx-auto"
          >
            <Home size={20} className="mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
