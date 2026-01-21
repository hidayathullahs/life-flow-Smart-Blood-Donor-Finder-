import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '@/services/donorService';
import { authService } from '@/services/authService';
import { validateDonorForm } from '@/utils/validators';
import { isEligibleToDonate, calculateDaysSinceDonation } from '@/utils/eligibility';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { LogOut, Plus, Trash2, Edit2, Phone, Search, X, CheckCircle, Ban, AlertCircle } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const Dashboard = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingDonor, setEditingDonor] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive

    // Form & Validation State
    const [formData, setFormData] = useState(getInitialFormState());
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();

    function getInitialFormState() {
        return {
            name: '',
            bloodGroup: '',
            phone: '',
            whatsapp: '',
            city: '',
            lastDonationDate: '',
            active: true
        };
    }

    useEffect(() => {
        const unsubscribe = donorService.subscribeToAllDonors(
            (data) => {
                setDonors(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching donors:", error);
                toast.error("Failed to sync data.");
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
        // Clear error for field on change
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const validation = validateDonorForm(formData);
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            toast.error("Please fix form errors.");
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
        if (window.confirm("Are you sure you want to PERMANENTLY delete this donor?")) {
            try {
                await donorService.deleteDonor(id);
                toast.success("Donor deleted");
            } catch (error) {
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
        setFormErrors({});
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingDonor(null);
        setFormData(getInitialFormState());
        setFormErrors({});
    };

    const filteredDonors = donors.filter(d => {
        const matchesSearch =
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.bloodGroup.includes(searchTerm);

        const matchesStatus =
            statusFilter === 'all' ? true :
                statusFilter === 'active' ? d.active :
                    !d.active;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Dashboard
                            <Badge variant="outline" className="ml-2 bg-gray-100">{donors.length} Donors</Badge>
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage blood donors and requests</p>
                    </div>
                    <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Name, City, or Blood Group..."
                            className="pl-9 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </Select>
                    <Button onClick={() => setIsFormOpen(true)} className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" /> Add New Donor
                    </Button>
                </div>

                {/* Main Content */}
                <Card className="border-none shadow-md overflow-hidden">
                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Donor Profile</th>
                                        <th className="px-6 py-4 font-semibold">Contact</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Last Donation</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">Loading records...</td></tr>
                                    ) : filteredDonors.length === 0 ? (
                                        <tr><td colSpan="5" className="p-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle className="h-8 w-8 text-gray-300" />
                                                <p>No donors found matching requirements.</p>
                                            </div>
                                        </td></tr>
                                    ) : (
                                        filteredDonors.map((donor) => {
                                            const eligible = isEligibleToDonate(donor.lastDonationDate);
                                            const days = calculateDaysSinceDonation(donor.lastDonationDate);

                                            return (
                                                <tr key={donor.id} className={`hover:bg-gray-50/80 transition-colors ${!donor.active ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-10 w-10 min-w-[2.5rem] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm 
                                                                ${donor.bloodGroup.includes('+') ? 'bg-red-500' : 'bg-rose-600'}`}>
                                                                {donor.bloodGroup}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900">{donor.name}</div>
                                                                <div className="text-gray-500 text-xs">{donor.city}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                                <Phone className="h-3 w-3" /> {donor.phone}
                                                            </div>
                                                            {donor.whatsapp && donor.whatsapp !== donor.phone && (
                                                                <div className="text-xs text-green-600">WA: {donor.whatsapp}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {donor.active ? (
                                                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 gap-1">
                                                                <CheckCircle className="h-3 w-3" /> Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="border-gray-200 bg-gray-100 text-gray-500 gap-1">
                                                                <Ban className="h-3 w-3" /> Inactive
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {eligible ? (
                                                            <span className="inline-flex items-center text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-full">
                                                                Eligible
                                                            </span>
                                                        ) : (
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">Ineligible</span>
                                                                <span className="text-[10px] text-gray-400 mt-1">{days} days ago</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => toggleStatus(donor)}
                                                                title={donor.active ? "Deactivate" : "Activate"}
                                                            >
                                                                <Ban className={`h-4 w-4 ${donor.active ? 'text-gray-400' : 'text-green-600'}`} />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600" onClick={() => openEdit(donor)}>
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50" onClick={() => handleDelete(donor.id)}>
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

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 border">
                        <div className="flex items-center justify-between p-6 border-b bg-muted/20">
                            <h2 className="text-lg font-bold">{editingDonor ? 'Edit Donor Details' : 'Register New Donor'}</h2>
                            <Button variant="ghost" size="icon" onClick={closeForm} className="rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name <span className="text-red-500">*</span></Label>
                                        <Input name="name" value={formData.name} onChange={handleInputChange} className={formErrors.name ? 'border-red-500' : ''} />
                                        {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Blood Group <span className="text-red-500">*</span></Label>
                                        <Select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}>
                                            <option value="">Select Group</option>
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </Select>
                                        {formErrors.bloodGroup && <p className="text-xs text-red-500">{formErrors.bloodGroup}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Phone (+91) <span className="text-red-500">*</span></Label>
                                        <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" className={formErrors.phone ? 'border-red-500' : ''} />
                                        {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>WhatsApp (Optional)</Label>
                                        <Input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="Same as phone" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>City / Area <span className="text-red-500">*</span></Label>
                                    <Input name="city" value={formData.city} onChange={handleInputChange} className={formErrors.city ? 'border-red-500' : ''} />
                                    {formErrors.city && <p className="text-xs text-red-500">{formErrors.city}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Last Donation Date</Label>
                                    <Input
                                        type="date"
                                        name="lastDonationDate"
                                        value={formData.lastDonationDate}
                                        onChange={handleInputChange}
                                    />
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> Leave empty if first time donor
                                    </p>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                                    <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                                    <Button type="submit" className="px-8">{editingDonor ? 'Save Changes' : 'Add Donor'}</Button>
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
