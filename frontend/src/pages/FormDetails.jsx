import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { MapPin, Home, Bath, Calendar } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const FormDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [submission, setSubmission] = useState({
    personality: '',
    morningOrLateNight: '',
    cleanliness: '',
    partying: '',
    smoking: '',
    hobbies: [],
    faculty: '',
    year: '',
    gender: '',
    contactInfo: [
      { platform: '', username: '' }
    ],
    notes: ''
  });
  const [newHobby, setNewHobby] = useState('');

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await api.get(`/forms/${id}`);
      setForm(response.data);
    } catch (error) {
      console.error('Error fetching form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionChange = (field, value) => {
    setSubmission(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (index, field, value) => {
    setSubmission(prev => {
      const newContactInfo = [...prev.contactInfo];
      newContactInfo[index] = {
        ...newContactInfo[index],
        [field]: value
      };
      return {
        ...prev,
        contactInfo: newContactInfo
      };
    });
  };

  const addContactInfo = () => {
    setSubmission(prev => ({
      ...prev,
      contactInfo: [...prev.contactInfo, { platform: '', username: '' }]
    }));
  };

  const removeContactInfo = (index) => {
    setSubmission(prev => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== index)
    }));
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      setSubmission(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()]
      }));
      setNewHobby('');
    }
  };

  const removeHobby = (indexToRemove) => {
    setSubmission(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/submissions', {
        formId: id,
        submitter: submission
      });
      setShowSubmissionForm(false);
      // Show success message or redirect
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="mb-8">
        {form.roomDetails.images?.length > 0 && (
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src={form.roomDetails.images[currentImageIndex]}
              alt="Room"
              className="w-full h-full object-cover"
            />
            {form.roomDetails.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {form.roomDetails.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentImageIndex === index ? 'bg-primary' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{form.roomDetails.name}</CardTitle>
                  <p className="text-muted-foreground flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    Near {form.roomDetails.nearbyUniversity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${form.roomDetails.monthlyRent}
                    <span className="text-sm text-muted-foreground">/month</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${form.roomDetails.securityDeposit} deposit
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>{form.roomDetails.totalBedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span>{form.roomDetails.totalBathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{form.roomDetails.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Available Now</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About the Room</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{form.roomDetails.description}</p>
              {form.roomDetails.furniture?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Furniture & Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {form.roomDetails.furniture.map((item, index) => (
                      <span
                        key={index}
                        className="bg-secondary px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lease Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Lease Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{form.roomDetails.leaseTerms}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Details */}
          <Card>
            <CardHeader>
              <CardTitle>About the Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personality</h4>
                <p>{form.ownerDetails.personality}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preferences</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span>{form.ownerDetails.morningOrLateNight}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Cleanliness:</span>
                    <span>{form.ownerDetails.cleanliness}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Partying:</span>
                    <span>{form.ownerDetails.partying}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Smoking:</span>
                    <span>{form.ownerDetails.smoking}</span>
                  </li>
                </ul>
              </div>
              {form.ownerDetails.hobbies?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Hobbies</h4>
                  <div className="flex flex-wrap gap-2">
                    {form.ownerDetails.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="bg-secondary px-3 py-1 rounded-full text-sm"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {form.ownerDetails.faculty && (
                <div>
                  <h4 className="font-semibold mb-2">Academic</h4>
                  <p>Faculty: {form.ownerDetails.faculty}</p>
                  {form.ownerDetails.year && <p>Year: {form.ownerDetails.year}</p>}
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-2">Gender Preferences</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Owner:</span>
                    <span>{form.ownerDetails.gender}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Looking for:</span>
                    <span>{form.ownerDetails.preferredGender}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/signin');
                return;
              }
              setShowSubmissionForm(true);
            }}
          >
            I'm Interested
          </Button>
        </div>
      </div>

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Tell us about yourself</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm">Your Personality *</label>
                  <Input
                    value={submission.personality}
                    onChange={(e) => handleSubmissionChange('personality', e.target.value)}
                    placeholder="Describe your personality"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm">Morning/Night Person *</label>
                  <Select
                    value={submission.morningOrLateNight}
                    onValueChange={(value) => handleSubmissionChange('morningOrLateNight', value)}
                    required
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
                  <label className="text-sm">Cleanliness Level *</label>
                  <Select
                    value={submission.cleanliness}
                    onValueChange={(value) => handleSubmissionChange('cleanliness', value)}
                    required
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
                  <label className="text-sm">Partying *</label>
                  <Select
                    value={submission.partying}
                    onValueChange={(value) => handleSubmissionChange('partying', value)}
                    required
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
                  <label className="text-sm">Smoking *</label>
                  <Select
                    value={submission.smoking}
                    onValueChange={(value) => handleSubmissionChange('smoking', value)}
                    required
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
                  <label className="text-sm">Your Gender *</label>
                  <Input
                    value={submission.gender}
                    onChange={(e) => handleSubmissionChange('gender', e.target.value)}
                    placeholder="Enter your gender"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm">Faculty</label>
                  <Input
                    value={submission.faculty}
                    onChange={(e) => handleSubmissionChange('faculty', e.target.value)}
                    placeholder="Your faculty (optional)"
                  />
                </div>

                <div>
                  <label className="text-sm">Year</label>
                  <Input
                    type="number"
                    value={submission.year}
                    onChange={(e) => handleSubmissionChange('year', e.target.value)}
                    placeholder="Your year (optional)"
                    min="1"
                    max="6"
                  />
                </div>

                <div>
                  <label className="text-sm">Your Hobbies</label>
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
                    <Button 
                      type="button" 
                      onClick={addHobby}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {submission.hobbies.map((hobby, index) => (
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Contact Information *</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addContactInfo}
                    >
                      Add Contact
                    </Button>
                  </div>
                  {submission.contactInfo.map((contact, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-1">
                        <Select
                          value={contact.platform}
                          onValueChange={(value) => handleContactInfoChange(index, 'platform', value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Input
                          value={contact.username}
                          onChange={(e) => handleContactInfoChange(index, 'username', e.target.value)}
                          placeholder={`Enter your ${contact.platform || 'contact'} info`}
                          required
                        />
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeContactInfo(index)}
                          className="shrink-0"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-sm">Note to Room Owner</label>
                  <Textarea
                    value={submission.notes}
                    onChange={(e) => handleSubmissionChange('notes', e.target.value)}
                    placeholder="Something you want to tell the room owner?"
                    className="h-24"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">Submit</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowSubmissionForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FormDetails; 