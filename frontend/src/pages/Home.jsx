import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">
        Find Your Perfect Roommate
      </h1>
      <p className="text-xl mb-8 text-muted-foreground">
        Connect with potential roommates near your university. Create a listing or browse available rooms.
      </p>
      
      <div className="flex justify-center gap-4">
        <Button asChild size="lg">
          <Link to="/browse">Browse Rooms</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/create-form">Create Listing</Link>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
          <p className="text-muted-foreground">
            Create your listing in minutes and connect with potential roommates
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">University Focused</h3>
          <p className="text-muted-foreground">
            Find roommates from your university or nearby institutions
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Personality Match</h3>
          <p className="text-muted-foreground">
            Match with roommates based on lifestyle and preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
