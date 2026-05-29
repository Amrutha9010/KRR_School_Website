import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Home, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle, 
  CreditCard, 
  Calendar, 
  Info, 
  Plus, 
  Minus,
  GraduationCap,
  Bus,
  ShieldCheck,
  Monitor,
  Library,
  Dumbbell,
  Users,
  Coffee,
  HeartPulse,
  ArrowRight,
  Clock
} from 'lucide-react'

const FeePage = () => {
  const [activeFaq, setActiveFaq] = useState(null)

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const feeData = [
    { class: 'LKG', admission: '₹5,000', tuition: '₹12,000', annual: '₹3,000', total: '₹20,000' },
    { class: 'UKG', admission: '₹5,000', tuition: '₹12,000', annual: '₹3,000', total: '₹20,000' },
    { class: 'Grade 1', admission: '₹7,000', tuition: '₹15,000', annual: '₹4,000', total: '₹26,000' },
    { class: 'Grade 2', admission: '₹7,000', tuition: '₹15,000', annual: '₹4,000', total: '₹26,000' },
    { class: 'Grade 3', admission: '₹7,000', tuition: '₹15,000', annual: '₹4,000', total: '₹26,000' },
    { class: 'Grade 4', admission: '₹7,000', tuition: '₹18,000', annual: '₹5,000', total: '₹30,000' },
    { class: 'Grade 5', admission: '₹7,000', tuition: '₹18,000', annual: '₹5,000', total: '₹30,000' },
    { class: 'Grade 6', admission: '₹10,000', tuition: '₹22,000', annual: '₹6,000', total: '₹38,000' },
    { class: 'Grade 7', admission: '₹10,000', tuition: '₹22,000', annual: '₹6,000', total: '₹38,000' },
    { class: 'Grade 8', admission: '₹10,000', tuition: '₹22,000', annual: '₹6,000', total: '₹38,000' },
    { class: 'Grade 9', admission: '₹12,000', tuition: '₹25,000', annual: '₹8,000', total: '₹45,000' },
    { class: 'Grade 10', admission: '₹12,000', tuition: '₹25,000', annual: '₹8,000', total: '₹45,000' },
  ]

  const faqs = [
    { q: "Is hostel fee included in the annual fee?", a: "No, hostel fees are separate and depend on the type of accommodation and facilities chosen. Please refer to the Hostel Fee section for details." },
    { q: "Is transport optional?", a: "Yes, transportation is an optional facility provided for the convenience of students living in nearby areas." },
    { q: "Are installment payments available?", a: "Yes, we offer flexible payment options. Tuition fees can be paid in three installments over the academic year." },
    { q: "What facilities are included in the annual fee?", a: "The annual fee covers smart classroom access, library usage, computer lab facilities, basic medical care, and sports activities." },
    { q: "Are scholarships available?", a: "Yes, we provide merit-based scholarships for outstanding academic performers and sibling concessions for families with more than one child enrolled." }
  ]

  return (
    <div className="min-h-screen bg-white font-body text-navy-800">

      {/* Hero / Banner Section */}
      <section className="relative h-[400px] lg:h-[450px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("public/hero1.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-navy-900/75 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* <nav className="flex items-center justify-center gap-2 mb-6 animate-fade-in">
            <Link to="/" className="text-navy-200 hover:text-gold-400 transition-colors text-sm flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-navy-400" />
            <span className="text-gold-400 text-sm font-medium">Fee Structure</span>
          </nav> */}

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Fee <span className="text-gold-400">Structure</span>
          </h1>
          <p className="max-w-3xl mx-auto text-navy-100 text-lg md:text-xl leading-relaxed animate-fade-in-up animation-delay-200">
            Transparent and affordable fee structure designed to provide quality education and holistic development for every child.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 text-navy-700 rounded-full mb-6">
            <Info className="w-5 h-5 text-gold-600" />
            <span className="text-sm font-bold uppercase tracking-wider">Transparency & Accessibility</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-6">Quality Education for All</h2>
          <p className="text-navy-600 leading-relaxed text-lg">
            At KRR BrightMinds School, we believe quality education should remain accessible and transparent. Our fee structure is carefully designed to provide excellent academics, modern facilities, safety, and holistic development opportunities for students.
          </p>
        </div>
      </section>

      {/* Fee Structure Table Section */}
      <section className="py-12 lg:py-16 bg-navy-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">Academic Fee Structure</h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-navy-500 italic">Academic Year 2025-26</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-navy-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-900 text-white">
                    <th className="px-6 py-5 font-heading font-semibold uppercase tracking-wider text-sm">Class</th>
                    <th className="px-6 py-5 font-heading font-semibold uppercase tracking-wider text-sm">Admission Fee</th>
                    <th className="px-6 py-5 font-heading font-semibold uppercase tracking-wider text-sm">Tuition Fee</th>
                    <th className="px-6 py-5 font-heading font-semibold uppercase tracking-wider text-sm">Annual Fee</th>
                    <th className="px-6 py-5 font-heading font-semibold uppercase tracking-wider text-sm">Total Annual Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {feeData.map((row, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-navy-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-navy-900">{row.class}</td>
                      <td className="px-6 py-4 text-navy-600">{row.admission}</td>
                      <td className="px-6 py-4 text-navy-600">{row.tuition}</td>
                      <td className="px-6 py-4 text-navy-600">{row.annual}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gold-600">{row.total}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-navy-50 p-6 text-center text-sm text-navy-500">
              <p>* Fees are subject to change. Please contact the office for the most current information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hostel & Transport Sections */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Hostel Fee Section */}
            <div className="bg-navy-900 rounded-[3rem] p-10 lg:p-16 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center">
                    <Home className="w-8 h-8 text-navy-900" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold">Hostel Facilities</h2>
                </div>
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-navy-100">Annual Hostel Fee</span>
                    <span className="text-2xl font-bold text-gold-400">₹45,000</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Separate Boys & Girls",
                      "Nutritious Food",
                      "24/7 Security",
                      "Study Support",
                      "Hygienic Rooms",
                      "Laundry Service"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-navy-200">
                        <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <img 
                  src="/Hostel.jpg" 
                  alt="Hostel Room" 
                  className="w-full h-48 object-cover rounded-2xl border border-white/10"
                />
              </div>
            </div>

            {/* Transport Fee Section */}
            <div className="bg-gold-500 rounded-[3rem] p-10 lg:p-16 text-navy-900 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-navy-900/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center">
                    <Bus className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold">Transport Fee</h2>
                </div>
                <div className="space-y-6 mb-10">
                  <div className="bg-navy-900/5 p-6 rounded-2xl border border-navy-900/10">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold">Distance: 0–5 KM</span>
                      <span className="font-bold">₹8,000 / Year</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Distance: 5–15 KM</span>
                      <span className="font-bold">₹12,000 / Year</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "GPS Bus Tracking",
                      "Trained Drivers",
                      "Fixed Pickup Points",
                      "Safety Measures",
                      "CCTV Monitored",
                      "Lady Attendant"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-navy-900 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20">
                  <p className="text-sm font-semibold">Transport is available for all nearby villages and town centers. Please contact our transport manager for specific route details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Includes Section */}
      <section className="py-12 lg:py-16 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">What's Included</h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-navy-600 max-w-2xl mx-auto">
              Our comprehensive fee structure covers a wide range of facilities to ensure a holistic learning experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: Monitor, label: "Smart Class" },
              { icon: Library, label: "Library" },
              { icon: Dumbbell, label: "Sports" },
              { icon: GraduationCap, label: "Academics" },
              { icon: Users, label: "Individual Attention" },
              { icon: ShieldCheck, label: "Safety" },
              { icon: HeartPulse, label: "Medical Care" },
              { icon: Coffee, label: "Hostel Facility" },
              { icon: Bus, label: "Transport Support" },
              { icon: GraduationCap, label: "Exp. Faculty" }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-navy-100 text-center group hover:border-gold-400 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-navy-900 transition-colors">
                  <item.icon className="w-6 h-6 text-navy-700 group-hover:text-gold-400 transition-colors" />
                </div>
                <span className="font-heading font-bold text-navy-800 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarship Section */}
      <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-50 rounded-[3rem] p-6 lg:p-12 flex flex-col lg:flex-row items-center gap-8 border border-navy-100 shadow-lg">
            <div className="w-full lg:w-1/2">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-6 leading-tight">
                Scholarships & <br />
                <span className="text-gold-600">Sibling Concessions</span>
              </h2>
              <p className="text-navy-600 text-lg mb-8 leading-relaxed">
                We reward academic excellence and support families with multiple children enrolled at KRR BrightMinds. Merit-based scholarships and special sibling concessions are available.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-gold-600" />
                  </div>
                  <span className="font-bold text-navy-900">Merit Scholarships (90% + in Academics)</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gold-600" />
                  </div>
                  <span className="font-bold text-navy-900">Sibling Concession (10% off Tuition)</span>
                </div>
              </div>
              <a href="tel:+919876543210" className="inline-block px-8 py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors">
                Inquire for Scholarship
              </a>
            </div>
            <div className="w-full lg:w-1/2">
              <img 
                src="https://i.pinimg.com/1200x/5a/3e/96/5a3e968fa1d261dca428841970a03f8b.jpg" 
                alt="Students studying" 
                className="w-full h-auto rounded-[2rem] shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Payment Information Section */}
      <section className="py-12 lg:py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Payment Information</h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
              <CreditCard className="w-10 h-10 text-gold-400 mb-6" />
              <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
              <p className="text-navy-300 text-sm leading-relaxed">
                We accept Online Bank Transfers (NEFT/IMPS), UPI, Credit/Debit Cards, and Demand Drafts. Cash payments are accepted at the school office.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
              <Calendar className="w-10 h-10 text-gold-400 mb-6" />
              <h3 className="text-xl font-bold mb-4">Installment Options</h3>
              <p className="text-navy-300 text-sm leading-relaxed">
                Tuition fees can be divided into three installments due in June, October, and January to ease the financial commitment for parents.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
              <Clock className="w-10 h-10 text-gold-400 mb-6" />
              <h3 className="text-xl font-bold mb-4">Payment Deadlines</h3>
              <p className="text-navy-300 text-sm leading-relaxed">
                Please ensure payments are made by the 10th of the respective month. Late fees may apply for payments made after the deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-gold-600" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-navy-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-navy-50/50 transition-colors"
                >
                  <span className="font-bold text-navy-900">{faq.q}</span>
                  {activeFaq === idx ? (
                    <Minus className="w-5 h-5 text-gold-600 shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gold-600 shrink-0" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="p-6 pt-0 bg-white text-navy-600 border-t border-navy-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 lg:py-16 bg-navy-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-navy-900 rounded-[3rem] p-10 lg:p-20 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Invest in Your Child’s <br />
                <span className="text-gold-400">Bright Future</span>
              </h2>
              <p className="text-navy-200 text-lg mb-10 max-w-2xl mx-auto">
                Quality education, modern facilities, safety, and holistic development — all in one learning environment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/apply" className="w-full sm:w-auto px-10 py-5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-2xl shadow-lg shadow-gold-500/20 text-center transition-all hover:-translate-y-1">
                  Apply for Admission
                </Link>
                <a href="/contact" className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-sm text-center transition-all hover:-translate-y-1">
                  Contact Admission Office
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default FeePage
