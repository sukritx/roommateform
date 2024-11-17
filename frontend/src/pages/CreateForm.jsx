import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Check } from 'lucide-react';
import UniversitySearch from '@/components/UniversitySearch';
import api from '../utils/api';

const CreateForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('pricing');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    roomDetails: {
      name: '',
      address: '',
      nearbyUniversity: '',
      totalBedrooms: '',
      totalBathrooms: '',
      description: '',
      monthlyRent: '',
      securityDeposit: '',
      images: [],
      furniture: [],
      leaseTerms: '',
    },
    ownerDetails: {
      personality: '',
      morningOrLateNight: '',
      cleanliness: '',
      partying: '',
      smoking: '',
      hobbies: [],
      faculty: '',
      year: ''
    }
  });

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Create form but cannot publish',
      features: [
        'Create listing',
        'Save as draft',
        'Basic features'
      ]
    },
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$8.99',
      description: 'Form available for 1 month',
      features: [
        'Publish listing',
        'Active for 30 days',
        'All features included',
        'Receive applications'
      ]
    },
    {
      id: 'until-found',
      name: 'Until Found',
      price: '$12.99',
      description: 'Active until roommate found',
      features: [
        'Publish listing',
        'Active until deactivated',
        'All features included',
        'Receive applications',
        'Priority support'
      ]
    }
  ];

  const handlePlanSelect = async (planId) => {
    setSelectedPlan(planId);
    if (planId === 'free') {
      setStep(1);
    } else {
      try {
        const response = await api.post('/payments/create-intent', {
          packageType: planId
        });
        setStep(1);
      } catch (error) {
        console.error('Error creating payment:', error);
      }
    }
  };

  const validateRoomDetails = () => {
    const errors = {};
    const details = formData.roomDetails;

    if (!details.name?.trim()) errors.name = 'Dorm name is required';
    if (!details.address?.trim()) errors.address = 'Address is required';
    if (!details.nearbyUniversity?.trim()) errors.nearbyUniversity = 'University is required';
    if (!details.totalBedrooms) errors.totalBedrooms = 'Number of bedrooms is required';
    if (!details.totalBathrooms) errors.totalBathrooms = 'Number of bathrooms is required';
    if (!details.description?.trim()) errors.description = 'Description is required';
    if (!details.monthlyRent) errors.monthlyRent = 'Monthly rent is required';
    if (!details.securityDeposit) errors.securityDeposit = 'Security deposit is required';
    if (!details.leaseTerms?.trim()) errors.leaseTerms = 'Lease terms are required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOwnerDetails = () => {
    const errors = {};
    const details = formData.ownerDetails;

    if (!details.personality?.trim()) errors.personality = 'Personality is required';
    if (!details.morningOrLateNight?.trim()) errors.morningOrLateNight = 'Schedule preference is required';
    if (!details.cleanliness?.trim()) errors.cleanliness = 'Cleanliness level is required';
    if (!details.partying?.trim()) errors.partying = 'Party preference is required';
    if (!details.smoking?.trim()) errors.smoking = 'Smoking preference is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateRoomDetails()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateOwnerDetails()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      formDataToSend.append('data', JSON.stringify(formData));

      const response = await api.post('/forms', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/forms/${response.data._id}`);
    } catch (error) {
      console.error('Error creating form:', error);
      setErrors({ submit: 'Failed to create listing. Please try again.' });
    }
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {step === 'pricing' && (
        <div className="py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all ${
                  selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-start gap-4">
                    <div>
                      <span>{plan.name}</span>
                      {plan.id === 'until-found' && (
                        <div className="inline-block ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}
                    </div>
                    <span className="text-2xl font-bold">{plan.price}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    variant={plan.id === 'until-found' ? 'default' : 'outline'}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Room Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm">Dorm Name *</label>
                  <Input
                    value={formData.roomDetails.name}
                    onChange={(e) => handleChange('roomDetails', 'name', e.target.value)}
                    placeholder="e.g., Sunset Residence, Ocean View Dorm"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm">Address *</label>
                  <Input
                    value={formData.roomDetails.address}
                    onChange={(e) => handleChange('roomDetails', 'address', e.target.value)}
                    placeholder="Full address"
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="text-sm">Nearby University *</label>
                  <UniversitySearch
                    value={formData.roomDetails.nearbyUniversity}
                    onChange={(value) => handleChange('roomDetails', 'nearbyUniversity', value)}
                    className={errors.nearbyUniversity ? 'border-red-500' : ''}
                  />
                  {errors.nearbyUniversity && (
                    <p className="text-sm text-red-500 mt-1">{errors.nearbyUniversity}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Total Bedrooms *</label>
                    <Input
                      type="number"
                      value={formData.roomDetails.totalBedrooms}
                      onChange={(e) => handleChange('roomDetails', 'totalBedrooms', e.target.value)}
                      min="1"
                      className={errors.totalBedrooms ? 'border-red-500' : ''}
                    />
                    {errors.totalBedrooms && (
                      <p className="text-sm text-red-500 mt-1">{errors.totalBedrooms}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">Total Bathrooms *</label>
                    <Input
                      type="number"
                      value={formData.roomDetails.totalBathrooms}
                      onChange={(e) => handleChange('roomDetails', 'totalBathrooms', e.target.value)}
                      min="1"
                      className={errors.totalBathrooms ? 'border-red-500' : ''}
                    />
                    {errors.totalBathrooms && (
                      <p className="text-sm text-red-500 mt-1">{errors.totalBathrooms}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm">Description *</label>
                  <Textarea
                    value={formData.roomDetails.description}
                    onChange={(e) => handleChange('roomDetails', 'description', e.target.value)}
                    placeholder="Describe your room..."
                    className={errors.description ? 'border-red-500' : ''}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Monthly Rent (USD) *</label>
                    <Input
                      type="number"
                      value={formData.roomDetails.monthlyRent}
                      onChange={(e) => handleChange('roomDetails', 'monthlyRent', e.target.value)}
                      min="0"
                      className={errors.monthlyRent ? 'border-red-500' : ''}
                    />
                    {errors.monthlyRent && (
                      <p className="text-sm text-red-500 mt-1">{errors.monthlyRent}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">Security Deposit (USD) *</label>
                    <Input
                      type="number"
                      value={formData.roomDetails.securityDeposit}
                      onChange={(e) => handleChange('roomDetails', 'securityDeposit', e.target.value)}
                      min="0"
                      className={errors.securityDeposit ? 'border-red-500' : ''}
                    />
                    {errors.securityDeposit && (
                      <p className="text-sm text-red-500 mt-1">{errors.securityDeposit}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm">Lease Terms *</label>
                  <Textarea
                    value={formData.roomDetails.leaseTerms}
                    onChange={(e) => handleChange('roomDetails', 'leaseTerms', e.target.value)}
                    placeholder="Describe lease terms, duration, etc..."
                    className={errors.leaseTerms ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {errors.leaseTerms && (
                    <p className="text-sm text-red-500 mt-1">{errors.leaseTerms}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm">Room Images</label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload images</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreview(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full md:w-auto"
                >
                  Next: About You
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>About You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm">Personality *</label>
                  <Input
                    value={formData.ownerDetails.personality}
                    onChange={(e) => handleChange('ownerDetails', 'personality', e.target.value)}
                    placeholder="e.g., Friendly, Introvert, etc."
                    className={errors.personality ? 'border-red-500' : ''}
                  />
                  {errors.personality && <p className="text-sm text-red-500 mt-1">{errors.personality}</p>}
                </div>

                <div>
                  <label className="text-sm">Schedule Preference *</label>
                  <Input
                    value={formData.ownerDetails.morningOrLateNight}
                    onChange={(e) => handleChange('ownerDetails', 'morningOrLateNight', e.target.value)}
                    placeholder="e.g., Morning, Late Night, etc."
                    className={errors.morningOrLateNight ? 'border-red-500' : ''}
                  />
                  {errors.morningOrLateNight && <p className="text-sm text-red-500 mt-1">{errors.morningOrLateNight}</p>}
                </div>

                <div>
                  <label className="text-sm">Cleanliness Level *</label>
                  <Input
                    value={formData.ownerDetails.cleanliness}
                    onChange={(e) => handleChange('ownerDetails', 'cleanliness', e.target.value)}
                    placeholder="e.g., Clean, Average, Messy, etc."
                    className={errors.cleanliness ? 'border-red-500' : ''}
                  />
                  {errors.cleanliness && <p className="text-sm text-red-500 mt-1">{errors.cleanliness}</p>}
                </div>

                <div>
                  <label className="text-sm">Party Preference *</label>
                  <Input
                    value={formData.ownerDetails.partying}
                    onChange={(e) => handleChange('ownerDetails', 'partying', e.target.value)}
                    placeholder="e.g., Social, Quiet, etc."
                    className={errors.partying ? 'border-red-500' : ''}
                  />
                  {errors.partying && <p className="text-sm text-red-500 mt-1">{errors.partying}</p>}
                </div>

                <div>
                  <label className="text-sm">Smoking Preference *</label>
                  <Input
                    value={formData.ownerDetails.smoking}
                    onChange={(e) => handleChange('ownerDetails', 'smoking', e.target.value)}
                    placeholder="e.g., No, Social, etc."
                    className={errors.smoking ? 'border-red-500' : ''}
                  />
                  {errors.smoking && <p className="text-sm text-red-500 mt-1">{errors.smoking}</p>}
                </div>

                <div>
                  <label className="text-sm">Hobbies</label>
                  <Input
                    value={formData.ownerDetails.hobbies}
                    onChange={(e) => handleChange('ownerDetails', 'hobbies', e.target.value)}
                    placeholder="e.g., Reading, Cooking, etc."
                  />
                </div>

                <div>
                  <label className="text-sm">Faculty</label>
                  <Input
                    value={formData.ownerDetails.faculty}
                    onChange={(e) => handleChange('ownerDetails', 'faculty', e.target.value)}
                    placeholder="Your faculty (optional)"
                  />
                </div>

                <div>
                  <label className="text-sm">Year</label>
                  <Input
                    value={formData.ownerDetails.year}
                    onChange={(e) => handleChange('ownerDetails', 'year', e.target.value)}
                    placeholder="Your year (optional)"
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={handleSubmit}>Create Listing</Button>
                </div>

                {errors.submit && (
                  <p className="text-sm text-red-500 mt-2">{errors.submit}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreateForm; 