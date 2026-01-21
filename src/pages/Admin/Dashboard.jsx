import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '@/services/donorService';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { LogOut, Plus, Trash2, Edit2, Phone, Search, X, CheckCircle, Ban } from 'lucide-react';
import { isEligible } from '@/lib/utils';

const Dashboard = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingDonor, setEditingDonor] = useState(null);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        bloodGroup: '',
        phone: '',
        whatsapp: '',
        city: '',
        lastDonationDate: '',
        active: true
    });

    useEffect(() => {
        // Use service subscription
        const unsubscribe = donorService.subscribeToAllDonors(
            (data) => {
                setDonors(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching donors:", error);
                toast.error("Error fetching data");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/admin/login');
            toast.info("Logged out successfully");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.bloodGroup || !formData.city || !formData.phone) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const donationDate = formData.lastDonationDate ? new Date(formData.lastDonationDate) : null;

            const payload = {
                ...formData,
                lastDonationDate: donationDate,
                whatsapp: formData.whatsapp || formData.phone
            };

            if (editingDonor) {
                await donorService.updateDonor(editingDonor.id, payload);
                toast.success("Donor updated successfully");
            } else {
                await donorService.createDonor(payload);
                toast.success("Donor added successfully");
            }
            closeForm();
        } catch (error) {
            console.error("Error saving donor:", error);
            toast.error("Failed to save donor");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this donor? This cannot be undone.")) {
            try {
                await donorService.deleteDonor(id);
                toast.success("Donor deleted");
            } catch (error) {
                console.error("Error deleting:", error);
                toast.error("Failed to delete");
            }
        }
    };

    const toggleStatus = async (donor) => {
        try {
            await donorService.toggleStatus(donor.id, donor.active);
            toast.success(`Donor marked as ${!donor.active ? 'Active' : 'Inactive'}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const openEdit = (donor) => {
        setEditingDonor(donor);
        setFormData({
            name: donor.name,
            bloodGroup: donor.bloodGroup,
            phone: donor.phone,
            whatsapp: donor.whatsapp,
            city: donor.city,
            lastDonationDate: donor.lastDonationDate ? donor.lastDonationDate.toDate().toISOString().split('T')[0] : '',
            active: donor.active
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingDonor(null);
        setFormData({
            name: '',
            bloodGroup: '',
            phone: '',
            whatsapp: '',
            city: '',
            lastDonationDate: '',
            active: true
        });
    };

    const filteredDonors = donors.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.bloodGroup.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage donors and applications</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search donors..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" /> Add Donor
                        </Button>
                        <Button variant="ghost" onClick={handleLogout} size="icon" title="Logout">
                            <LogOut className="h-5 w-5 text-red-500" />
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <Card>
                    <CardContent className="p-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b bg-muted/50">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Group</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contact</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">City</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Eligibility</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {loading ? (
                                        <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr>
                                    ) : filteredDonors.length === 0 ? (
                                        <tr><td colSpan="6" className="p-4 text-center text-muted-foreground">No donors found.</td></tr>
                                    ) : (
                                        filteredDonors.map((donor) => {
                                            const eligible = isEligible(donor.lastDonationDate?.toDate());
                                            return (
                                                <tr key={donor.id} className={`border-b transition-colors hover:bg-muted/50 ${!donor.active ? 'opacity-50 bg-gray-50' : ''}`}>
                                                    <td className="p-4 align-middle font-medium">{donor.name}</td>
                                                    <td className="p-4 align-middle">
                                                        <Badge variant="outline" className="font-bold">{donor.bloodGroup}</Badge>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <div className="flex flex-col text-xs">
                                                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {donor.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">{donor.city}</td>
                                                    <td className="p-4 align-middle">
                                                        {eligible ? (
                                                            <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Eligible</Badge>
                                                        ) : (
                                                            <Badge variant="secondary">Ineligible</Badge>
                                                        )}
                                                    </td>
                                                    <td className="p-4 align-middle text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => toggleStatus(donor)}
                                                                title={donor.active ? "Mark Inactive" : "Mark Active"}
                                                            >
                                                                {donor.active ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Ban className="h-4 w-4 text-gray-400" />}
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => openEdit(donor)}>
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(donor.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Form Overlay */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-bold">{editingDonor ? 'Edit Donor' : 'Add New Donor'}</h2>
                            <Button variant="ghost" size="icon" onClick={closeForm}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name *</Label>
                                        <Input name="name" value={formData.name} onChange={handleInputChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Blood Group *</Label>
                                        <Select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} required>
                                            <option value="">Select</option>
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Phone *</Label>
                                        <Input name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+91" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>WhatsApp (Optional)</Label>
                                        <Input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="Same as phone" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>City / Area *</Label>
                                    <Input name="city" value={formData.city} onChange={handleInputChange} required />
                                </div>

                                <div className="space-y-2">
                                    <Label>Last Donation Date</Label>
                                    <Input
                                        type="date"
                                        name="lastDonationDate"
                                        value={formData.lastDonationDate}
                                        onChange={handleInputChange}
                                    />
                                    <p className="text-xs text-muted-foreground">Leave empty if never donated.</p>
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                                    <Button type="submit">{editingDonor ? 'Update Donor' : 'Save Donor'}</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
