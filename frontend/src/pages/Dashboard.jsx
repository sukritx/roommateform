import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import PropTypes from 'prop-types';
import { Pencil } from 'lucide-react';
import { Loading } from "@/components/ui/loading";

const RoomCard = ({ form, onEdit }) => (
  <div className="relative">
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 z-10"
      onClick={(e) => {
        e.preventDefault();
        onEdit(form);
      }}
    >
      <Pencil className="h-4 w-4" />
    </Button>
    <Link to={`/forms/${form._id}`}>
      <Card className="hover:shadow-lg transition-shadow h-full">
        {form.roomDetails.images?.[0] && (
          <div className="h-48 overflow-hidden">
            <img
              src={form.roomDetails.images[0]}
              alt="Room"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{form.roomDetails.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-primary">
            {form.roomDetails.currency} {form.roomDetails.monthlyRent}/month
          </p>
          <p className="text-sm text-muted-foreground">
            Near {form.roomDetails.nearbyUniversity}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              form.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {form.isActive ? 'Active' : 'Inactive'}
            </span>
            {form.boostStatus && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                Boosted
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  </div>
);

RoomCard.propTypes = {
  form: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    roomDetails: PropTypes.shape({
      images: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string.isRequired,
      monthlyRent: PropTypes.number.isRequired,
      nearbyUniversity: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired
    }).isRequired,
    isActive: PropTypes.bool,
    boostStatus: PropTypes.bool
  }).isRequired,
  onEdit: PropTypes.func.isRequired
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      if (!authLoading) {
        if (!isAuthenticated) {
          navigate('/signin', { state: { from: '/dashboard' } });
          return;
        }
        try {
          setIsLoading(true);
          setError(null);
          const response = await api.get('/forms/my-listings');
          setForms(response.data);
        } catch (error) {
          console.error('Error fetching forms:', error);
          if (error.response?.status === 401) {
            navigate('/signin', { state: { from: '/dashboard' } });
          } else {
            setError('Failed to load your forms. Please try again later.');
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuthAndFetch();
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const handleEdit = (form) => {
    // Add your handleEdit logic here
  };

  const handleUpdateForm = async (formId, updates) => {
    try {
      await api.put(`/forms/${formId}`, updates);
      // Add your handleUpdateForm logic here
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map(form => (
              <RoomCard key={form._id} form={form} onEdit={handleEdit} />
            ))}
            {forms.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t created any listings yet
                </p>
                <Button asChild>
                  <Link to="/create-form">Create Listing</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add your favorites logic here */}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Form Modal */}
      {/* Add your edit form modal logic here */}
    </div>
  );
};

export default Dashboard;