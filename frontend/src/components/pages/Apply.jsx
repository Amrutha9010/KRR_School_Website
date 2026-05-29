import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { 
  Home, 
  ChevronRight, 
  User, 
  FileText, 
  Upload, 
  CreditCard, 
  CheckCircle2, 
  Info, 
  Plus, 
  Minus,
  GraduationCap,
  Bus,
  ShieldCheck,
  HeartPulse,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  AlertCircle,
  X,
  Eye,
  Trash2,
  Lock,
  ArrowRight,
  Copy,
  Check,
  Download,
  Printer
} from 'lucide-react'

const Apply = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [activeFaq, setActiveFaq] = useState(null)
  const [showIdPopup, setShowIdPopup] = useState(false)
  const [generatedId, setGeneratedId] = useState('')
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const receiptRef = useRef(null)
  const [formData, setFormData] = useState({
    // Student Info
    studentName: '',
    gender: '',
    dob: '',
    aadhaar: '',
    bloodGroup: '',
    nationality: 'Indian',
    previousSchool: '',
    classApplying: '',
    academicYear: '2025-26',
    // Parent Info
    fatherName: '',
    motherName: '',
    occupation: '',
    mobile: '',
    altMobile: '',
    email: '',
    address: '',
    city: '',
    state: 'Andhra Pradesh',
    pincode: '',
    // Emergency
    emergencyName: '',
    emergencyPhone: '',
    relationship: '',
    // Medical
    medicalConditions: '',
    allergies: '',
    specialNeeds: '',
    doctorName: '',
    // Documents (Simulated)
    documents: {
      photo: null,
      birthCert: null,
      aadhaarCopy: null,
      reportCard: null,
      tc: null,
      parentId: null
    },
    // Payment
    paymentMethod: 'UPI',
    confirmed: false
  })

  const [fees, setFees] = useState({
    admission: 0,
    tuition: 0,
    annual: 0,
    total: 0
  })

  const feeConfig = {
    'LKG': { admission: 5000, tuition: 12000, annual: 3000 },
    'UKG': { admission: 5000, tuition: 12000, annual: 3000 },
    'Grade 1': { admission: 7000, tuition: 15000, annual: 4000 },
    'Grade 2': { admission: 7000, tuition: 15000, annual: 4000 },
    'Grade 3': { admission: 7000, tuition: 15000, annual: 4000 },
    'Grade 4': { admission: 7000, tuition: 18000, annual: 5000 },
    'Grade 5': { admission: 7000, tuition: 18000, annual: 5000 },
    'Grade 6': { admission: 10000, tuition: 22000, annual: 6000 },
    'Grade 7': { admission: 10000, tuition: 22000, annual: 6000 },
    'Grade 8': { admission: 10000, tuition: 22000, annual: 6000 },
    'Grade 9': { admission: 12000, tuition: 25000, annual: 8000 },
    'Grade 10': { admission: 12000, tuition: 25000, annual: 8000 }
  }

  useEffect(() => {
    let newFees = { admission: 0, tuition: 0, annual: 0, total: 0 }
    
    if (formData.classApplying && feeConfig[formData.classApplying]) {
      const config = feeConfig[formData.classApplying]
      newFees.admission = config.admission
      newFees.tuition = config.tuition
      newFees.annual = config.annual
    }

    newFees.total = newFees.admission + newFees.tuition + newFees.annual
    setFees(newFees)
  }, [formData.classApplying])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e, field) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, [field]: file.name }
      }))
    }
  }

  const nextStep = () => {
    if (currentStep === 4) {
      handlePayment()
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handlePayment = async () => {
    if (!formData.confirmed) {
      alert('Please confirm that the information provided is correct.')
      return
    }

    try {
      // 1. Create Order on Backend
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: fees.total,
          receipt: `rcpt_${Date.now()}`
        })
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert('Failed to initiate payment. Please try again.');
        return;
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: 'rzp_test_Su49SXdZC7fspk', // In production, use environment variable
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'KRR BrightMinds School',
        description: `Admission Fee for ${formData.studentName}`,
        order_id: orderData.data.id,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Payment successful, move to next step
            setCurrentStep(5);
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: formData.fatherName || formData.studentName,
          email: formData.email,
          contact: formData.mobile
        },
        theme: {
          color: '#0f172a' // Navy 900
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('An error occurred while processing payment.');
    }
  }

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`KRR_Admission_Receipt_${generatedId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Student Details', icon: User },
    { id: 2, title: 'Parent Info', icon: GraduationCap },
    { id: 3, title: 'Documents', icon: Upload },
    { id: 4, title: 'Fee & Payment', icon: CreditCard },
    { id: 5, title: 'Confirmation', icon: CheckCircle2 }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (currentStep < 5) {
      nextStep()
    } else {
      if (!formData.confirmed) {
        alert('Please confirm that the information provided is correct.')
        return
      }
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            fees: fees
          }),
        });

        const result = await response.json();
 
         if (result.success) {
           setGeneratedId(result.studentId)
           setShowIdPopup(true)
         } else {
          alert('Submission failed: ' + result.error)
        }
      } catch (error) {
        console.error('Error submitting application:', error)
        alert('An error occurred. Please try again later.')
      }
    }
  }

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
            <span className="text-gold-400 text-sm font-medium">Apply for Admission</span>
          </nav> */}

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Apply for <span className="text-gold-400">Admission</span>
          </h1>
          <p className="max-w-3xl mx-auto text-navy-100 text-lg md:text-xl leading-relaxed animate-fade-in-up animation-delay-200">
            Begin your child’s learning journey with KRR BrightMinds School through our simple and secure admission process.
          </p>
        </div>
      </section>

      {/* Admission Process Steps Section */}
      <section className="py-12 lg:py-16 bg-white border-b border-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative">
            {/* Desktop Progress Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-navy-100 -translate-y-1/2 z-0"></div>
            
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`relative z-10 flex flex-col items-center group cursor-pointer transition-all duration-300 ${currentStep === step.id ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all duration-300 ${
                  currentStep >= step.id ? 'bg-navy-900 text-gold-400' : 'bg-white text-navy-400 border border-navy-100'
                }`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-navy-400 block mb-1">Step {step.id}</span>
                  <span className={`text-sm font-bold ${currentStep >= step.id ? 'text-navy-900' : 'text-navy-500'}`}>{step.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-step Form Section */}
      <section className="py-12 lg:py-16 bg-navy-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main Form Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-navy-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 lg:p-12">
                  
                  {/* Step 1: Student Information */}
                  {currentStep === 1 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-4 mb-10 pb-4 border-b border-navy-50">
                        <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-gold-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-heading font-bold text-navy-900">Student Information</h2>
                          <p className="text-navy-500 text-sm">Please provide the basic details of the applicant.</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Student Full Name *</label>
                          <input type="text" name="studentName" required value={formData.studentName} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Enter full name" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Gender *</label>
                          <select name="gender" required value={formData.gender} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Date of Birth *</label>
                          <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Aadhaar Number</label>
                          <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="12-digit Aadhaar" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Class Applying For *</label>
                          <select name="classApplying" required value={formData.classApplying} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none">
                            <option value="">Select Class</option>
                            {Object.keys(feeConfig).map(cls => <option key={cls} value={cls}>{cls}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Previous School Name</label>
                          <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Previous school name" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Parent Information */}
                  {currentStep === 2 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-4 mb-10 pb-4 border-b border-navy-50">
                        <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-gold-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-heading font-bold text-navy-900">Parent / Guardian Information</h2>
                          <p className="text-navy-500 text-sm">Details of the primary contact for the student.</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Father’s Name *</label>
                          <input type="text" name="fatherName" required value={formData.fatherName} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Full name" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Mother’s Name *</label>
                          <input type="text" name="motherName" required value={formData.motherName} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Full name" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Mobile Number *</label>
                          <input type="tel" name="mobile" required value={formData.mobile} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Email Address *</label>
                          <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="email@example.com" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-navy-700 mb-2">Residential Address *</label>
                          <textarea name="address" required rows="3" value={formData.address} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Full address"></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">City</label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="City" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-navy-700 mb-2">Pincode</label>
                          <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-navy-50 border border-navy-100 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" placeholder="6-digit code" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Document Upload */}
                  {currentStep === 3 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-4 mb-10 pb-4 border-b border-navy-50">
                        <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gold-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-heading font-bold text-navy-900">Required Documents</h2>
                          <p className="text-navy-500 text-sm">Upload digital copies of essential documents.</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6 mb-8">
                        {[
                          { label: 'Student Photo *', id: 'photo' },
                          { label: 'Birth Certificate *', id: 'birthCert' },
                          { label: 'Aadhaar Card Copy *', id: 'aadhaarCopy' },
                          { label: 'Previous Report Card', id: 'reportCard' },
                          { label: 'Transfer Certificate', id: 'tc' },
                          { label: 'Parent ID Proof', id: 'parentId' }
                        ].map(doc => (
                          <div key={doc.id} className="p-6 border-2 border-dashed border-navy-100 rounded-2xl bg-navy-50/30 group hover:border-gold-400 hover:bg-white transition-all">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-bold text-navy-700">{doc.label}</span>
                              {formData.documents[doc.id] && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                            </div>
                            {formData.documents[doc.id] ? (
                              <div className="flex items-center justify-between bg-navy-50 p-3 rounded-xl">
                                <span className="text-xs text-navy-500 truncate max-w-[150px]">{formData.documents[doc.id]}</span>
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, documents: { ...prev.documents, [doc.id]: null } }))} className="text-red-500 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center cursor-pointer">
                                <Upload className="w-6 h-6 text-navy-400 mb-2 group-hover:text-gold-600 transition-colors" />
                                <span className="text-xs text-navy-400 font-medium">Click to upload</span>
                                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, doc.id)} />
                              </label>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Fee & Payment */}
                  {currentStep === 4 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-4 mb-10 pb-4 border-b border-navy-50">
                        <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-gold-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-heading font-bold text-navy-900">Fee Summary & Payment</h2>
                          <p className="text-navy-500 text-sm">Review your admission fee and select a payment method.</p>
                        </div>
                      </div>

                      <div className="bg-navy-900 text-white rounded-[2rem] p-8 mb-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <h3 className="text-xl font-bold mb-6 text-gold-400 border-b border-white/10 pb-4">Fee Breakdown</h3>
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between text-navy-200">
                            <span>Admission Fee</span>
                            <span>₹{fees.admission.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-navy-200">
                            <span>Tuition Fee</span>
                            <span>₹{fees.tuition.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-navy-200">
                            <span>Annual Fee</span>
                            <span>₹{fees.annual.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-6 border-t border-white/20">
                          <span className="text-xl font-bold">Total Amount</span>
                          <span className="text-3xl font-bold text-gold-400">₹{fees.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mb-8">
                        <label className="block text-sm font-bold text-navy-700 mb-4">Select Payment Method</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {['UPI', 'Card', 'Banking', 'QR'].map(method => (
                            <div 
                              key={method}
                              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                              className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${
                                formData.paymentMethod === method 
                                  ? 'border-gold-500 bg-gold-50 text-gold-700 shadow-md' 
                                  : 'border-navy-50 bg-white text-navy-500 hover:border-navy-100'
                              }`}
                            >
                              <span className="text-sm font-bold">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-navy-50 rounded-xl border border-navy-100">
                        <input 
                          type="checkbox" 
                          name="confirmed"
                          checked={formData.confirmed}
                          onChange={handleInputChange}
                          className="mt-1 w-5 h-5 accent-navy-900"
                        />
                        <p className="text-sm text-navy-600">
                          I confirm that all the information provided is correct and I have read the admission guidelines and fee policies.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Success / Confirmation */}
                  {currentStep === 5 && (
                    <div className="animate-fade-in text-center py-10">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-heading font-bold text-navy-900 mb-4">Application Ready to Submit!</h2>
                      <p className="text-navy-600 max-w-md mx-auto mb-10 leading-relaxed">
                        Your application for {formData.studentName} for class {formData.classApplying} is ready for submission. Please click the button below to complete the process.
                      </p>
                      <div className="bg-navy-50 p-6 rounded-2xl border border-navy-100 max-w-sm mx-auto text-left mb-10">
                        <div className="flex items-center gap-3 mb-4">
                          <Lock className="w-5 h-5 text-navy-400" />
                          <span className="text-sm font-bold text-navy-900">Secure Submission</span>
                        </div>
                        <p className="text-xs text-navy-500 leading-relaxed">
                          By submitting, you agree to our terms and conditions. Your data is encrypted and handled securely by our administrative team.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Form Navigation Buttons */}
                  <div className="mt-12 pt-8 border-t border-navy-50 flex items-center justify-between gap-4">
                    {currentStep > 1 && (
                      <button 
                        type="button" 
                        onClick={prevStep}
                        className="px-8 py-3.5 bg-white border border-navy-100 text-navy-700 font-bold rounded-xl hover:bg-navy-50 transition-colors"
                      >
                        Previous
                      </button>
                    )}
                    <div className="flex gap-4 ml-auto w-full sm:w-auto">
                      {currentStep < 5 ? (
                        <button 
                          type="button" 
                          onClick={nextStep}
                          className="w-full sm:w-auto px-10 py-3.5 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-all shadow-lg"
                        >
                          Continue
                        </button>
                      ) : (
                        <button 
                          type="submit"
                          className="w-full sm:w-auto px-10 py-3.5 bg-gold-500 text-navy-900 font-bold rounded-xl hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20"
                        >
                          Submit Application
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar Information Area */}
            <div className="lg:col-span-1 space-y-8">
              {/* Support Card */}
              <div className="bg-navy-900 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Phone className="w-6 h-6 text-gold-400" />
                  Admission Help
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-navy-400 text-xs uppercase tracking-widest font-bold mb-2">Call Office</p>
                    <p className="text-lg font-bold">+91 96529 93865</p>
                  </div>
                  <div>
                    <p className="text-navy-400 text-xs uppercase tracking-widest font-bold mb-2">Email Inquiry</p>
                    <p className="text-lg font-bold text-sm">admissions@krrschools.com</p>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-navy-400 text-xs uppercase tracking-widest font-bold mb-2">Office Timing</p>
                    <p className="font-medium text-navy-100">Mon - Sat: 9 AM - 4 PM</p>
                  </div>
                  <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 font-bold">
                    <MessageSquare className="w-5 h-5 text-gold-400" />
                    WhatsApp Us
                  </button>
                </div>
              </div>

              {/* Guidelines Card */}
              <div className="bg-white rounded-[2rem] p-8 border border-navy-100 shadow-md">
                <h3 className="text-xl font-bold mb-6 text-navy-900">Guidelines</h3>
                <div className="space-y-4">
                  {[
                    "Keep scanned documents ready",
                    "Aadhaar is mandatory for Grade 1+",
                    "Fee once paid is non-refundable",
                    "Verify all details before submission"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-gold-600" />
                      </div>
                      <span className="text-sm text-navy-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">Common Questions</h2>
            <div className="w-20 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-4">
            {[
              { q: "How will I know my admission status?", a: "Once you submit the application, our team will review the documents and schedule an interaction. You will receive an SMS and Email notification within 48 hours." },
              { q: "Is transport available in my area?", a: "We cover most areas in and around Tadikalapudi and Kamavarapukota. Please check our transport routes on the Facilities page or call our help desk." },
              { q: "Can fee be paid in installments?", a: "Yes, tuition fees can be paid in three installments (June, October, and January)." }
            ].map((faq, idx) => (
              <div key={idx} className="border border-navy-100 rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-navy-50/50 transition-colors">
                  <span className="font-bold text-navy-900">{faq.q}</span>
                  {activeFaq === idx ? <Minus className="w-5 h-5 text-gold-600" /> : <Plus className="w-5 h-5 text-gold-600" />}
                </button>
                {activeFaq === idx && <div className="p-6 pt-0 bg-white text-navy-600 border-t border-navy-50">{faq.a}</div>}
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
                Give Your Child the <br />
                <span className="text-gold-400">Best Learning Environment</span>
              </h2>
              <p className="text-navy-200 text-lg mb-10 max-w-2xl mx-auto">Safe campus, modern education, caring faculty, and holistic development.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-10 py-5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-1">Contact Admission Team</button>
                <button className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-1">Schedule Campus Visit</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Student ID Popup Card */}
      {showIdPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 lg:p-10 relative overflow-hidden border border-navy-100">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-navy-900/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-heading font-bold text-navy-900 mb-2">Registration Successful!</h2>
              <p className="text-navy-500 mb-8">Welcome to KRR BrightMinds School. Your unique Student ID has been generated.</p>
              
              <div className="bg-navy-50 rounded-2xl p-6 mb-8 border border-navy-100 group relative">
                <span className="text-xs font-bold text-navy-400 uppercase tracking-widest block mb-2">Unique Student ID</span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl font-heading font-black text-navy-900 tracking-wider">{generatedId}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generatedId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-2 hover:bg-navy-100 rounded-lg transition-colors text-navy-400 hover:text-navy-900"
                    title="Copy ID"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copied && (
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-green-600 animate-fade-in">
                    Copied to clipboard!
                  </span>
                )}
              </div>
              
              <div className="space-y-4 mb-8 text-left bg-gold-50 p-5 rounded-2xl border border-gold-100">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-gold-800 leading-relaxed">
                    Please <strong>save this ID</strong> carefully. It will be required for all future fee payments and accessing your student portal.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={downloadReceipt}
                disabled={isDownloading}
                className="w-full py-4 bg-gold-500 text-navy-900 font-bold rounded-xl hover:bg-gold-600 transition-all shadow-lg flex items-center justify-center gap-2 group mb-4"
              >
                {isDownloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    Download Receipt
                  </>
                )}
              </button>

              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Receipt Template for PDF Generation */}
      <div className="fixed left-[-9999px] top-0">
        <div ref={receiptRef} className="w-[800px] p-12 bg-white text-navy-900">
          {/* Header */}
          <div className="flex justify-between items-start border-b-4 border-gold-500 pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-heading font-black text-navy-900 mb-2">KRR BRIGHTMINDS SCHOOL</h1>
              <p className="text-navy-500 font-medium italic">Empowering Minds, Shaping Futures</p>
              <div className="mt-4 space-y-1 text-sm text-navy-600">
                <p>Main Road, Rural Town, Andhra Pradesh - 534xxx</p>
                <p>Phone: +91 96529 93865 | Email: info@krrschools.com</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-navy-900 text-white px-6 py-3 rounded-xl mb-4 inline-block">
                <p className="text-xs uppercase tracking-widest font-bold opacity-70">Receipt Number</p>
                <p className="text-xl font-bold">#REC-{Date.now().toString().slice(-6)}</p>
              </div>
              <p className="text-sm font-bold text-navy-400">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Student Info Section */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="bg-navy-50 p-8 rounded-[2rem] border border-navy-100">
              <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest mb-6 border-b border-navy-200 pb-2">Student Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-navy-500 font-medium">Name:</span>
                  <span className="font-bold text-navy-900 uppercase">{formData.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500 font-medium">Student ID:</span>
                  <span className="font-bold text-navy-900">{generatedId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500 font-medium">Class:</span>
                  <span className="font-bold text-navy-900">{formData.classApplying}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500 font-medium">Gender:</span>
                  <span className="font-bold text-navy-900">{formData.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500 font-medium">Academic Year:</span>
                  <span className="font-bold text-navy-900">{formData.academicYear}</span>
                </div>
              </div>
            </div>

            <div className="bg-navy-50 p-8 rounded-[2rem] border border-navy-100">
              <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest mb-6 border-b border-navy-200 pb-2">Parent Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-navy-500 font-medium">Father's Name:</span>
                  <span className="font-bold text-navy-900 uppercase">{formData.fatherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500 font-medium">Mobile:</span>
                  <span className="font-bold text-navy-900">{formData.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500 font-medium">Email:</span>
                  <span className="font-bold text-navy-900">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500 font-medium">Payment Mode:</span>
                  <span className="font-bold text-navy-900">{formData.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="mb-12">
            <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest mb-6 border-b border-navy-200 pb-2">Fee Breakdown</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-navy-900 text-white">
                  <th className="px-6 py-4 rounded-l-xl">Description</th>
                  <th className="px-6 py-4 text-right rounded-r-xl">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="text-navy-700">
                <tr className="border-b border-navy-100">
                  <td className="px-6 py-4 font-medium">Admission Registration Fee</td>
                  <td className="px-6 py-4 text-right font-bold">₹{fees.admission.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-navy-100">
                  <td className="px-6 py-4 font-medium">Tuition Fee (Annual)</td>
                  <td className="px-6 py-4 text-right font-bold">₹{fees.tuition.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-navy-100">
                  <td className="px-6 py-4 font-medium">Infrastructure & Maintenance Fee</td>
                  <td className="px-6 py-4 text-right font-bold">₹{fees.annual.toLocaleString()}</td>
                </tr>
                <tr className="bg-navy-50">
                  <td className="px-6 py-5 text-xl font-black text-navy-900">Total Paid</td>
                  <td className="px-6 py-5 text-right text-2xl font-black text-gold-600">₹{fees.total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="grid grid-cols-2 gap-8 items-end pt-12">
            <div className="text-navy-400 text-xs italic">
              <p>* This is a computer-generated receipt and does not require a physical signature.</p>
              <p>* Keep this receipt for future reference during the interaction session.</p>
            </div>
            <div className="text-right">
              <div className="w-48 h-1 bg-navy-100 ml-auto mb-4"></div>
              <p className="text-navy-900 font-bold uppercase tracking-widest">Authorized Signatory</p>
              <p className="text-navy-400 text-xs">Accounts Department, KRR School</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Apply
