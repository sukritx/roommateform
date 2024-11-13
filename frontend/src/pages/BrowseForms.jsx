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
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Available Rooms</h1>

      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-4 items-end">
        <div>
          <label className="text-sm">University</label>
          <Input
            type="text"
            name="university"
            value={filters.university}
            onChange={handleFilterChange}
            placeholder="Near which university?"
          />
        </div>
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
        <Button type="submit">Search</Button>
      </form>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map(form => (
          <Link key={form._id} to={`/forms/${form._id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  Near {form.roomDetails.nearbyUniversity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">
                    ${form.roomDetails.monthlyRent}/month
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {form.roomDetails.totalBedrooms} bed • {form.roomDetails.totalBathrooms} bath
                  </p>
                  <p className="text-sm text-muted-foreground">
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