import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import PropTypes from 'prop-types';
import { Pencil } from 'lucide-react';
import { Loading } from "@/components/ui/loading";

const RoomCard = ({ form, onEdit }) => (
	<div className="relative">
		<Button
			variant="ghost"
			size="icon"
			className="absolute top-2 right-2 z-10"
			onClick={(e) => {
				e.preventDefault();
				onEdit(form);
			}}
		>
			<Pencil className="h-4 w-4" />
		</Button>
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
						{form.roomDetails.currency} {form.roomDetails.monthlyRent}/month
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
	</div>
);

RoomCard.propTypes = {
	form: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		roomDetails: PropTypes.shape({
			images: PropTypes.arrayOf(PropTypes.string),
			name: PropTypes.string.isRequired,
			monthlyRent: PropTypes.number.isRequired,
			nearbyUniversity: PropTypes.string.isRequired,
			currency: PropTypes.string.isRequired
		}).isRequired,
		isActive: PropTypes.bool,
		boostStatus: PropTypes.bool
	}).isRequired,
	onEdit: PropTypes.func.isRequired
};

const Dashboard = () => {
	const { user } = useAuth();
	const [favorites, setFavorites] = useState([]);
	const [myListings, setMyListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingForm, setEditingForm] = useState(null);

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

	const handleEdit = (form) => {
		setEditingForm(form);
	};

	const handleUpdateForm = async (formId, updates) => {
		try {
			await api.put(`/forms/${formId}`, updates);
			setEditingForm(null);
			fetchData(); // Refresh the listings
		} catch (error) {
			console.error('Error updating form:', error);
		}
	};

	if (loading) {
		<div className="flex justify-center items-center min-h-screen">
			<Loading />
		</div>
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
							<RoomCard key={form._id} form={form} onEdit={handleEdit} />
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
							<RoomCard key={form._id} form={form} onEdit={() => {}} />
						))}
						{favorites.length === 0 && (
							<p className="text-muted-foreground col-span-full text-center py-8">
								No favorite rooms yet
							</p>
						)}
					</div>
				</TabsContent>
			</Tabs>

			{/* Edit Form Modal */}
			{editingForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
						<CardHeader>
							<CardTitle>Edit Listing</CardTitle>
						</CardHeader>
						<CardContent>
							<form 
								onSubmit={(e) => {
									e.preventDefault();
									handleUpdateForm(editingForm._id, editingForm);
								}}
								className="space-y-4"
							>
								<div>
									<label className="text-sm">Room Description</label>
									<Textarea
										value={editingForm.roomDetails.description}
										onChange={(e) => setEditingForm({
											...editingForm,
											roomDetails: {
												...editingForm.roomDetails,
												description: e.target.value
											}
										})}
										required
									/>
								</div>

								<div>
									<label className="text-sm">Listing Status</label>
									<Select
										value={editingForm.isActive ? 'active' : 'inactive'}
										onValueChange={(value) => setEditingForm({
											...editingForm,
											isActive: value === 'active'
										})}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="inactive">Inactive</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<label className="text-sm">Personality *</label>
									<Input
										value={editingForm.ownerDetails.personality}
										onChange={(e) => setEditingForm({
											...editingForm,
											ownerDetails: {
												...editingForm.ownerDetails,
												personality: e.target.value
											}
										})}
										placeholder="Describe your personality"
										required
									/>
								</div>

								<div>
									<label className="text-sm">Schedule Preference *</label>
									<Input
										value={editingForm.ownerDetails.morningOrLateNight}
										onChange={(e) => setEditingForm({
											...editingForm,
											ownerDetails: {
												...editingForm.ownerDetails,
												morningOrLateNight: e.target.value
											}
										})}
										placeholder="e.g., Morning person, Night owl"
										required
									/>
								</div>

								<div>
									<label className="text-sm">Cleanliness Level *</label>
									<Input
										value={editingForm.ownerDetails.cleanliness}
										onChange={(e) => setEditingForm({
											...editingForm,
											ownerDetails: {
												...editingForm.ownerDetails,
												cleanliness: e.target.value
											}
										})}
										placeholder="Describe your cleanliness level"
										required
									/>
								</div>

								<div>
									<label className="text-sm">Party Preference *</label>
									<Input
										value={editingForm.ownerDetails.partying}
										onChange={(e) => setEditingForm({
											...editingForm,
											ownerDetails: {
												...editingForm.ownerDetails,
												partying: e.target.value
											}
										})}
										placeholder="Describe your party preferences"
										required
									/>
								</div>

								<div>
									<label className="text-sm">Smoking Preference *</label>
									<Input
										value={editingForm.ownerDetails.smoking}
										onChange={(e) => setEditingForm({
											...editingForm,
											ownerDetails: {
												...editingForm.ownerDetails,
												smoking: e.target.value
											}
										})}
										placeholder="Describe your smoking preferences"
										required
									/>
								</div>

								<div>
									<label className="text-sm">Hobbies</label>
									<Input
										value={editingForm.ownerDetails.hobbies.join(', ')}
										onChange={(e) => setEditingForm({
											...editingForm,
											ownerDetails: {
												...editingForm.ownerDetails,
												hobbies: e.target.value.split(',').map(hobby => hobby.trim()).filter(Boolean)
											}
										})}
										placeholder="Enter hobbies, separated by commas"
									/>
								</div>

								<div>
									<label className="text-sm">Faculty</label>
									<Input
										value={editingForm.ownerDetails.faculty}
										onChange={(e) => setEditingForm({
											...editingForm,
											ownerDetails: {
												...editingForm.ownerDetails,
												faculty: e.target.value
											}
										})}
										placeholder="Your faculty (optional)"
									/>
								</div>

								<div>
									<label className="text-sm">Year</label>
									<Input
										value={editingForm.ownerDetails.year}
										onChange={(e) => setEditingForm({
											...editingForm,
											ownerDetails: {
												...editingForm.ownerDetails,
												year: e.target.value
											}
										})}
										placeholder="Your year (optional)"
									/>
								</div>

								<div className="flex gap-4">
									<Button type="submit">Save Changes</Button>
									<Button 
										type="button" 
										variant="outline" 
										onClick={() => setEditingForm(null)}
									>
										Cancel
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};

export default Dashboard;