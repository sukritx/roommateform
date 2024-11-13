import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const FormDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submission, setSubmission] = useState({
    personality: '',
    morningOrLateNight: '',
    cleanliness: '',
    partying: '',
    smoking: '',
    hobbies: [],
    faculty: '',
    year: '',
    contactInfo: []
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    try {
      await api.post('/submissions', {
        formId: id,
        submitter: submission
      });
      setShowSubmissionForm(false);
      // Show success message
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      handleSubmissionChange('hobbies', [...submission.hobbies, newHobby.trim()]);
      setNewHobby('');
    }
  };

  const removeHobby = (indexToRemove) => {
    handleSubmissionChange(
      'hobbies', 
      submission.hobbies.filter((_, index) => index !== indexToRemove)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Room Details */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{form.roomDetails.address}</p>
              <p>Near {form.roomDetails.nearbyUniversity}</p>
            </div>
            <div>
              <h3 className="font-semibold">Details</h3>
              <p>{form.roomDetails.totalBedrooms} bed • {form.roomDetails.totalBathrooms} bath</p>
              <p>${form.roomDetails.monthlyRent}/month</p>
              <p>Security Deposit: ${form.roomDetails.securityDeposit}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{form.roomDetails.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Owner Details */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>About the Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold">Personality</h3>
              <p>{form.ownerDetails.personality}</p>
            </div>
            <div>
              <h3 className="font-semibold">Preferences</h3>
              <p>Schedule: {form.ownerDetails.morningOrLateNight}</p>
              <p>Cleanliness: {form.ownerDetails.cleanliness}</p>
              <p>Partying: {form.ownerDetails.partying}</p>
              <p>Smoking: {form.ownerDetails.smoking}</p>
            </div>
            <div>
              <h3 className="font-semibold">Academic</h3>
              <p>Faculty: {form.ownerDetails.faculty}</p>
              <p>Year: {form.ownerDetails.year}</p>
            </div>
            <div>
              <h3 className="font-semibold">Hobbies</h3>
              <p>{form.ownerDetails.hobbies.join(', ')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Interest Form */}
      <div className="mt-8">
        {!showSubmissionForm ? (
          <Button 
            onClick={() => setShowSubmissionForm(true)}
            className="w-full sm:w-auto"
          >
            I&apos;m Interested
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Group related fields in two columns on larger screens */}
                  <div className="space-y-4">
                    {/* Personal Info */}
                    <div>
                      <label className="text-sm">Your Personality</label>
                      <Input
                        value={submission.personality}
                        onChange={(e) => handleSubmissionChange('personality', e.target.value)}
                        placeholder="Describe your personality"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Morning/Night Person</label>
                      <Input
                        value={submission.morningOrLateNight}
                        onChange={(e) => handleSubmissionChange('morningOrLateNight', e.target.value)}
                        placeholder="Are you a morning or night person?"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Cleanliness Level</label>
                      <Input
                        value={submission.cleanliness}
                        onChange={(e) => handleSubmissionChange('cleanliness', e.target.value)}
                        placeholder="Your cleanliness level"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Academic Info */}
                    <div>
                      <label className="text-sm">Faculty</label>
                      <Input
                        value={submission.faculty}
                        onChange={(e) => handleSubmissionChange('faculty', e.target.value)}
                        placeholder="Your faculty"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Year</label>
                      <Input
                        type="number"
                        value={submission.year}
                        onChange={(e) => handleSubmissionChange('year', e.target.value)}
                        placeholder="Your year"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Full width fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm">Smoking</label>
                    <Select
                      value={submission.smoking}
                      onValueChange={(value) => handleSubmissionChange('smoking', value)}
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
                      <Button type="button" onClick={addHobby}>Add</Button>
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
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="w-full sm:w-auto">Submit</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowSubmissionForm(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FormDetails; 