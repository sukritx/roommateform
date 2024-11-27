import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Loading } from "@/components/ui/loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Forms Submissions</h1>
      
      <div className="space-y-6">
        {forms.map((form) => (
          <Card key={form._id} className="overflow-hidden">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg md:text-xl break-words">
                    {form.roomDetails?.name || 'Unnamed Form'}
                    {getUnreadCount(form.submissions) > 0 && (
                      <span className="ml-2 px-2.5 py-0.5 bg-blue-500 text-white text-sm rounded-full inline-flex items-center">
                        {getUnreadCount(form.submissions)} New
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {form.submissions.length} {form.submissions.length === 1 ? 'submission' : 'submissions'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/forms/${form._id}`)}
                  className="w-full sm:w-auto"
                >
                  View Form
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {form.error ? (
                <div className="p-4 text-red-500">{form.error}</div>
              ) : form.submissions.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">No submissions yet</div>
              ) : (
                <div className="divide-y">
                  {form.submissions.map((submission) => (
                    <div
                      key={submission._id}
                      onClick={() => handleSubmissionClick(form._id, submission)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        !submission.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <h3 className="font-medium">
                              {submission.submitter.faculty} Student
                            </h3>
                            {!submission.isRead && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Year: {submission.submitter.year}</p>
                            <p>Submitted: {format(new Date(submission.createdAt), 'PPP')}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="self-start sm:self-center whitespace-nowrap"
                        >
                          View Details →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl mb-4">Submission Details</DialogTitle>
              <DialogDescription>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <h4 className="font-semibold mb-1">Gender</h4>
                        <p>{selectedSubmission.submitter.gender || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Faculty</h4>
                        <p>{selectedSubmission.submitter.faculty || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Year</h4>
                        <p>{selectedSubmission.submitter.year || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle Preferences */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Lifestyle Preferences</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <h4 className="font-semibold mb-1">Morning/Night Person</h4>
                        <p>{selectedSubmission.submitter.morningOrLateNight || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Cleanliness Level</h4>
                        <p>{selectedSubmission.submitter.cleanliness || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Partying</h4>
                        <p>{selectedSubmission.submitter.partying || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Smoking</h4>
                        <p>{selectedSubmission.submitter.smoking || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Personality & Hobbies */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Personality & Interests</h3>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <h4 className="font-semibold mb-1">Personality</h4>
                        <p className="whitespace-pre-wrap">{selectedSubmission.submitter.personality || 'Not specified'}</p>
                      </div>
                      
                      {selectedSubmission.submitter.hobbies?.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Hobbies</h4>
                          <div className="flex flex-wrap gap-2">
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
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedSubmission.submitter.contactInfo?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedSubmission.submitter.contactInfo.map((contact, index) => (
                            <div key={index}>
                              <h4 className="font-semibold mb-1 capitalize">{contact.platform}</h4>
                              <p>{contact.username}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No contact information provided</p>
                      )}
                    </div>
                  </div>

                  {/* Note to Room Owner */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Note to Room Owner</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedSubmission.notes || 'No additional notes'}</p>
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Submission Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>Submitted on: {format(new Date(selectedSubmission.createdAt), 'PPP pp')}</p>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SubmissionsDashboard;
