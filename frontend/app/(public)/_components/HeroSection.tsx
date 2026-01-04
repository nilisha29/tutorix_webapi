export default function HeroSection() {
  return (
    // <section className="bg-gray-50 py-20">
    <section className="bg-gray-50 pt-8 pb-20">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* Text */}
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Unlock Your Potential with
            <span className="text-blue-600"> Expert Tutors</span>
          </h1>

          <p className="text-gray-600 mb-6">
            Personalized learning for every subject, schedule, and budget.
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md">
              {/* Find a Tutor */}
              Get Started
            </button>
            {/* <button className="px-6 py-3 border rounded-md">
              Become a Tutor
            </button> */}
          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block">
          <img
            src="/images/homepagetutorix.png"
            alt="Tutorix Hero"
            className="rounded-xl shadow"
          />
        </div>

      </div>
    </section>
  );
}
