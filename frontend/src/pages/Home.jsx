import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import UniversitySearch from '@/components/UniversitySearch';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [selectedUniversity, setSelectedUniversity] = useState('');

  const features = [
    {
      icon: HomeIcon,
      title: "Easy to Use",
      description: "Create your listing in minutes and connect with potential roommates"
    },
    {
      icon: AcademicCapIcon,
      title: "University Focused",
      description: "Find roommates from your university or nearby institutions"
    },
    {
      icon: UserGroupIcon,
      title: "Personality Match",
      description: "Match with roommates based on lifestyle and preferences"
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Platform",
      description: "Safe and verified user profiles for peace of mind"
    }
  ];

  const handleSearch = () => {
    if (selectedUniversity) {
      navigate(`/browse?university=${encodeURIComponent(selectedUniversity)}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 md:py-24"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Find Your Perfect <span className="text-primary">Roommate</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto"
        >
          Connect with potential roommates near your university. Create a listing or browse available rooms.
        </motion.p>
        
        {/* University Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto mb-8 md:mb-12 px-4 sm:px-6"
        >
          <div className="flex flex-col gap-6 p-4 sm:p-8 bg-card rounded-xl shadow-lg">
            <div className="flex-1">
              <label className="text-base md:text-lg font-medium mb-2 md:mb-3 block">Select Your University</label>
              <UniversitySearch
                value={selectedUniversity}
                onChange={setSelectedUniversity}
                className="w-full text-base md:text-lg py-4 md:py-6"
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg py-6 md:py-8 px-8 md:px-12 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 whitespace-nowrap sm:self-end"
              disabled={!selectedUniversity}
            >
              Find Rooms
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center px-4 sm:px-6"
        >
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto text-base md:text-xl py-6 md:py-8 px-8 md:px-12 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <Link to="/create-form">Create Listing</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * (index + 1) }}
            className="p-6 rounded-xl bg-card hover:shadow-lg transition-shadow"
          >
            <feature.icon className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center py-16 md:py-24"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to find your roommate?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join our community and start your search today.
        </p>
        <Button asChild size="lg">
          <Link to="/signup">Get Started</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default Home;
