import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from '../utils/api';

const BrowseForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    university: '',
    minPrice: '',
    maxPrice: ''
  });

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
    fetchForms();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Browse Available Rooms</h1>

      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
        <div className="flex-1">
          <label className="text-sm">University</label>
          <Input
            type="text"
            name="university"
            value={filters.university}
            onChange={handleFilterChange}
            placeholder="Near which university?"
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
      </form>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {forms.map(form => (
          <Link key={form._id} to={`/forms/${form._id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">
                  Near {form.roomDetails.nearbyUniversity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold text-lg">
                    ${form.roomDetails.monthlyRent}/month
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {form.roomDetails.totalBedrooms} bed • {form.roomDetails.totalBathrooms} bath
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {form.roomDetails.address}
                  </p>
                  {form.boostStatus && (
                    <div className="text-xs text-primary font-semibold">
                      BOOSTED
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {forms.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          No rooms found matching your criteria
        </div>
      )}
    </div>
  );
};

export default BrowseForms; 