import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import PropTypes from 'prop-types';

const RoomCard = ({ form }) => (
	<Link to={`/forms/${form._id}`}>
		<Card className="hover:shadow-lg transition-shadow h-full">
			{form.roomDetails.images?.[0] && (
				<div className="h-48 overflow-hidden">
					<img
						src={form.roomDetails.images[0]}
						alt="Room"
						className="w-full h-full object-cover"
					/>
				</div>
			)}
			<CardHeader>
				<CardTitle>{form.roomDetails.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-lg font-semibold text-primary">
					${form.roomDetails.monthlyRent}/month
				</p>
				<p className="text-sm text-muted-foreground">
					Near {form.roomDetails.nearbyUniversity}
				</p>
				<div className="mt-2 flex items-center gap-2">
					<span className={`px-2 py-1 rounded-full text-xs ${
						form.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
					}`}>
						{form.isActive ? 'Active' : 'Inactive'}
					</span>
					{form.boostStatus && (
						<span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
							Boosted
						</span>
					)}
				</div>
			</CardContent>
		</Card>
	</Link>
);

RoomCard.propTypes = {
	form: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		roomDetails: PropTypes.shape({
			images: PropTypes.arrayOf(PropTypes.string),
			name: PropTypes.string.isRequired,
			monthlyRent: PropTypes.number.isRequired,
			nearbyUniversity: PropTypes.string.isRequired
		}).isRequired,
		isActive: PropTypes.bool,
		boostStatus: PropTypes.bool
	}).isRequired
};

const Dashboard = () => {
	const { user } = useAuth();
	const [favorites, setFavorites] = useState([]);
	const [myListings, setMyListings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const [favoritesRes, listingsRes] = await Promise.all([
				api.get('/user/favorites'),
				api.get('/forms/my-listings')
			]);
			setFavorites(favoritesRes.data);
			setMyListings(listingsRes.data);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-6xl mx-auto px-4">
			<Tabs defaultValue="listings">
				<TabsList>
					<TabsTrigger value="listings">My Listings</TabsTrigger>
					<TabsTrigger value="favorites">Favorites</TabsTrigger>
				</TabsList>

				<TabsContent value="listings">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{myListings.map(form => (
							<RoomCard key={form._id} form={form} />
						))}
						{myListings.length === 0 && (
							<div className="col-span-full text-center py-8">
								<p className="text-muted-foreground mb-4">
									You haven&apos;t created any listings yet
								</p>
								<Button asChild>
									<Link to="/create-form">Create Listing</Link>
								</Button>
							</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value="favorites">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{favorites.map(form => (
							<RoomCard key={form._id} form={form} />
						))}
						{favorites.length === 0 && (
							<p className="text-muted-foreground col-span-full text-center py-8">
								No favorite rooms yet
							</p>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Dashboard;