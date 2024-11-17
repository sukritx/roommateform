import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from 'lucide-react';
import UniversitySearch from '@/components/UniversitySearch';
import api from '../utils/api';

const CreateForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
    <div className="max-w-2xl mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Room Listing</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
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
          )}

          {step === 2 && (
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

              {/* ... Add similar error handling for other required fields ... */}

              <div>
                <label className="text-sm">Faculty</label>
                <Input
                  value={formData.ownerDetails.faculty}
                  onChange={(e) => handleChange('ownerDetails', 'faculty', e.target.value)}
                  placeholder="Your faculty (optional)"
                />
              </div>

              {/* ... Add year and hobbies fields as optional ... */}

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleSubmit}>Create Listing</Button>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-500 mt-2">{errors.submit}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForm; 