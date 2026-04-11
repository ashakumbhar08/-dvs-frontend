import { useNavigate } from "react-router-dom"
import { ROUTES } from "../utils/constants"
import { formatXlm } from "../utils/formatters"
import { stats } from "../utils/dummyData"
import PublicLayout from "../layouts/PublicLayout"

const StepIcon = ({ type }) => {
  const paths = {
    create: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    complete: "M13 10V3L4 14h7v7l9-11h-7z",
    certify: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  }
  return (
    <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={paths[type]} />
    </svg>
  )
}

const TrustIcon = ({ type }) => {
  const paths = {
    shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    bolt: "M13 10V3L4 14h7v7l9-11h-7z",
    globe: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  }
  return (
    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
      <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={paths[type]} />
      </svg>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="inline-block bg-brand-50 text-brand-800 text-xs font-medium px-3 py-1 rounded-full mb-6 tracking-wide">
          Powered by Stellar + Soroban
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Verify Work.{" "}
          <span className="text-brand-600">Earn Rewards.</span>
          <br />
          Own Your Credentials.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Complete blockchain tasks, get verified on-chain, and earn XLM rewards with tamper-proof certificates.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(ROUTES.SIGNUP)}
            className="px-8 py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors text-base"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate(ROUTES.VERIFY)}
            className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors text-base"
          >
            Explore Certificates
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", iconType: "create", title: "Create", desc: "Admins post tasks with XLM rewards and clear proof requirements." },
              { step: "02", iconType: "complete", title: "Complete", desc: "Users complete tasks and submit verifiable proof of their work." },
              { step: "03", iconType: "certify", title: "Certify", desc: "Approved work gets minted as an on-chain certificate with instant XLM payout." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <StepIcon type={item.iconType} />
                </div>
                <p className="text-xs font-bold text-brand-400 mb-1 tracking-widest">STEP {item.step}</p>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-12 bg-brand-600">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <p className="text-3xl font-bold">{stats.totalTasksCreated}</p>
              <p className="text-brand-200 text-sm mt-1">Tasks Created</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.totalCertificatesMinted}</p>
              <p className="text-brand-200 text-sm mt-1">Certificates Minted</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatXlm(stats.totalXlmDistributed)}</p>
              <p className="text-brand-200 text-sm mt-1">Distributed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { iconType: "shield", title: "On-Chain Verified", desc: "Every certificate is stored on the Stellar blockchain — immutable and publicly verifiable." },
            { iconType: "bolt", title: "Instant Payouts", desc: "Rewards are sent automatically via Soroban smart contracts the moment work is approved." },
            { iconType: "globe", title: "Portable Credentials", desc: "Share your certificate link anywhere. Anyone can verify your work without an account." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <TrustIcon type={item.iconType} />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
