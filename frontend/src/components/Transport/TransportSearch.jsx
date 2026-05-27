import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const TransportSearch = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Using OpenStreetMap Nominatim API (Free)
      // Added region hints to prioritize local villages near Tadikalapudi/Eluru
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Eluru Andhra Pradesh')}&countrycodes=in&limit=5`
      );
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your village or area name..."
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pl-14"
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
        </div>
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
        >
          Search
        </button>
      </form>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {results.map((item) => (
              <button
                key={item.place_id}
                onClick={() => {
                  onLocationSelect(item);
                  setResults([]);
                  setQuery(item.display_name);
                }}
                className="w-full px-6 py-4 flex items-start gap-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-none text-left"
              >
                <MapPin className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                <div>
                  <p className="text-white font-medium line-clamp-1">{item.display_name}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Lat: {parseFloat(item.lat).toFixed(4)}, Lng: {parseFloat(item.lon).toFixed(4)}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransportSearch;
