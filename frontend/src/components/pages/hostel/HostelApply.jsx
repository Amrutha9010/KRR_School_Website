import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  User, 
  Users, 
  Home, 
  ShieldCheck, 
  BedDouble, 
  CheckCircle2, 
  Upload, 
  CreditCard, 
  Info, 
  AlertCircle,
  Phone,
  MessageSquare,
  Lock,
  ArrowRight,
  ArrowLeft,
  X,
  FileText,
  HeartPulse,
  UtensilsCrossed,
  Stethoscope,
  GraduationCap,
  IndianRupee,
  ChevronRight,
  Mail,
  MapPin,
  Clock,
  Save
} from 'lucide-react';

const HostelApplyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const receiptRef = useRef(null);

  const [formData, setFormData] = useState({
    // Student Details
    studentId: '',
    studentName: '',
    gender: '',
    dob: '',
    class: '',
    bloodGroup: '',
    aadhaarNumber: '',
    // Parent Details
    fatherName: '',
    motherName: '',
    mobile: '',
    altMobile: '',
    email: '',
    address: '',
    // Hostel Preferences
    hostelType: '', // 'boys' or 'girls'
    roomType: '', // 'ac' or 'non-ac'
    foodPreference: 'Veg',
    medicalConditions: '',
    emergencyContact: '',
    // Documents
    documents: {
      photo: null,
      aadhaar: null,
      medical: null,
      schoolId: null
    },
    // Payment
    paymentMethod: 'UPI',
    confirmed: false
  });

  const [feeDetails, setFeeDetails] = useState({
    hostelFee: 0,
    admissionFee: 5000,
    securityDeposit: 10000,
    total: 0
  });

  const [availability, setAvailability] = useState({
    boys: { ac: 0, nonAc: 0 },
    girls: { ac: 0, nonAc: 0 }
  });

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hostel/availability`);
        if (!response.ok) throw new Error('Failed to fetch availability');
        const result = await response.json();
        if (result.success) {
          setAvailability(result.data);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };
    fetchAvailability();

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    let hostelFee = 0;
    if (formData.roomType === 'ac') {
      hostelFee = 75000;
    } else if (formData.roomType === 'non-ac') {
      hostelFee = 55000;
    }
    
    setFeeDetails(prev => ({
      ...prev,
      hostelFee: hostelFee,
      total: hostelFee + prev.admissionFee + prev.securityDeposit
    }));
  }, [formData.roomType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, [field]: file.name }
      }));
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const downloadReceipt = async (paymentId) => {

  try {

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/hostel-payments/receipt/${paymentId}`
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `Hostel_Receipt_${paymentId}.pdf`;

    document.body.appendChild(a);

    a.click();

    a.remove();

  } catch (error) {

    console.error(error);

    alert("Receipt download failed");

  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Submit Application
      const appResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/hostel-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studentId: formData.studentId,
          aadhaarNumber: formData.aadhaarNumber,
          dateOfBirth: formData.dob,
          studentClass: formData.class,
          mobileNumber: formData.mobile,
          hostelType: formData.hostelType === 'boys' ? 'Boys' : 'Girls',
          roomType: formData.roomType === 'ac' ? 'AC' : 'Non-AC'
        })
      });

      const appResult = await appResponse.json();
      if (!appResponse.ok || !appResult.success) {
        throw new Error(appResult.error || appResult.message || 'Failed to submit application');
      }

      const applicationId = appResult.data._id;

      // 2. Create Razorpay Order
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/hostel-payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId })
      });

      const orderResult = await orderResponse.json();
      if (!orderResponse.ok || !orderResult.success) {
        throw new Error(orderResult.error || orderResult.message || 'Failed to create payment order');
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: orderResult.key,
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: "KRR BrightMinds School",
        description: "Hostel Admission Fee",
        order_id: orderResult.orderId,
        handler: async (response) => {
          try {
            // 4. Verify Payment
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/hostel-payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            const verifyResult = await verifyResponse.json();
            if (verifyResponse.ok && verifyResult.success) {
              setPaymentData(verifyResult.data);
              setIsSubmitted(true);
              window.scrollTo(0, 0);
              // Auto-download receipt after a short delay to ensure state is updated
              if (verifyResult.data.paymentId) {
                setTimeout(() => downloadReceipt(verifyResult.data.paymentId), 1500);
              }
            } else {
              alert(`Payment verification failed: ${verifyResult.error || verifyResult.message || 'Please contact the hostel office.'}`);
            }
          } catch (err) {
            console.error('Verification Error:', err);
            alert('Error verifying payment.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.studentName,
          email: formData.email,
          contact: formData.mobile
        },
        theme: { color: "#0f1f3a" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Submission Error:', error);
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-navy-900 mb-4">Hostel Admission Confirmed!</h1>
            <p className="text-navy-600 text-lg">
              Congratulations! Your hostel application and payment have been processed successfully.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-navy-50 p-8 rounded-3xl border border-navy-100 h-fit">
              <h3 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                <BedDouble className="w-6 h-6 text-gold-500" />
                Allocation Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-navy-100 pb-3">
                  <span className="text-navy-500">Student Name</span>
                  <span className="font-bold text-navy-900">{formData.studentName}</span>
                </div>
                <div className="flex justify-between border-b border-navy-100 pb-3">
                  <span className="text-navy-500">Hostel Wing</span>
                  <span className="font-bold text-navy-900">{formData.hostelType === 'boys' ? 'Boys' : 'Girls'} Hostel</span>
                </div>
                <div className="flex justify-between border-b border-navy-100 pb-3">
                  <span className="text-navy-500">Room Category</span>
                  <span className="font-bold text-navy-900">{formData.roomType === 'ac' ? 'AC' : 'Non-AC'}</span>
                </div>
                <div className="flex justify-between border-b border-navy-100 pb-3">
                  <span className="text-navy-500">Room Number</span>
                  <span className="font-bold text-gold-600">{paymentData?.roomNumber || 'Auto-Allocated'}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-navy-500">Payment ID</span>
                  <span className="text-xs font-mono text-navy-400">{paymentData?.paymentId}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm h-fit">
              <h3 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-navy-400" />
                Next Steps
              </h3>
              <ul className="space-y-4 text-navy-600 text-sm">
                {/* <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-navy-900 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">1</div>
                  Download and save your admission receipt for records.
                </li> */}
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-navy-900 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">2</div>
                  Report to the hostel office on the reopening date.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-navy-900 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">3</div>
                  Submit physical copies of uploaded documents at the office.
                </li>
              </ul>
              
              {/* <button 
                onClick={() => downloadReceipt()}
                disabled={isDownloading}
                className="w-full mt-8 px-8 py-4 bg-navy-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-navy-800 transition-all disabled:opacity-50"
              >
                {isDownloading ? 'Downloading PDF...' : <><Upload className="w-5 h-5 rotate-180" /> Download Admission Receipt</>}
              </button> */}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="px-8 py-4 bg-white border border-navy-200 text-navy-900 font-bold rounded-xl hover:bg-navy-50 transition-all text-center">Go to Homepage</Link>
            <Link to="/hostel" className="px-8 py-4 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-all text-center">Back to Hostel Page</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50/30 font-body text-navy-800 pb-20">
      
      {/* 1. Hero Section */}
      <section className="bg-navy-900 text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83L1.208 55.458V60H0v-4.542L54.627 0zM59.458 60H60V0H0V.542L59.458 60z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            Apply for <span className="text-gold-400">Hostel Admission</span>
          </h1>
          <p className="max-w-2xl mx-auto text-navy-100 text-lg md:text-xl leading-relaxed animate-fade-in-up animation-delay-200">
            Secure and comfortable hostel facilities for students with safety, discipline, and academic support.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Form Area */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-navy-100">
              
              {/* Step Progress Bar */}
              <div className="bg-navy-50 px-8 py-6 border-b border-navy-100">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-navy-200 -translate-y-1/2 z-0"></div>
                  <div className={`absolute top-1/2 left-0 h-0.5 bg-gold-500 -translate-y-1/2 z-0 transition-all duration-500`} style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
                  
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        currentStep >= step ? 'bg-gold-500 text-white' : 'bg-white text-navy-400 border-2 border-navy-200'
                      }`}>
                        {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                      </div>
                      <span className={`hidden sm:block text-[10px] font-bold uppercase tracking-wider mt-2 ${
                        currentStep >= step ? 'text-navy-900' : 'text-navy-400'
                      }`}>
                        {step === 1 ? 'Details' : step === 2 ? 'Preferences' : step === 3 ? 'Documents' : 'Payment'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                
                {/* Step 1: Student & Parent Details */}
                {currentStep === 1 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-navy-900" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-navy-900">Student & Parent Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-2">Student ID *</label>
                        <input 
                          type="text" 
                          name="studentId" 
                          value={formData.studentId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                          placeholder="e.g. KRR2026001"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-2">Student Full Name *</label>
                        <input 
                          type="text" 
                          name="studentName" 
                          value={formData.studentName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                          placeholder="As per Aadhaar"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Gender *</label>
                          <select 
                            name="gender" 
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                            required
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Class *</label>
                          <input 
                            type="text" 
                            name="class"
                            value={formData.class}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                            placeholder="e.g. 9th"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-2">Date of Birth *</label>
                        <input 
                          type="date" 
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Blood Group</label>
                          <select 
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                          >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Aadhaar Number *</label>
                          <input 
                            type="text" 
                            name="aadhaarNumber"
                            value={formData.aadhaarNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                            placeholder="12-digit number"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-navy-900" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-navy-900">Parent / Guardian Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-2">Father's Name *</label>
                        <input 
                          type="text" 
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-2">Mother's Name *</label>
                        <input 
                          type="text" 
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Mobile Number *</label>
                          <input 
                            type="tel" 
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Alternative Mobile Number</label>
                          <input 
                            type="tel" 
                            name="altMobile"
                            value={formData.altMobile}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-2">Email Address *</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-navy-700 mb-2">Residential Address *</label>
                        <textarea 
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all h-24"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Hostel Preferences */}
                {currentStep === 2 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center">
                        <Home className="w-6 h-6 text-navy-900" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-navy-900">Hostel Preferences</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-4">Hostel Wing *</label>
                        <div className="grid grid-cols-2 gap-4">
                          <label className={`cursor-pointer flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${formData.hostelType === 'boys' ? 'border-gold-500 bg-gold-50' : 'border-navy-100 hover:border-navy-200'}`}>
                            <input type="radio" name="hostelType" value="boys" className="hidden" onChange={handleInputChange} />
                            <Users className={`w-8 h-8 mb-2 ${formData.hostelType === 'boys' ? 'text-gold-600' : 'text-navy-400'}`} />
                            <span className="font-bold text-sm">Boys Hostel</span>
                          </label>
                          <label className={`cursor-pointer flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${formData.hostelType === 'girls' ? 'border-gold-500 bg-gold-50' : 'border-navy-100 hover:border-navy-200'}`}>
                            <input type="radio" name="hostelType" value="girls" className="hidden" onChange={handleInputChange} />
                            <Users className={`w-8 h-8 mb-2 ${formData.hostelType === 'girls' ? 'text-gold-600' : 'text-navy-400'}`} />
                            <span className="font-bold text-sm">Girls Hostel</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-4">Room Category *</label>
                        <div className="grid grid-cols-2 gap-4">
                          <label className={`cursor-pointer flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${formData.roomType === 'ac' ? 'border-gold-500 bg-gold-50' : 'border-navy-100 hover:border-navy-200'}`}>
                            <input type="radio" name="roomType" value="ac" className="hidden" onChange={handleInputChange} />
                            <BedDouble className={`w-8 h-8 mb-2 ${formData.roomType === 'ac' ? 'text-gold-600' : 'text-navy-400'}`} />
                            <span className="font-bold text-sm">AC Room</span>
                          </label>
                          <label className={`cursor-pointer flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${formData.roomType === 'non-ac' ? 'border-gold-500 bg-gold-50' : 'border-navy-100 hover:border-navy-200'}`}>
                            <input type="radio" name="roomType" value="non-ac" className="hidden" onChange={handleInputChange} />
                            <BedDouble className={`w-8 h-8 mb-2 ${formData.roomType === 'non-ac' ? 'text-gold-600' : 'text-navy-400'}`} />
                            <span className="font-bold text-sm">Non-AC Room</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-2">Food Preference *</label>
                        <select 
                          name="foodPreference"
                          value={formData.foodPreference}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                        >
                          <option value="Veg">Pure Vegetarian</option>
                          <option value="Non-Veg">Non-Vegetarian (Eggs Only)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy-700 mb-2">Emergency Contact Number *</label>
                        <input 
                          type="tel" 
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-navy-700 mb-2">Any Medical Conditions / Allergies</label>
                        <textarea 
                          name="medicalConditions"
                          value={formData.medicalConditions}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all h-24"
                          placeholder="Please mention if any..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Document Upload */}
                {currentStep === 3 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-navy-900" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-navy-900">Document Upload</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { id: 'photo', label: 'Student Passport Photo', icon: User },
                        { id: 'aadhaar', label: 'Student Aadhaar Copy', icon: ShieldCheck },
                        { id: 'medical', label: 'Medical Certificate', icon: HeartPulse },
                        { id: 'schoolId', label: 'Previous School ID', icon: GraduationCap }
                      ].map((doc) => (
                        <div key={doc.id} className="p-6 border-2 border-dashed border-navy-100 rounded-2xl hover:border-gold-500 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center group-hover:bg-gold-50 transition-colors">
                              <doc.icon className="w-6 h-6 text-navy-400 group-hover:text-gold-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-navy-900 mb-1">{doc.label}</p>
                              <p className="text-xs text-navy-400">PDF, JPG or PNG (Max 2MB)</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-lg hover:bg-navy-800 transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              {formData.documents[doc.id] ? 'Change File' : 'Upload File'}
                              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                            </label>
                            {formData.documents[doc.id] && (
                              <span className="ml-3 text-xs text-green-600 font-medium truncate inline-block max-w-[150px]">
                                {formData.documents[doc.id]}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-navy-900" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-navy-900">Secure Payment</h2>
                    </div>

                    <div className="bg-navy-900 text-white p-8 rounded-3xl mb-10">
                      <p className="text-navy-300 text-sm font-bold uppercase tracking-widest mb-2">Total Amount Payable</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">₹{feeDetails.total.toLocaleString()}</span>
                        <span className="text-navy-400 text-sm">incl. taxes</span>
                      </div>
                      
                      <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-y-4 text-sm">
                        <div className="text-navy-300">Hostel Fee ({formData.roomType === 'ac' ? 'AC' : 'Non-AC'})</div>
                        <div className="text-right font-bold">₹{feeDetails.hostelFee.toLocaleString()}</div>
                        <div className="text-navy-300">One-time Admission Fee</div>
                        <div className="text-right font-bold">₹{feeDetails.admissionFee.toLocaleString()}</div>
                        <div className="text-navy-300">Refundable Security Deposit</div>
                        <div className="text-right font-bold">₹{feeDetails.securityDeposit.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10">
                      <label className="block text-sm font-bold text-navy-700 mb-4">Select Payment Method</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['UPI', 'Card', 'Net Banking'].map((method) => (
                          <label key={method} className={`cursor-pointer flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.paymentMethod === method ? 'border-gold-500 bg-gold-50' : 'border-navy-100 hover:border-navy-200'}`}>
                            <input type="radio" name="paymentMethod" value={method} className="hidden" onChange={handleInputChange} />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method ? 'border-gold-500 bg-gold-500' : 'border-navy-200'}`}>
                              {formData.paymentMethod === method && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="font-bold text-sm">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-navy-50 rounded-2xl border border-navy-100 mb-10">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="mt-1 w-5 h-5 rounded border-navy-300 text-gold-500 focus:ring-gold-500" 
                          checked={formData.confirmed}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmed: e.target.checked }))}
                        />
                        <span className="text-sm text-navy-600 group-hover:text-navy-900 transition-colors">
                          I confirm that all the information provided above is correct and I have read the hostel rules and regulations. I understand that the security deposit is refundable only upon proper checkout.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-navy-100">
                  <div className="flex gap-4 w-full sm:w-auto">
                    {currentStep > 1 && (
                      <button 
                        type="button" 
                        onClick={prevStep}
                        className="flex-1 sm:flex-none px-8 py-4 bg-white border border-navy-200 text-navy-900 font-bold rounded-xl hover:bg-navy-50 transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" /> Back
                      </button>
                    )}
                    {/* <button 
                      type="button"
                      className="flex-1 sm:flex-none px-8 py-4 bg-navy-100 text-navy-700 font-bold rounded-xl hover:bg-navy-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" /> Save Draft
                    </button> */}
                  </div>
                  
                  {currentStep < 4 ? (
                    <button 
                      type="button" 
                      onClick={nextStep}
                      disabled={currentStep === 2 && (!formData.hostelType || !formData.roomType)}
                      className="w-full sm:w-auto px-10 py-4 bg-gold-500 text-white font-bold rounded-xl shadow-lg hover:bg-gold-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      disabled={!formData.confirmed || isSubmitting}
                      className="w-full sm:w-auto px-10 py-4 bg-gold-500 text-white font-bold rounded-xl shadow-lg hover:bg-gold-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>Complete Payment & Submit <Lock className="w-5 h-5" /></>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right: Sidebar Info */}
          <div className="w-full lg:w-1/3 space-y-8">
            
            {/* Live Availability Card */}
            <div className="bg-navy-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <BedDouble className="w-6 h-6 text-gold-400" />
                Live Availability
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-navy-400 mb-2 font-bold uppercase tracking-wider">
                    <span>Boys Hostel</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-xs text-navy-400 mb-1">AC Beds</p>
                      <p className="text-xl font-bold text-gold-400">{availability.boys.ac}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-xs text-navy-400 mb-1">Non-AC</p>
                      <p className="text-xl font-bold text-white">{availability.boys.nonAc}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-navy-400 mb-2 font-bold uppercase tracking-wider">
                    <span>Girls Hostel</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-xs text-navy-400 mb-1">AC Beds</p>
                      <p className="text-xl font-bold text-gold-400">{availability.girls.ac}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-xs text-navy-400 mb-1">Non-AC</p>
                      <p className="text-xl font-bold text-white">{availability.girls.nonAc}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs text-navy-400 italic">
                <Clock className="w-3.5 h-3.5" /> Updated 5 minutes ago
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-navy-100">
              <h3 className="text-xl font-heading font-bold text-navy-900 mb-6">Need Assistance?</h3>
              <div className="space-y-4">
                <a href="tel:+919876543210" className="flex items-center gap-4 p-4 rounded-2xl bg-navy-50 hover:bg-gold-50 transition-colors group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Phone className="w-5 h-5 text-navy-600 group-hover:text-gold-600" />
                  </div>
                  <div>
                    <p className="text-xs text-navy-400 font-bold uppercase">Call Hostel Office</p>
                    <p className="text-navy-900 font-bold">+91 98765 43210</p>
                  </div>
                </a>
                <a href="https://wa.me/919876543210" className="flex items-center gap-4 p-4 rounded-2xl bg-navy-50 hover:bg-green-50 transition-colors group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-5 h-5 text-navy-600 group-hover:text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-navy-400 font-bold uppercase">WhatsApp Inquiry</p>
                    <p className="text-navy-900 font-bold">Chat with Warden</p>
                  </div>
                </a>
              </div>
              
              <div className="mt-8 pt-8 border-t border-navy-100">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-bold text-navy-900">100% Secure Application</span>
                </div>
                <p className="text-xs text-navy-500 leading-relaxed">
                  Your personal and payment information is protected by industry-standard encryption protocols.
                </p>
              </div>
            </div>

            {/* Quick Fee Summary (Floating or Sidebar) */}
            {formData.roomType && (
              <div className="bg-gold-50 p-8 rounded-3xl border border-gold-200 animate-fade-in">
                <h3 className="font-heading font-bold text-navy-900 mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-gold-600" />
                  Fee Summary
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy-600">Hostel Fee</span>
                    <span className="font-bold">₹{feeDetails.hostelFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy-600">Admission Fee</span>
                    <span className="font-bold">₹{feeDetails.admissionFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy-600">Security Deposit</span>
                    <span className="font-bold">₹{feeDetails.securityDeposit.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gold-200 flex justify-between items-baseline">
                  <span className="font-bold text-navy-900">Total</span>
                  <span className="text-2xl font-bold text-navy-900">₹{feeDetails.total.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelApplyPage;
