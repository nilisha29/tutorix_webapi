export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/images/tutorixlogohome.png"
                alt="Tutorix Logo"
                className="h-7 w-auto"
              />
              <span className="text-slate-900 font-semibold">Tutorix</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Connecting passionate learners with expert tutors since 2021.
            </p>
            <div className="mt-4 flex items-center gap-3 text-slate-400 text-sm">
              <span>◎</span>
              <span>◎</span>
              <span>◎</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Help Center</li>
              <li>Safety Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Tutors</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Become a Tutor</li>
              <li>Tutor Resources</li>
              <li>Community</li>
              <li>Testimonials</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          © 2026 Tutorix Inc. All rights reserved. Made with care for lifelong learning.
        </div>
      </div>
    </footer>
  );
}
