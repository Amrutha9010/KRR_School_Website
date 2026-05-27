import React from 'react';
import { motion } from 'framer-motion';
import { Bus, User, Clock, MapPin, Users, ChevronRight, CheckCircle2, IndianRupee } from 'lucide-react';
import MiniRouteMap from './MiniRouteMap';

const BusRouteCards = ({ routes, pickupPoints }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      {routes.map((route, index) => {
        const routeCheckpoints = pickupPoints.filter(p => p.route?._id === route._id || p.route === route._id);
        
        return (
          <motion.div
            key={route._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] flex flex-col gap-6 hover:bg-white/10 transition-all group relative overflow-hidden"
          >
            {/* Background Gradient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] group-hover:bg-blue-600/20 transition-all" />

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20">
                      {route.routeNumber}
                    </span>
                    <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {route.timing.pickup}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {route.bus?.availableSeats} Seats Available
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {route.routeName}
                </h3>
                
                <div className="flex items-center gap-1 text-gold-400 font-bold mb-4 bg-gold-500/10 w-fit px-3 py-1 rounded-lg border border-gold-500/20">
                  <IndianRupee className="w-4 h-4" />
                  <span>{route.fee.toLocaleString()} / Year</span>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Checkpoints Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-gray-300 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        Route Checkpoints
                      </p>
                      <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">
                        {routeCheckpoints.length} Stops
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {routeCheckpoints.map((cp, i) => (
                        <div key={cp._id} className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-gray-300">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {cp.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Driver & Bus Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Bus className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Bus No</p>
                        <p className="text-sm font-bold text-white">{route.bus?.busNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <User className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Driver</p>
                        <p className="text-sm font-bold text-white">{route.bus?.driverName}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 italic">
                  Villages: {route.villagesCovered.join(' • ')}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <MiniRouteMap 
                  path={route.path} 
                  busLocation={route.bus?.currentLocation} 
                />
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all border border-white/10 flex items-center justify-center gap-2">
                  View Full Schedule
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BusRouteCards;
