import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from '../utils/api';
import { motion } from 'framer-motion';
import UniversitySearch from '../components/UniversitySearch';

const BrowseForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    university: '',
    minPrice: '',
    maxPrice: ''
  });
  const [selectedUniversity, setSelectedUniversity] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.university) queryParams.append('university', filters.university);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      const response = await api.get(`/forms?${queryParams}`);
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (selectedUniversity) queryParams.append('university', selectedUniversity);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    
    fetchForms(queryParams);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4"
    >
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-6"
      >
        Browse Available Rooms
      </motion.h1>

      {/* Filters */}
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSearch} 
        className="mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end"
      >
        <div className="flex-1">
          <label className="text-sm mb-2 block">University</label>
          <UniversitySearch
            value={selectedUniversity}
            onChange={setSelectedUniversity}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div>
            <label className="text-sm">Min Price</label>
            <Input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min price"
            />
          </div>
          <div>
            <label className="text-sm">Max Price</label>
            <Input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max price"
            />
          </div>
        </div>
        <Button type="submit" className="w-full md:w-auto">Search</Button>
      </motion.form>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {forms.map((form, index) => (
          <motion.div
            key={form._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Link to={`/forms/${form._id}`}>
              <Card className="h-full hover:shadow-lg transition-all">
                {form.roomDetails.images?.[0] && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={form.roomDetails.images[0]}
                      alt="Room"
                      className="w-full h-full object-cover"
                    />
                    {form.boostStatus && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        BOOSTED
                      </div>
                    )}
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">
                    {form.roomDetails.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Near {form.roomDetails.nearbyUniversity}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg text-primary">
                      ${form.roomDetails.monthlyRent}/month
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {form.roomDetails.totalBedrooms} bed • {form.roomDetails.totalBathrooms} bath
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {form.roomDetails.address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {forms.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground mt-8"
        >
          No rooms found matching your criteria
        </motion.div>
      )}
    </motion.div>
  );
};

export default BrowseForms; 