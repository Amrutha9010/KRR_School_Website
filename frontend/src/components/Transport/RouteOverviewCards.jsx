import React from 'react';
import { motion } from 'framer-motion';
import { Bus, Phone, MapPin, IndianRupee } from 'lucide-react';

const RouteOverviewCards = ({ routes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-16">
      {routes.map((route, index) => (
        <motion.div
          key={route._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all overflow-hidden"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/10 blur-2xl group-hover:bg-blue-600/20 transition-all" />

          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600/20 rounded-2xl group-hover:scale-110 transition-transform">
              <Bus className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-gold-400 font-bold bg-gold-500/10 px-3 py-1 rounded-lg border border-gold-500/20 text-sm">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>{route.fee.toLocaleString()}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {route.routeName}
          </h3>
          
          <p className="text-gray-400 text-xs mb-6 line-clamp-1">
            {route.villagesCovered.join(' • ')}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Bus Number</p>
                <p className="font-bold">{route.bus?.busNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Driver Contact</p>
                <p className="font-bold">{route.bus?.driverContact}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RouteOverviewCards;
