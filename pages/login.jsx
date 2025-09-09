import LoginBackground from '../components/LoginBackground';

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Add the background component */}
      <LoginBackground />
      
      {/* Login form container with higher z-index to appear above background */}
      <div className="relative z-10 bg-gray-900/80 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
        {/* ...existing login form code... */}
      </div>
    </div>
  );
}
