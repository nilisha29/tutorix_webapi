import LoginForm from "../_components/LoginForm";


export default function LoginPage() {
  return (
    // <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
     <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2">
      
      
      {/* Left Illustration Section */}
      <div className="hidden md:flex items-center justify-center bg-white">
        {/* <img
          src="/login-illustration.png" */}

          <img src="/images/login-illustration.png" alt="Tutorix Login"
            className="max-w-md" />
          {/* alt="Tutorix Login"
          className="max-w-md"
        /> */}
      </div>

      {/* Right Login Section */}
      <div className="flex items-center justify-center bg-green-100 px-6">
        <div className="w-full max-w-sm space-y-6">
          
          {/* Logo & Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Sign in to your Tutorix account
            </h1>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
