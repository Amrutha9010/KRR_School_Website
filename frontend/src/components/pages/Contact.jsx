import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  RotateCcw,
  Plus,
  Minus,
  GraduationCap,
  Coffee,
  Bus,
  Briefcase,
  HelpCircle,
  Share2,
} from "lucide-react";

const Contact = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
    alert("Thank you for your message. We will get back to you soon!");
    resetForm();
  };

  const faqs = [
    {
      q: "How can I apply for admission?",
      a: "You can apply by visiting our campus or by clicking the 'Apply for Admission' button on our website. Our admission office will guide you through the documentation and interview process.",
    },
    {
      q: "Is hostel facility available?",
      a: "Yes, we provide separate hostel facilities for boys and girls with modern amenities, nutritious food, and 24/7 security.",
    },
    {
      q: "Are transport services available?",
      a: "Yes, our GPS-enabled bus fleet covers a wide area including Tadikalapudi and surrounding villages in Eluru district.",
    },
    {
      q: "How can I schedule a campus visit?",
      a: "You can call our office or fill out the contact form to schedule a visit. We recommend visiting during office hours (8:30 AM – 4:00 PM) for a full tour.",
    },
    {
      q: "What curriculum does the school follow?",
      a: "KRR BrightMinds School follows the CBSE curriculum with an emphasis on NEP 2020-aligned learning methods.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-body text-navy-800">
      {/* Hero / Banner Section */}
      <section className="relative h-[400px] lg:h-[450px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/hero1.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-navy-900/75 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* <nav className="flex items-center justify-center gap-2 mb-6 animate-fade-in">
            <Link to="/" className="text-navy-200 hover:text-gold-400 transition-colors text-sm flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-navy-400" />
            <span className="text-gold-400 text-sm font-medium">Contact Us</span>
          </nav> */}

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Contact <span className="text-gold-400">KRR BrightMinds</span>{" "}
            School
          </h1>
          <p className="max-w-3xl mx-auto text-navy-100 text-lg md:text-xl leading-relaxed animate-fade-in-up animation-delay-200">
            We are here to help parents and students with admissions, academics,
            hostel facilities, transport, and general inquiries.
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="bg-navy-50 p-8 rounded-[2rem] border border-navy-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors">
                <MapPin className="w-7 h-7 text-gold-400 group-hover:text-navy-900" />
              </div>
              <h3 className="text-xl font-heading font-bold text-navy-900 mb-4">
                Our Location
              </h3>
              <p className="text-navy-600 leading-relaxed">
                Tadikalapudi Village, Kamavarapukota Mandalam, Eluru District,
                Andhra Pradesh - 534452
              </p>
            </div>

            {/* Phone */}
            <div className="bg-navy-50 p-8 rounded-[2rem] border border-navy-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors">
                <Phone className="w-7 h-7 text-gold-400 group-hover:text-navy-900" />
              </div>
              <h3 className="text-xl font-heading font-bold text-navy-900 mb-4">
                Call Us
              </h3>
              <div className="space-y-2">
                <a
                  href="tel:08823258055"
                  className="block text-navy-600 hover:text-gold-600 transition-colors"
                >
                  08823-258055
                </a>
                <a
                  href="tel:+919652993865"
                  className="block text-navy-600 hover:text-gold-600 transition-colors"
                >
                  +91 96529 93865
                </a>
                <a
                  href="tel:+919346633116"
                  className="block text-navy-600 hover:text-gold-600 transition-colors"
                >
                  +91 93466 33116
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-navy-50 p-8 rounded-[2rem] border border-navy-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors">
                <Mail className="w-7 h-7 text-gold-400 group-hover:text-navy-900" />
              </div>
              <h3 className="text-xl font-heading font-bold text-navy-900 mb-4">
                Email Us
              </h3>
              <a
                href="mailto:admin@krrschools.com"
                className="text-navy-600 hover:text-gold-600 transition-colors break-words"
              >
                admin@krrschools.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 lg:py-16 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden flex flex-col lg:flex-row border border-navy-100">
            {/* Form Side */}
            <div className="w-full lg:w-3/5 p-8 lg:p-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-navy-900 mb-8">
                Leave a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-navy-700 mb-2">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-navy-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-navy-50 text-navy-700 font-bold rounded-xl hover:bg-navy-100 transition-all border border-navy-100"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset Form
                  </button>
                </div>
              </form>
            </div>

            {/* Image/Inquiry Side */}
            <div className="w-full lg:w-2/5 relative min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop"
                alt="School Inquiry"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-[1px] flex items-center justify-center p-12">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 text-white text-center">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-gold-400">
                    Join KRR BrightMinds
                  </h3>
                  <p className="text-navy-50 mb-6">
                    Experience world-class education with Indian values. Our
                    team is ready to assist you in every step.
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Inquiry Cards Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Quick Inquiries
            </h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Admissions",
                desc: "Get complete admission details and application support.",
              },
              {
                icon: Coffee,
                title: "Hostel",
                desc: "Know more about hostel facilities, safety, and accommodation.",
              },
              {
                icon: Bus,
                title: "Transport",
                desc: "Learn about bus routes, GPS tracking, and transport facilities.",
              },
              {
                icon: Briefcase,
                title: "Careers",
                desc: "Contact us regarding teaching and non-teaching opportunities.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-navy-50 p-8 rounded-[2rem] border border-navy-100 hover:border-gold-400 hover:bg-white transition-all group text-center shadow-sm"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-navy-900 transition-colors">
                  <item.icon className="w-7 h-7 text-navy-700 group-hover:text-gold-400 transition-colors" />
                </div>
                <h3 className="text-xl font-heading font-bold text-navy-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-navy-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Timings Section */}
      <section className="py-12 lg:py-16 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              School Timings
            </h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Working Hours", time: "9:00 AM – 4:00 PM" },
              { label: "Office Hours", time: "9:00 AM – 5:00 PM" },
              { label: "Admission Office", time: "9:00 AM – 4:00 PM" },
              { label: "Hostel Visiting", time: "Sundays (10 AM – 4 PM)" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center"
              >
                <Clock className="w-8 h-8 text-gold-400 mx-auto mb-4" />
                <h4 className="text-navy-300 text-sm uppercase tracking-widest mb-2 font-bold">
                  {item.label}
                </h4>
                <p className="text-xl font-bold">{item.time}</p>
                <p className="text-xs text-navy-400 mt-2">Monday – Saturday</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Find Us on Map
            </h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-navy-50 rounded-[3rem] overflow-hidden shadow-xl h-[450px] border border-navy-100">
            {/* Embed code for school location */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3817.397215242049!2d81.16436257492326!3d16.9056874839016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3643358ec91ea1%3A0xa5b74c31c0461a33!2sKRR%20BrightMinds%20School!5e0!3m2!1sen!2sin!4v1779959519049!5m2!1sen!2sin"
              width="1220"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-16 bg-navy-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-gold-600" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              General Questions
            </h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-navy-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white"
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

      {/* Social Media Section
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-navy-900 mb-10">Connect With Us</h2>
          <div className="flex justify-center gap-6">
            {[
              { icon: Share2, label: "Facebook" },
              { icon: Share2, label: "Instagram" },
              { icon: Share2, label: "YouTube" },
              { icon: Share2, label: "LinkedIn" }
            ].map((social, idx) => (
              <a 
                key={idx} 
                href="#" 
                className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-700 hover:bg-navy-900 hover:text-gold-400 transition-all shadow-sm hover:-translate-y-2"
                aria-label={social.label}
              >
                <social.icon className="w-7 h-7" />
              </a>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final CTA Section */}
      <section className="py-12 lg:py-16 bg-navy-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-navy-900 rounded-[3rem] p-10 lg:p-20 text-center overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            ></div>

            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Let's Build Your Child's <br />
                <span className="text-gold-400">Bright Future Together</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/apply"
                  className="w-full sm:w-auto px-10 py-5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-2xl shadow-lg shadow-gold-500/20 text-center transition-all hover:-translate-y-1"
                >
                  Apply for Admission
                </Link>
                {/* <button className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-1">
                  Schedule Campus Visit
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;