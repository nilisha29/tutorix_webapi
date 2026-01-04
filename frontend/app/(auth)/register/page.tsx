// import RegisterForm from "../_components/RegisterForm";
// import Image from "next/image";

// export default function RegisterPage() {
//   return (
//     <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
//       {/* Left side - Form */}
//       <div className="flex items-center justify-center p-8">
//         <RegisterForm />
//       </div>

//       {/* Right side - Image */}
//       <div className="hidden md:flex items-center justify-center bg-gray-100">
//         <Image
//           src="/images/register.png"
//           alt="Register"
//           width={500}
//           height={500}
//           priority
//         />
//       </div>

//     </div>
//   );
// }



import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    // <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
     <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2">
      
      {/* Left Illustration Section */}
      <div className="hidden md:flex items-center justify-center bg-white">
        <img
          src="/images/register.png"
          alt="Tutorix Register"
          className="max-w-md"
        />
      </div>

      {/* Right Register Section */}
      <div className="flex items-center justify-center bg-green-100 px-6">
        <div className="w-full max-w-sm space-y-6">

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Create your Tutorix account
            </h1>
          </div>

          {/* Register Form */}
          <RegisterForm />

        </div>
      </div>
    </div>
  );
}

