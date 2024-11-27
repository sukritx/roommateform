import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { format } from 'date-fns';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";

const MySubmissions = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/submissions/my-submissions');
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError(error.response?.data?.message || 'Failed to load your submissions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if authenticated
    if (isAuthenticated && !authLoading) {
      fetchSubmissions();
    } else if (!authLoading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 px-4">My Applications</h1>
      {submissions.length === 0 ? (
        <Card className="mx-4">
          <CardContent className="pt-6">
            <p className="text-gray-600">You haven't submitted any applications yet.</p>
            <Button
              onClick={() => navigate('/')}
              className="mt-4 w-full sm:w-auto"
            >
              Browse Listings
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => (
            <Card key={submission._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="relative space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <CardTitle className="text-lg md:text-xl break-words">
                    {submission.form?.roomDetails?.name || 'Listing'}
                  </CardTitle>
                  <Badge 
                    variant={submission.isRead ? "secondary" : "default"}
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    {submission.isRead ? (
                      <>
                        <Eye className="h-3 w-3" />
                        <span>Seen</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" />
                        <span>Not seen yet</span>
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Submitted on {format(new Date(submission.createdAt), 'PPP')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold text-sm">Faculty</p>
                      <p className="text-sm break-words">{submission.submitter.faculty || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Year</p>
                      <p className="text-sm break-words">{submission.submitter.year || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button
                      onClick={() => navigate(`/forms/${submission.form?._id}`)}
                      variant="outline"
                      className="flex-1 text-sm"
                    >
                      View Listing
                    </Button>
                    <Button
                      onClick={() => setSelectedSubmission(submission)}
                      variant="secondary"
                      className="flex-1 text-sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl mb-4">Application Details</DialogTitle>
            <DialogDescription>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold mb-1">Gender</h4>
                      <p>{selectedSubmission?.submitter.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Faculty</h4>
                      <p>{selectedSubmission?.submitter.faculty || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Year</h4>
                      <p>{selectedSubmission?.submitter.year || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Lifestyle Preferences */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Lifestyle Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold mb-1">Morning/Night Person</h4>
                      <p>{selectedSubmission?.submitter.morningOrLateNight || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Cleanliness Level</h4>
                      <p>{selectedSubmission?.submitter.cleanliness || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Partying</h4>
                      <p>{selectedSubmission?.submitter.partying || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Smoking</h4>
                      <p>{selectedSubmission?.submitter.smoking || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Personality & Hobbies */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Personality & Interests</h3>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold mb-1">Personality</h4>
                      <p className="whitespace-pre-wrap">{selectedSubmission?.submitter.personality || 'Not specified'}</p>
                    </div>
                    
                    {selectedSubmission?.submitter.hobbies?.length > 0 && (
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
                    {selectedSubmission?.submitter.contactInfo?.length > 0 ? (
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
                    <p className="whitespace-pre-wrap">{selectedSubmission?.notes || 'No additional notes'}</p>
                  </div>
                </div>

                {/* Submission Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Submission Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>Submitted on: {selectedSubmission && format(new Date(selectedSubmission.createdAt), 'PPP pp')}</p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySubmissions;
