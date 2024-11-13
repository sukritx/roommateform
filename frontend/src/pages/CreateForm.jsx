import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '../utils/api';
import { Upload, X } from 'lucide-react';

const CreateForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomDetails: {
      address: '',
      nearbyUniversity: '',
      totalBedrooms: '',
      totalBathrooms: '',
      description: '',
      monthlyRent: '',
      securityDeposit: '',
      furniture: [],
      leaseTerms: '',
      images: []
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
    },
    filters: {
      personality: '',
      cleanliness: '',
      morningOrLateNight: ''
    }
  });
  const [newHobby, setNewHobby] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      handleChange('ownerDetails', 'hobbies', [...formData.ownerDetails.hobbies, newHobby.trim()]);
      setNewHobby('');
    }
  };

  const removeHobby = (indexToRemove) => {
    handleChange(
      'ownerDetails', 
      'hobbies', 
      formData.ownerDetails.hobbies.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Append the image if it exists
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Append other form data
      formDataToSend.append('data', JSON.stringify(formData));

      const response = await api.post('/forms', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/forms/${response.data._id}`);
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Room Listing</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Room Details</h2>
              <div>
                <label className="text-sm">Address</label>
                <Input
                  value={formData.roomDetails.address}
                  onChange={(e) => handleChange('roomDetails', 'address', e.target.value)}
                  placeholder="Full address"
                />
              </div>
              <div>
                <label className="text-sm">Nearby University</label>
                <Input
                  value={formData.roomDetails.nearbyUniversity}
                  onChange={(e) => handleChange('roomDetails', 'nearbyUniversity', e.target.value)}
                  placeholder="e.g., University of Toronto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Bedrooms</label>
                  <Input
                    type="number"
                    value={formData.roomDetails.totalBedrooms}
                    onChange={(e) => handleChange('roomDetails', 'totalBedrooms', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm">Bathrooms</label>
                  <Input
                    type="number"
                    value={formData.roomDetails.totalBathrooms}
                    onChange={(e) => handleChange('roomDetails', 'totalBathrooms', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Monthly Rent</label>
                  <Input
                    type="number"
                    value={formData.roomDetails.monthlyRent}
                    onChange={(e) => handleChange('roomDetails', 'monthlyRent', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm">Security Deposit</label>
                  <Input
                    type="number"
                    value={formData.roomDetails.securityDeposit}
                    onChange={(e) => handleChange('roomDetails', 'securityDeposit', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm">Description</label>
                <Textarea
                  value={formData.roomDetails.description}
                  onChange={(e) => handleChange('roomDetails', 'description', e.target.value)}
                  placeholder="Describe your room..."
                />
              </div>
              <div>
                <label className="text-sm">Room Image</label>
                <div className="mt-2">
                  {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Button onClick={() => setStep(2)}>Next: About You</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About You</h2>
              <div>
                <label className="text-sm">Personality</label>
                <Input
                  value={formData.ownerDetails.personality}
                  onChange={(e) => handleChange('ownerDetails', 'personality', e.target.value)}
                  placeholder="e.g., Friendly, Introvert, etc."
                />
              </div>
              <div>
                <label className="text-sm">Morning/Night Person</label>
                <Select
                  value={formData.ownerDetails.morningOrLateNight}
                  onValueChange={(value) => handleChange('ownerDetails', 'morningOrLateNight', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning Person</SelectItem>
                    <SelectItem value="night">Night Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm">Cleanliness</label>
                <Select
                  value={formData.ownerDetails.cleanliness}
                  onValueChange={(value) => handleChange('ownerDetails', 'cleanliness', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very">Very Clean</SelectItem>
                    <SelectItem value="moderate">Moderately Clean</SelectItem>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm">Partying</label>
                <Select
                  value={formData.ownerDetails.partying}
                  onValueChange={(value) => handleChange('ownerDetails', 'partying', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="sometimes">Sometimes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm">Smoking</label>
                <Select
                  value={formData.ownerDetails.smoking}
                  onValueChange={(value) => handleChange('ownerDetails', 'smoking', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="outside">Outside Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm">Faculty</label>
                <Input
                  value={formData.ownerDetails.faculty}
                  onChange={(e) => handleChange('ownerDetails', 'faculty', e.target.value)}
                  placeholder="Your faculty"
                />
              </div>
              <div>
                <label className="text-sm">Year</label>
                <Input
                  type="number"
                  value={formData.ownerDetails.year}
                  onChange={(e) => handleChange('ownerDetails', 'year', e.target.value)}
                  placeholder="Your year"
                />
              </div>
              <div>
                <label className="text-sm">Hobbies</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    placeholder="Add a hobby"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHobby();
                      }
                    }}
                  />
                  <Button type="button" onClick={addHobby}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.ownerDetails.hobbies.map((hobby, index) => (
                    <div 
                      key={index} 
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {hobby}
                      <button
                        type="button"
                        onClick={() => removeHobby(index)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleSubmit}>Create Listing</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForm; 