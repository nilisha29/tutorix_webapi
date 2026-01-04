// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="  ">
//       Home
//     </div>
//   );
// }

import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";


import Footer from "./_components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
   
      <Footer />
    </>
  );
}
