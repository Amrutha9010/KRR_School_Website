import React from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  BookOpen, 
  Lightbulb, 
  Users, 
  ShieldCheck, 
  Home, 
  Monitor, 
  UserCheck, 
  Trophy, 
  Bus,
  ChevronRight,
  Target,
  Rocket,
  CheckCircle2
} from 'lucide-react'
import GallerySection from './GallerySection'

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white font-body text-navy-800">

      {/* Hero / Banner Section */}
      <section className="relative h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/hero1.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-navy-900/70 backdrop-blur-[2px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          {/* <nav className="flex items-center justify-center gap-2 mb-6 animate-fade-in">
            <a href="/" className="text-navy-200 hover:text-gold-400 transition-colors text-sm flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </a>
            <ChevronRight className="w-4 h-4 text-navy-400" />
            <span className="text-gold-400 text-sm font-medium">About Us</span>
          </nav> */}

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            About <span className="text-gold-400">KRR BrightMinds</span> School
          </h1>
          <p className="max-w-2xl mx-auto text-navy-100 text-lg md:text-xl leading-relaxed animate-fade-in-up animation-delay-200">
            Nurturing young minds through quality education, discipline, values, and holistic development.
          </p>
        </div>
      </section>

      {/* About School Introduction */}
      <section className="py-12 lg:py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Side: Image */}
            <div className="w-full lg:w-1/2 relative animate-slide-in-left">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/hero2.jpg" 
                  alt="KRR BrightMinds Campus" 
                  className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent"></div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-500 rounded-2xl -z-10 animate-pulse"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-navy-100 rounded-2xl -z-10"></div>
            </div>

            {/* Right Side: Content */}
            <div className="w-full lg:w-1/2 animate-slide-in-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 text-navy-700 rounded-full mb-6">
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Welcome to KRR BrightMinds</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-6 leading-tight">
                Empowering Rural Children with <span className="text-gold-600">Modern Education</span>
              </h2>
              <div className="space-y-6 text-navy-600 leading-relaxed text-lg">
                <p>
                  KRR BrightMinds School is a mission-driven institution dedicated to providing quality education for rural children through modern learning methods, discipline, strong values, and holistic child development.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {[
                    "Quality Education",
                    "Modern Learning Methods",
                    "Strong Indian Values",
                    "Holistic Development"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-navy-50/50 p-3 rounded-xl border border-navy-100/50">
                      <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                      <span className="font-medium text-navy-800 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-12 lg:py-16 bg-navy-50 relative overflow-hidden">
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-navy-100/30 -skew-x-12 transform translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">Our Approach</h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* CBSE Curriculum */}
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-navy-200/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-navy-100">
              <div className="w-16 h-16 bg-navy-700 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold-500 transition-colors duration-300">
                <BookOpen className="w-8 h-8 text-white group-hover:text-navy-900 transition-colors" />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy-900 mb-4">CBSE Curriculum</h3>
              <p className="text-navy-600 leading-relaxed">
                We follow the CBSE curriculum and use NCERT-based teaching methods to provide clear conceptual learning and strong academic foundations.
              </p>
            </div>

            {/* NEP 2020 Ready */}
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-navy-200/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-navy-100">
              <div className="w-16 h-16 bg-navy-700 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold-500 transition-colors duration-300">
                <Lightbulb className="w-8 h-8 text-white group-hover:text-navy-900 transition-colors" />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy-900 mb-4">NEP 2020 Ready</h3>
              <p className="text-navy-600 leading-relaxed">
                Our teaching methodology aligns with the National Education Policy 2020, encouraging conceptual understanding, activity-based learning, creativity, and life skills.
              </p>
            </div>

            {/* Beyond Academics */}
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-navy-200/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-navy-100">
              <div className="w-16 h-16 bg-navy-700 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold-500 transition-colors duration-300">
                <Rocket className="w-8 h-8 text-white group-hover:text-navy-900 transition-colors" />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy-900 mb-4">Beyond Academics</h3>
              <p className="text-navy-600 leading-relaxed">
                At KRR BrightMinds, education goes beyond textbooks. We nurture discipline, manners, Indian values, leadership qualities, and overall personality development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">Our Leadership Team</h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-12">
            {[
              {
                name: "Dr. Sudhakar Korrapati",
                qual: "Ph.D., MBA, MS, MA",
                role: "Chairman",
                image: "https://krrschools.com/assets/img/team/dr-sudhakar-korrapati.jpg",
                desc: "A visionary leader dedicated to providing quality education and empowering rural students through modern learning opportunities and value-based education."
              },
              {
                name: "Dr. Geetha Korrapati",
                qual: "Ph.D., MS, MCA",
                role: "Vice Chairman",
                image: "https://krrschools.com/assets/img/team/dr-geetha-korrapati.jpg",
                desc: "Committed to academic excellence and student-centered learning, focusing on innovation, discipline, and holistic child development."
              },
              {
                name: "Divya M",
                qual: "",
                role: "Director – Academics",
                image: "https://krrschools.com/assets/img/team/divya.jpeg",
                desc: "Focused on creating engaging learning experiences, modern teaching strategies, and nurturing academic growth among students."
              },
              {
                name: "A.S.N. Murthy",
                qual: "M.A., B.Ed",
                role: "Principal",
                image: "https://krrschools.com/assets/img/team/a-s-n-murthy-principal.jpg",
                desc: "An experienced educator guiding students with discipline, care, leadership, and a strong academic vision."
              }
            ].map((member, index) => (
              <div 
                key={index}
                className={`group bg-navy-50 rounded-[2rem] overflow-hidden flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-0 shadow-xl shadow-navy-100/50 hover:shadow-2xl transition-all duration-500 border border-navy-100`}
              >
                {/* Image Container */}
                <div className="w-full lg:w-2/5 h-[450px] relative overflow-hidden bg-white flex items-center justify-center p-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-navy-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute bottom-8 left-8 right-8 lg:hidden bg-navy-900/60 backdrop-blur-sm p-4 rounded-xl">
                    <h3 className="text-white text-2xl font-bold font-heading">{member.name}</h3>
                    <p className="text-gold-400 font-medium">{member.role}</p>
                  </div>
                </div>

                {/* Content Container */}
                <div className="w-full lg:w-3/5 p-8 lg:p-16">
                  <div className="mb-6">
                    <span className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-2 block">{member.role}</span>
                    <h3 className="text-3xl lg:text-4xl font-heading font-bold text-navy-900 mb-2">
                      {member.name}
                      {member.qual && <span className="text-lg font-medium text-navy-400 block lg:inline lg:ml-4">— {member.qual}</span>}
                    </h3>
                  </div>
                  <div className="w-16 h-1 bg-gold-500 mb-8"></div>
                  <p className="text-navy-600 text-lg leading-relaxed mb-8 italic">
                    "{member.desc}"
                  </p>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-900 transition-colors cursor-pointer">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Vision & Mission Section */}
      <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision Card */}
            <div className="relative p-10 lg:p-16 bg-navy-900 rounded-[3rem] text-white overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl group-hover:bg-gold-500/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform">
                  <Target className="w-8 h-8 text-navy-900" />
                </div>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-6">Our Vision</h2>
                <p className="text-navy-100 text-xl leading-relaxed">
                  “To empower students with knowledge, confidence, discipline, and values to succeed in life.”
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="relative p-10 lg:p-16 bg-gold-500 rounded-[3rem] text-navy-900 overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-navy-900/10 rounded-full blur-3xl group-hover:bg-navy-900/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-navy-900/80 text-xl leading-relaxed font-medium">
                  “To provide accessible, modern, and value-based education for holistic child development.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Parents Trust Us Section */}
      <section className="py-12 lg:py-16 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">Why Parents Trust Us</h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: ShieldCheck, label: "Safe Campus" },
              { icon: UserCheck, label: "Experienced Faculty" },
              { icon: Home, label: "Hostel Facility" },
              { icon: Monitor, label: "Smart Classrooms" },
              { icon: Users, label: "Individual Attention" },
              { icon: Trophy, label: "Discipline & Values" },
              { icon: Rocket, label: "Sports & Activities" },
              { icon: Bus, label: "Transport Facility" }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-navy-100 text-center group hover:border-gold-400 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-navy-900 transition-colors">
                  <item.icon className="w-6 h-6 text-navy-700 group-hover:text-gold-400 transition-colors" />
                </div>
                <span className="font-heading font-bold text-navy-800 text-sm lg:text-base">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-navy-900 rounded-[3rem] p-10 lg:p-20 text-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Shape Your Child’s Future with <br />
                <span className="text-gold-400">KRR BrightMinds School</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/apply" className="w-full sm:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-xl shadow-lg shadow-gold-500/20 text-center transition-all hover:-translate-y-1">
                  Apply for Admission
                </Link>
                <a href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-sm text-center transition-all hover:-translate-y-1">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs