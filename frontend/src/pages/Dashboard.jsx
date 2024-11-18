import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const Dashboard = () => {
	const { user } = useAuth();
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchFavorites();
	}, []);

	const fetchFavorites = async () => {
		try {
			const response = await api.get('/user/favorites');
			setFavorites(response.data);
		} catch (error) {
			console.error('Error fetching favorites:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-6xl mx-auto px-4">
			<Tabs defaultValue="favorites">
				<TabsList>
					<TabsTrigger value="favorites">Favorites</TabsTrigger>
					<TabsTrigger value="listings">My Listings</TabsTrigger>
				</TabsList>

				<TabsContent value="favorites">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{favorites.map(form => (
							<Link key={form._id} to={`/forms/${form._id}`}>
								<Card className="hover:shadow-lg transition-shadow">
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
									</CardContent>
								</Card>
							</Link>
						))}
						{favorites.length === 0 && (
							<p className="text-muted-foreground col-span-full text-center py-8">
								No favorite rooms yet
							</p>
						)}
					</div>
				</TabsContent>

				<TabsContent value="listings">
					{/* Add your listings content here */}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Dashboard;