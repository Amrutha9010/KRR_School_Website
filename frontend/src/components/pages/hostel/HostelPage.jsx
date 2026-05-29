import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

import {
  ShieldCheck,
  BedDouble,
  UtensilsCrossed,
  Clock,
  Users,
  Wifi,
  Phone,
  Heart,
  Zap,
  CheckCircle2,
  Stethoscope,
  BookOpen,
  Camera,
  Coffee,
  Gamepad2,
  Droplets,
  Star,
  IndianRupee,
  ArrowRight,
  ShieldAlert,
  Waves,
  Sparkles,
  Users2,
  Mail,
  MapPin,
} from "lucide-react";

const HostelPage = () => {
  const [availability, setAvailability] = useState({
    boys: { ac: 0, nonAc: 0 },
    girls: { ac: 0, nonAc: 0 },
  });

  const [loadingAvailability, setLoadingAvailability] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/hostel/availability",
        );

        const result = await response.json();

        console.log("Availability API:", result);

        if (result.success) {
          setAvailability(result.data);
        }
      } catch (error) {
        console.error("Availability fetch error:", error);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, []);

  const whyChooseUs = [
    {
      icon: ShieldCheck,
      title: "24/7 Security",
      desc: "Round-the-clock security personnel and CCTV surveillance for complete safety.",
    },
    {
      icon: Users2,
      title: "Separate Hostels",
      desc: "Completely separate hostel wings for boys and girls with dedicated entry points.",
    },
    {
      icon: UtensilsCrossed,
      title: "Hygienic Food",
      desc: "Freshly prepared nutritious meals in a clean, modern kitchen environment.",
    },
    {
      icon: Clock,
      title: "Study Supervision",
      desc: "Mandatory supervised study hours with teacher assistance for academic excellence.",
    },
    {
      icon: Stethoscope,
      title: "Medical Support",
      desc: "On-call medical assistance and first-aid facilities available 24/7.",
    },
    {
      icon: Heart,
      title: "Caring Wardens",
      desc: "Experienced wardens who provide emotional support and parental care.",
    },
    {
      icon: Phone,
      title: "Parent Connect",
      desc: "Regular communication and updates to parents regarding child's well-being.",
    },
    {
      icon: BedDouble,
      title: "Comfortable Living",
      desc: "Spacious, well-ventilated rooms designed for comfort and focused living.",
    },
  ];

  const roomTypes = [
    {
      title: "AC Hostel Room",
      type: "Premium Comfort",
      sharing: "4-Sharing Only",
      features: [
        "Centralized AC",
        "Individual Study Table",
        "Personal Wardrobe",
        "Attached Washroom",
        "Premium Bedding",
      ],
      image: "/AC.jpg",
      price: "₹75,000",
      available: availability.boys.ac,
    },
    {
      title: "Non-AC Hostel Room",
      type: "Classic Living",
      sharing: "4-Sharing Only",
      features: [
        "Cool Air Circulation",
        "Individual Study Table",
        "Personal Wardrobe",
        "Clean Environment",
        "Ample Storage",
      ],
      image: "/Non-AC.jpg",
      price: "₹55,000",
      available: availability.boys.nonAc,
    },
  ];

  const facilities = [
    { icon: MapPin, title: "Location" },
    { icon: Droplets, title: "RO Drinking Water" },
    { icon: Waves, title: "Laundry Facility" },
    { icon: BookOpen, title: "Dedicated Study Hall" },
    { icon: UtensilsCrossed, title: "Spacious Dining Hall" },
    { icon: Coffee, title: "Reading Room" },
    { icon: Gamepad2, title: "Indoor Games Area" },
    { icon: Camera, title: "CCTV Monitoring" },
    { icon: Stethoscope, title: "24/7 Medical Care" },
    { icon: Zap, title: "Power Backup" },
    { icon: ShieldAlert, title: "Secure Entry/Exit" },
    { icon: Sparkles, title: "Daily Cleaning" },
  ];

  const schedule = [
    { time: "06:00 AM", activity: "Wake up & Yoga/Exercise", icon: Sparkles },
    { time: "07:30 AM", activity: "Nutritious Breakfast", icon: Coffee },
    { time: "08:30 AM", activity: "School Hours Begin", icon: BookOpen },
    { time: "01:30 PM", activity: "Healthy Lunch", icon: UtensilsCrossed },
    { time: "04:30 PM", activity: "Evening Snacks & Sports", icon: Gamepad2 },
    { time: "06:30 PM", activity: "Supervised Study Hours", icon: Clock },
    { time: "08:30 PM", activity: "Dinner Time", icon: UtensilsCrossed },
    { time: "09:30 PM", activity: "Self Study / Reading", icon: BookOpen },
    { time: "10:30 PM", activity: "Lights Out", icon: ShieldCheck },
  ];

  const gallery = [
    { url: "/Hostel.jpg", title: "Hostel Building" },
    { url: "/Non-AC.jpg", title: "Non-AC Hostel Room" },
    // { url: 'https://images.unsplash.com/photo-1567168539593-59673ababaae?auto=format&fit=crop&q=80&w=800', title: 'Student Dining' },
    // { url: '/working together.jpg', title: 'Student Activities' },
    // { url: '/sports.png', title: 'Sports Ground' },
    { url: "/AC.jpg", title: "AC Hostel Room" },
  ];

  const testimonials = [
    {
      quote:
        "The hostel environment helped my child become more disciplined, confident, and academically focused. We feel completely at peace knowing she is in safe hands.",
      author: "Mr. Rajesh Kumar",
      role: "Parent of Grade 9 Student",
      image: "https://i.pravatar.cc/150?u=rajesh",
    },
    {
      quote:
        "The teachers here guide us even after school hours. The food is just like home, and I've made some of my best friends here in the hostel.",
      author: "Sneha Reddy",
      role: "Grade 10 Student",
      image: "https://i.pravatar.cc/150?u=sneha",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-body text-navy-800 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Hostel.jpg"
            alt="Hostel Building"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy-900/75 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-gold-500/20 border border-gold-500/30 text-gold-400 rounded-full text-sm font-bold tracking-wider uppercase mb-6 animate-fade-in">
            A Premium Residential Experience
          </span>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            A Safe and Caring <br />
            <span className="text-gold-400">Home Away From Home</span>
          </h1>
          <p className="max-w-2xl mx-auto text-navy-100 text-lg md:text-xl leading-relaxed mb-10 animate-fade-in-up animation-delay-200">
            Providing students with a secure, disciplined, hygienic, and
            supportive hostel environment for academic and personal growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link
              to="/hostel-apply"
              className="w-full sm:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl shadow-lg hover:shadow-gold-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Apply for Hostel <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/hostel-gallery"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 text-center"
            >
              Explore Hostel Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Hostel Overview Section */}
      <section className="py-20 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 relative animate-slide-in-left">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/Hostel.jpg"
                  alt="Hostel Life"
                  className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-500 rounded-3xl -z-10 animate-pulse"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-navy-100 rounded-3xl -z-10"></div>
            </div>

            <div className="w-full lg:w-1/2 animate-slide-in-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 text-navy-700 rounded-full mb-6">
                <Users className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  Welcome to KRR Hostel
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-6 leading-tight">
                Nurturing Excellence Through{" "}
                <span className="text-gold-600">Disciplined Living</span>
              </h2>
              <p className="text-navy-600 text-lg leading-relaxed mb-8">
                Our hostel facility is designed to provide a perfect balance of
                comfort, safety, and discipline. We offer separate wings for
                boys and girls, each managed by caring wardens who ensure every
                student feels at home while maintaining a focus on academics.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Separate hostel for boys and girls",
                  "Caring and experienced wardens",
                  "Study-focused environment",
                  "Disciplined and safe campus",
                  "Comfortable living spaces",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-navy-50/50 p-4 rounded-2xl border border-navy-100/50"
                  >
                    <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                    <span className="font-medium text-navy-800 text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Our Hostel */}
      <section className="py-20 lg:py-24 bg-navy-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Why Choose Our Hostel?
          </h2>
          <p className="text-navy-600 max-w-2xl mx-auto">
            We prioritize your child's safety, health, and academic growth above
            all else.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-navy-100 group"
            >
              <div className="w-14 h-14 bg-navy-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors">
                <item.icon className="w-7 h-7 text-navy-700 group-hover:text-white" />
              </div>
              <h3 className="font-heading font-bold text-navy-900 text-lg mb-3">
                {item.title}
              </h3>
              <p className="text-navy-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Room Types & Live Availability */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                Premium Room Options
              </h2>
              <p className="text-navy-600 text-lg">
                Modern living spaces designed for student comfort and focused
                study sessions. All rooms are strictly 4-sharing to maintain
                quality.
              </p>
            </div>
            <div className="bg-navy-900 p-6 rounded-3xl text-white shadow-2xl flex flex-wrap gap-8">
              <div>
                <p className="text-navy-300 text-sm uppercase tracking-widest mb-1">
                  Boys Hostel Beds
                </p>
                <p className="text-2xl font-bold text-gold-400">
                  {loadingAvailability
                    ? "Loading..."
                    : `${availability.boys.ac + availability.boys.nonAc} Available`}
                </p>
              </div>
              <div className="w-px h-12 bg-navy-700 hidden sm:block"></div>
              <div>
                <p className="text-navy-300 text-sm uppercase tracking-widest mb-1">
                  Girls Hostel Beds
                </p>
                <p className="text-2xl font-bold text-gold-400">
                  {loadingAvailability
                    ? "Loading..."
                    : `${availability.girls.ac + availability.girls.nonAc} Available`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {roomTypes.map((room, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg border border-navy-100 flex flex-col md:flex-row"
              >
                <div className="w-full md:w-2/5 relative overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-navy-900 font-bold text-xs rounded-full shadow-sm">
                      {room.sharing}
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-3/5 p-8 flex flex-col">
                  <div className="mb-6">
                    <span className="text-gold-600 font-bold text-sm uppercase tracking-wider mb-2 block">
                      {room.type}
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-navy-900 mb-4">
                      {room.title}
                    </h3>
                    <ul className="space-y-3">
                      {room.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-navy-600 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-gold-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto pt-6 border-t border-navy-50 flex items-center justify-between">
                    <div>
                      <p className="text-navy-400 text-xs uppercase font-bold tracking-tighter mb-1">
                        Annual Fee
                      </p>
                      <div>
                        <p className="text-navy-900 font-bold text-lg">
                          {room.price}/year
                        </p>

                        <p className="text-green-600 text-sm font-semibold mt-1">
                          {room.available} Beds Available
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/hostel-apply"
                      className="p-3 bg-navy-50 hover:bg-gold-500 text-navy-700 hover:text-white rounded-xl transition-all duration-300"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Facilities & Safety Section */}
      <section className="py-20 lg:py-24 bg-navy-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2l2 3-2 3z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              World-Class Facilities & Unmatched Safety
            </h2>
            <p className="text-navy-300 max-w-2xl mx-auto">
              We've built an infrastructure that caters to every need of a
              growing student, ensuring their well-being 24/7.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {facilities.map((facility, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <facility.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h4 className="font-heading font-semibold text-lg">
                  {facility.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Healthy Lifestyle & Daily Routine Section */}
      <section className="py-20 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left: Routine Timeline */}
            <div className="w-full lg:w-3/5">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-12">
                A Disciplined Daily Routine
              </h2>
              <div className="relative space-y-8 before:absolute before:left-4 md:before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-navy-100">
                {schedule.map((item, i) => (
                  <div
                    key={i}
                    className={`relative flex items-center md:justify-between gap-8 md:gap-0 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className="hidden md:block w-5/12"></div>
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-gold-500 rounded-full flex items-center justify-center z-10 shadow-sm">
                      <item.icon className="w-4 h-4 text-navy-900" />
                    </div>
                    <div className="w-full md:w-5/12 pl-12 md:pl-0">
                      <div
                        className={`bg-navy-50 p-6 rounded-3xl border border-navy-100 hover:shadow-lg transition-all duration-300 ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}
                      >
                        <span className="text-gold-600 font-bold text-sm block mb-1">
                          {item.time}
                        </span>
                        <h4 className="font-heading font-bold text-navy-900">
                          {item.activity}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Nutrition Info */}
            <div className="w-full lg:w-2/5 space-y-8">
              <div className="bg-warm-50 p-8 rounded-[2.5rem] border border-warm-100">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
                  <UtensilsCrossed className="w-8 h-8 text-warm-600" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-navy-900 mb-4">
                  Nutritious & Hygienic Meals
                </h3>
                <p className="text-navy-600 leading-relaxed mb-8">
                  We believe a healthy mind resides in a healthy body. Our
                  kitchen follows strict hygiene protocols to serve fresh,
                  vegetarian, and balanced meals that students love.
                </p>
                <div className="space-y-4">
                  {[
                    "Pure Vegetarian Menu",
                    "Daily Fresh Vegetables",
                    "RO Filtered Cooking Water",
                    "Hygienic Modern Kitchen",
                    "Weekly Menu Variety",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-navy-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-navy-900 p-8 rounded-[2.5rem] text-white">
                <h3 className="font-heading text-xl font-bold mb-4">
                  Safety First Protocol
                </h3>
                <p className="text-navy-300 text-sm leading-relaxed mb-6">
                  From evening roll calls to 24/7 security presence, we ensure
                  no student is ever unattended.
                </p>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <ShieldCheck className="w-10 h-10 text-gold-400" />
                  <div>
                    <p className="font-bold">Strict In-Out Policy</p>
                    <p className="text-xs text-navy-400">
                      Parent authorization required for exit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Hostel Gallery Section */}
      <section id="gallery" className="py-20 lg:py-24 bg-navy-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                Hostel Life in Pictures
              </h2>
              <p className="text-navy-600">
                Take a virtual tour through our modern residential facilities.
              </p>
            </div>
            <Link
              to="/hostel-gallery"
              className="text-gold-600 font-bold hover:underline flex items-center gap-2"
            >
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px]">
            {gallery.map((item, i) => (
              <div
                key={i}
                className={`
        group relative rounded-3xl overflow-hidden shadow-md
        ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}
      `}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <p className="text-white font-bold text-xl">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-20 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              What Parents & Students Say
            </h2>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-navy-50/50 p-10 rounded-[2.5rem] border border-navy-100 relative"
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gold-500 rounded-2xl flex items-center justify-center text-white text-4xl font-serif">
                  "
                </div>
                <p className="text-navy-700 text-lg italic leading-relaxed mb-8">
                  {t.quote}
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.author}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-navy-900">
                      {t.author}
                    </h4>
                    <p className="text-navy-500 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Quick Hostel Fee Overview Section */}
      <section className="py-20 lg:py-24 bg-navy-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-navy-100">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 p-10 lg:p-16">
                <h2 className="font-heading text-3xl font-bold text-navy-900 mb-6">
                  Hostel Fee Overview
                </h2>
                <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between p-4 bg-navy-50 rounded-2xl border border-navy-100">
                    <span className="font-medium text-navy-800">
                      Non-AC Hostel (4-sharing)
                    </span>
                    <span className="font-bold text-navy-900">
                      ₹55,000 / Year
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-navy-50 rounded-2xl border border-navy-100">
                    <span className="font-medium text-navy-800">
                      AC Hostel (4-sharing)
                    </span>
                    <span className="font-bold text-navy-900">
                      ₹75,000 / Year
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-navy-900 mb-4">
                  What's Included:
                </h4>
                <div className="grid grid-cols-2 gap-y-3 mb-10">
                  {[
                    "Accomodation",
                    "All Meals",
                    "Laundry",
                    "WiFi Access",
                    "Security",
                    "Study Material",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-navy-600 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/hostel-fee"
                    className="px-8 py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-all text-center"
                  >
                    View Full Fee Structure
                  </Link>
                  <Link
                    to="/hostel-apply"
                    className="px-8 py-4 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-all text-center"
                  >
                    Apply & Pay Now
                  </Link>
                </div>
              </div>

              <div className="w-full lg:w-1/2 bg-navy-900 p-10 lg:p-16 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mb-8">
                    <IndianRupee className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white text-3xl font-bold mb-6">
                    Easy Installment Options Available
                  </h3>
                  <p className="text-navy-300 text-lg mb-8 leading-relaxed">
                    We understand the financial commitment. KRR BrightMinds
                    offers flexible payment plans and early-bird discounts for
                    siblings.
                  </p>
                  <ul className="space-y-4 text-navy-200">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gold-500 rounded-full"></div>2
                      Installments Option
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                      5% Sibling Discount
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                      Transparent Billing - No Hidden Costs
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Final CTA Section */}
      {/* <section className="py-24 lg:py-32 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2l2 3-2 3z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-gold-400 font-semibold text-sm tracking-wider uppercase mb-3">
            Residential Admissions 2026
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Give Your Child a Safe, Disciplined, and Supportive <span className="text-gold-400">Hostel Experience</span>
          </h2>
          <p className="text-navy-200 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Admissions are open for the upcoming academic session. Secure your child's spot in our premium residential facility today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/hostel-apply" className="w-full sm:w-auto px-10 py-5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-2xl shadow-xl hover:shadow-gold-500/30 transition-all duration-300 text-lg">
              Apply for Hostel Now
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all duration-300 text-lg">
              Contact Hostel Office
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <Phone className="w-5 h-5 text-gold-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs text-navy-300">Call Us</div>
                <div className="text-sm font-medium">+91 98765 43210</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <Mail className="w-5 h-5 text-gold-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs text-navy-300">Email</div>
                <div className="text-sm font-medium">hostel@krrbrightminds.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs text-navy-300">Visit</div>
                <div className="text-sm font-medium">KRR Campus, Andhra Pradesh</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <Clock className="w-5 h-5 text-gold-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs text-navy-300">Office Hours</div>
                <div className="text-sm font-medium">Mon–Sat: 9 AM – 6 PM</div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default HostelPage;
