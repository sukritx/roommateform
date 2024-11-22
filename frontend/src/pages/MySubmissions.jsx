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
  const { user, isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    fetchSubmissions();
  }, [isAuthenticated, navigate]);

  const fetchSubmissions = async () => {
    try {
      setError(null);
      const response = await api.get('/submissions/my-submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to load your submissions. Please try again later.');
    } finally {
      setLoading(false);
    }
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
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
            <Button
              onClick={fetchSubmissions}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">You haven't submitted any applications yet.</p>
            <Button
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Browse Listings
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => (
            <Card key={submission._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="relative">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    {submission.form?.roomDetails?.name || 'Listing'}
                  </CardTitle>
                  <Badge 
                    variant={submission.isRead ? "secondary" : "default"}
                    className="flex items-center gap-1"
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
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Faculty:</span>{' '}
                    {submission.submitter.faculty || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Year:</span>{' '}
                    {submission.submitter.year || 'N/A'}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => navigate(`/forms/${submission.form?._id}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      View Listing
                    </Button>
                    <Button
                      onClick={() => setSelectedSubmission(submission)}
                      variant="secondary"
                      className="flex-1"
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Application Details</span>
              <Badge 
                variant={selectedSubmission?.isRead ? "secondary" : "default"}
                className="flex items-center gap-1"
              >
                {selectedSubmission?.isRead ? (
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
            </DialogTitle>
            <DialogDescription>
              View the details of your submitted application
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <p><span className="text-gray-600">Faculty:</span> {selectedSubmission.submitter.faculty}</p>
                  <p><span className="text-gray-600">Year:</span> {selectedSubmission.submitter.year}</p>
                  <p><span className="text-gray-600">Gender:</span> {selectedSubmission.submitter.gender}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Lifestyle</h3>
                  <p><span className="text-gray-600">Schedule:</span> {selectedSubmission.submitter.morningOrLateNight}</p>
                  <p><span className="text-gray-600">Cleanliness:</span> {selectedSubmission.submitter.cleanliness}</p>
                  <p><span className="text-gray-600">Partying:</span> {selectedSubmission.submitter.partying}</p>
                  <p><span className="text-gray-600">Smoking:</span> {selectedSubmission.submitter.smoking}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Personality & Hobbies</h3>
                <p>{selectedSubmission.submitter.personality}</p>
                {selectedSubmission.submitter.hobbies?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-600">Hobbies:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedSubmission.submitter.hobbies.map((hobby, index) => (
                        <span key={index} className="bg-secondary px-2 py-1 rounded-md text-sm">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-1">
                  {selectedSubmission.submitter.contactInfo.map((contact, index) => (
                    <p key={index}>
                      <span className="text-gray-600 capitalize">{contact.platform}:</span>{' '}
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>

              {selectedSubmission.submitter.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Additional Notes</h3>
                  <p>{selectedSubmission.submitter.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySubmissions;
