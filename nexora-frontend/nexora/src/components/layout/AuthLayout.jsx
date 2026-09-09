const AuthLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-slate-100 p-4 lg:p-8">
      <div className="mx-auto flex min-h-[92vh] max-w-7xl overflow-hidden rounded-4xl bg-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">

        {/* LEFT SIDE */}
        <div className="relative hidden w-[45%] overflow-hidden bg-slate-900 lg:flex">

          {/* Background Blur */}
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl"></div>

          <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>

          <div className="relative flex h-full flex-col justify-between p-14">

            {/* Logo */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Nexora
              </h1>

              <p className="mt-2 text-slate-400">
                AI Powered Digital Wallet
              </p>
            </div>

            {/* Hero */}
            <div>

              <h2 className="text-6xl font-bold leading-tight text-white">
                Smarter
                <br />
                Payments.
                <br />
                Safer Future.
              </h2>

              <p className="mt-8 max-w-md text-lg leading-8 text-slate-300">
                Secure your digital transactions with AI-powered fraud
                detection, real-time monitoring and intelligent risk analysis.
              </p>

              <div className="mt-12 space-y-5">

                <div className="flex items-center gap-4">
                  <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                  <p className="text-slate-300">
                    AI Fraud Detection
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                  <p className="text-slate-300">
                    Bank-grade Security
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                  <p className="text-slate-300">
                    Real-Time Monitoring
                  </p>
                </div>

              </div>

            </div>

            {/* Bottom */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
              <p className="text-sm leading-7 text-slate-300">
                "Protecting every transaction with intelligent technology and
                modern financial security."
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-1 items-center justify-center p-8 md:p-16">

          <div className="w-full max-w-md">
            {children}
          </div>

        </div>

      </div>
    </main>
  );
};

export default AuthLayout;