import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, Navigation, Clock, MapPin, User, Phone, CheckCircle2, X, Receipt, Bus, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import TransportStats from './TransportStats';
import TransportSearch from './TransportSearch';
import TransportMap from './TransportMap';
import BusRouteCards from './BusRouteCards';
import TransportRegistration from './TransportRegistration';


const TransportDashboard = () => {
  const [stats, setStats] = useState(null);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [nearestInfo, setNearestInfo] = useState(null);
  const [findingRoute, setFindingRoute] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  
  const [finalAssignment, setFinalAssignment] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  const schoolLocation = { lat: 16.816, lng: 81.233 };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/transport/dashboard`);
      if (response.data.success) {
        setStats(response.data.stats);
        setBuses(response.data.buses);
        setRoutes(response.data.routes);
        setPickupPoints(response.data.pickupPoints);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load transport data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location) => {
    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lon);
    
    setSearchedLocation({
      name: location.display_name,
      lat,
      lng
    });

    setFindingRoute(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/transport/find-nearest`, { lat, lng });
      if (response.data.success) {
        setNearestInfo(response.data);
        setSelectedRouteId(response.data.nearestPoint.route._id);
        toast.success('Found nearest transport route!');
      }
    } catch (error) {
      console.error('Error finding nearest transport:', error);
      toast.error('No routes found near your location');
      setNearestInfo(null);
    } finally {
      setFindingRoute(false);
    }
  };

  const onRegisterSuccess = (assignment) => {
    setFinalAssignment(assignment);
    setShowReceipt(true);
    fetchDashboardData(); // Refresh stats
  };

  const handleDownloadReceipt = async () => {
    if (finalAssignment && finalAssignment.paymentId) {
      window.location.href = `${import.meta.env.VITE_API_URL}/api/transport/receipt/${finalAssignment.paymentId}`;
      return;
    }

    if (!receiptRef.current) {
      console.error("Receipt reference is missing");
      return;
    }
    
    setIsDownloading(true);
    toast.loading('Preparing your document...', { id: 'pdf-gen' });

    try {
      // Small delay to ensure any layout shifts or animations are settled
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Ensure the cloned element is visible for capture
          const clonedElement = clonedDoc.querySelector('[ref-id="receipt-content"]');
          if (clonedElement) {
            clonedElement.style.display = 'block';
            clonedElement.style.visibility = 'visible';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2] // Match PDF size to canvas size
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`KRR_Transport_Receipt_${finalAssignment?.studentId || 'New'}.pdf`);
      
      toast.success('Receipt downloaded successfully!', { id: 'pdf-gen' });
    } catch (error) {
      console.error('PDF Generation Error Detail:', error);
      toast.error('Failed to generate PDF. Please try again or take a screenshot.', { id: 'pdf-gen' });
    } finally {
      setIsDownloading(false);
    }
  };

  const onManualLocationDetect = (location, nearest) => {
    setSearchedLocation({
      name: location.display_name,
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon)
    });
    setNearestInfo(nearest);
    setSelectedRouteId(nearest.nearestPoint.route._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Loading Smart Transport System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          >
            Smart Transport Search
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Find the nearest bus route and pickup point dynamically
          </motion.p>
        </div>

        {/* Stats Section */}
        <TransportStats stats={stats} />

        {/* Search Section */}
        <TransportSearch onLocationSelect={handleLocationSelect} />

        {/* Main Content: Map and Registration */}
        <div className="grid grid-cols-1 gap-12">
          <div className="relative">
            <TransportMap 
              schoolLocation={schoolLocation}
              routes={routes}
              buses={buses}
              pickupPoints={pickupPoints}
              searchedLocation={searchedLocation}
              selectedRouteId={selectedRouteId}
            />

            {/* Nearest Info Floating Badge (Optional since we have Registration Section) */}
            <AnimatePresence>
              {nearestInfo && !finalAssignment && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  className="absolute top-6 right-6 z-20 bg-blue-600/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20"
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Nearest Route</p>
                    <p className="font-bold">{nearestInfo.nearestPoint.route.routeName}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Overlay for Finding Route */}
            {findingRoute && (
              <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl text-center shadow-2xl">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Analyzing Routes...</h3>
                  <p className="text-gray-400">Finding the most efficient pickup point for you</p>
                </div>
              </div>
            )}
          </div>

          {/* All Pickup Checkpoints Section */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">All Pickup Checkpoints</h2>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs">
                  Total {pickupPoints.length} Active Stops
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pickupPoints.map((point, idx) => (
                <motion.div
                  key={point._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all flex items-start gap-4"
                >
                  <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: point.route?.color + '15' || '#3b82f615' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: point.route?.color || '#3b82f6' }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{point.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold tracking-wider mt-0.5 uppercase">
                    Route: {point.route?.routeName}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {point.route?.timing.pickup}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                      <Bus className="w-3.5 h-3.5" />
                      {point.route?.bus.busNumber}
                    </div>
                  </div>
                </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bus Route Cards Section */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Available Bus Routes</h2>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live Tracking Active
                </span>
              </div>
            </div>
            <BusRouteCards 
              routes={routes} 
              pickupPoints={pickupPoints} 
              onBookRoute={(route) => {
                setSelectedRouteId(route._id);
                // Scroll to registration
                const regElement = document.getElementById('transport-registration');
                if (regElement) regElement.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>

          {/* New Registration & Payment Section */}
          <TransportRegistration 
            nearestInfo={nearestInfo} 
            searchedLocation={searchedLocation} 
            onRegisterSuccess={onRegisterSuccess}
            onManualLocationDetect={onManualLocationDetect}
          />
        </div>

        {/* Receipt Modal */}
        <AnimatePresence>
          {showReceipt && finalAssignment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white text-slate-900 w-full max-w-md rounded-[3rem] p-0 shadow-2xl relative overflow-hidden"
              >
                {/* Printable Content Area */}
                <div 
                  ref={receiptRef} 
                  ref-id="receipt-content"
                  className="p-10 bg-white relative"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-3 bg-blue-600" />
                  
                  {/* Receipt Header */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Bus className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left leading-tight">
                        <span className="font-black text-blue-600 text-lg block">KRR BRIGHTMINDS</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">School Transport Dept.</span>
                      </div>
                    </div>
                    
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Payment Successful</h3>
                    <p className="text-slate-500 font-medium">Receipt ID: {finalAssignment.studentId}-{Date.now().toString().slice(-4)}</p>
                  </div>

                  <div className="space-y-4 border-t border-b border-slate-100 py-6 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Student Name</span>
                      <span className="font-bold">{finalAssignment.studentName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Student ID</span>
                      <span className="font-bold">{finalAssignment.studentId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Assigned Bus</span>
                      <span className="font-bold">{finalAssignment.bus?.busNumber || 'AP-37-KRR-01'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Pickup Point</span>
                      <span className="font-bold">{finalAssignment.pickupPoint?.name || 'Main Junction'}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 mt-2 border-t border-dashed border-slate-200">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Amount Paid</span>
                      <span className="font-black text-blue-600 text-lg">₹{finalAssignment.paidAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-5 flex items-start gap-4 mb-4">
                    <div className="p-2 bg-blue-600 rounded-xl">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Transport Active</p>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                        Valid for the academic year 2026-27.
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-center text-slate-400 font-medium">
                    This is a computer generated receipt. Signature not required.
                  </div>
                </div>

                {/* Footer Buttons (Not captured by ref) */}
                <div className="p-10 pt-0 bg-white space-y-3">
                  
                  <button
                    onClick={() => setShowReceipt(false)}
                    className="w-full bg-white text-slate-400 py-3 rounded-xl text-sm font-bold hover:text-slate-600 transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default TransportDashboard;
