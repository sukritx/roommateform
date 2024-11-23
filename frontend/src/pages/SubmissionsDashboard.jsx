import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Loading } from "@/components/ui/loading";

const SubmissionsDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    fetchFormsWithSubmissions();
  }, [isAuthenticated, navigate]);

  const fetchFormsWithSubmissions = async () => {
    try {
      setError(null);
      const formsResponse = await api.get('/forms/my-listings');
      const formsData = formsResponse.data;
      
      const formsWithSubmissions = await Promise.all(
        formsData.map(async (form) => {
          try {
            const submissionsResponse = await api.get(`/submissions/form/${form._id}`);
            return {
              ...form,
              submissions: submissionsResponse.data
            };
          } catch (error) {
            console.error(`Error fetching submissions for form ${form._id}:`, error);
            return {
              ...form,
              submissions: [],
              error: 'Failed to load submissions'
            };
          }
        })
      );
      
      setForms(formsWithSubmissions);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setError('Failed to load your forms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (formId, submissionId) => {
    try {
      await api.put(`/submissions/${submissionId}/read`);
      setForms(forms.map(form => {
        if (form._id === formId) {
          return {
            ...form,
            submissions: form.submissions.map(sub =>
              sub._id === submissionId ? { ...sub, isRead: true } : sub
            )
          };
        }
        return form;
      }));
    } catch (error) {
      console.error('Error marking submission as read:', error);
    }
  };

  const handleSubmissionClick = async (formId, submission) => {
    if (!submission.isRead) {
      await markAsRead(formId, submission._id);
    }
    setSelectedSubmission(submission);
  };

  const getUnreadCount = (submissions) => {
    return submissions.filter(sub => !sub.isRead).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center">
          {error}
          <Button className="mt-4" onClick={fetchFormsWithSubmissions}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Forms Submissions</h1>
      
      {forms.map((form) => (
        <Card key={form._id} className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                {form.roomDetails?.name || 'Unnamed Form'}
                {getUnreadCount(form.submissions) > 0 && (
                  <span className="ml-3 px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                    {getUnreadCount(form.submissions)} New
                  </span>
                )}
              </CardTitle>
              <Button variant="outline" onClick={() => navigate(`/forms/${form._id}`)}>
                View Form
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {form.error ? (
              <div className="text-red-500">{form.error}</div>
            ) : (
              <div className="space-y-4">
                {form.submissions.length > 0 ? (
                  form.submissions.map((submission) => (
                    <div
                      key={submission._id}
                      onClick={() => handleSubmissionClick(form._id, submission)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors hover:border-primary ${
                        !submission.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold flex items-center">
                            {submission.submitter.faculty} Student
                            {!submission.isRead && (
                              <span className="ml-2 text-blue-600 text-sm">• New</span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Submitted {format(new Date(submission.createdAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No submissions yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {forms.length === 0 && (
        <div className="text-center text-gray-500">
          <p>You haven't created any forms yet.</p>
          <Button className="mt-4" onClick={() => navigate('/create-form')}>
            Create Your First Form
          </Button>
        </div>
      )}

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Roommate Application</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted on {format(new Date(selectedSubmission.createdAt), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSubmission(null)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-24">Faculty:</span>
                      <span className="font-medium">{selectedSubmission.submitter.faculty || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-24">Year:</span>
                      <span className="font-medium">{selectedSubmission.submitter.year || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-24">Gender:</span>
                      <span className="font-medium">{selectedSubmission.submitter.gender || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Lifestyle</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-24">Schedule:</span>
                      <span className="font-medium">{selectedSubmission.submitter.morningOrLateNight}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-24">Cleanliness:</span>
                      <span className="font-medium">{selectedSubmission.submitter.cleanliness}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-24">Partying:</span>
                      <span className="font-medium">{selectedSubmission.submitter.partying}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-24">Smoking:</span>
                      <span className="font-medium">{selectedSubmission.submitter.smoking}</span>
                    </div>
                  </div>
                </div>

                {/* Personality & Hobbies */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Personality & Interests</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-600">Personality:</span>
                      <p className="mt-1 font-medium">{selectedSubmission.submitter.personality}</p>
                    </div>
                    {selectedSubmission.submitter.hobbies?.length > 0 && (
                      <div>
                        <span className="text-gray-600">Hobbies:</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedSubmission.submitter.hobbies.map((hobby, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {hobby}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedSubmission.submitter.contactInfo?.map((contact, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="capitalize text-gray-600 w-24">{contact.platform}:</span>
                        <span className="font-medium">{contact.username}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedSubmission.submitter.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedSubmission.submitter.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsDashboard;
