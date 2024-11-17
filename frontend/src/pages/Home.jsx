import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const Home = () => {
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
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="text-lg">
            <Link to="/browse">Browse Rooms</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg">
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
