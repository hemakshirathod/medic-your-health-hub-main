import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { User, Phone, Mail, Droplet, AlertCircle, Pill } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
  });

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setFormData({
      name: currentUser.name || '',
      phone: currentUser.phone || '',
      bloodType: currentUser.bloodType || '',
      allergies: currentUser.allergies?.join(', ') || '',
      chronicConditions: currentUser.chronicConditions?.join(', ') || '',
      currentMedications: currentUser.currentMedications?.join(', ') || '',
      emergencyContactName: currentUser.emergencyContact?.name || '',
      emergencyContactRelation: currentUser.emergencyContact?.relation || '',
      emergencyContactPhone: currentUser.emergencyContact?.phone || '',
    });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: formData.name,
      phone: formData.phone,
      bloodType: formData.bloodType,
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: formData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      currentMedications: formData.currentMedications.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: formData.emergencyContactName,
        relation: formData.emergencyContactRelation,
        phone: formData.emergencyContactPhone,
      },
    };

    storage.setUser(updatedUser);
    
    // Update in all users list
    const allUsers = storage.getAllUsers();
    const userIndex = allUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser;
      storage.setAllUsers(allUsers);
    }

    setUser(updatedUser);
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-4xl">
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
          <p className="text-lg text-muted-foreground">Manage your personal and medical information</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-accent" />
                Medical Information
              </CardTitle>
              <CardDescription>Important health details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Input
                  id="bloodType"
                  placeholder="e.g., A+, O-, B+"
                  value={formData.bloodType}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                  id="allergies"
                  placeholder="e.g., Penicillin, Peanuts (comma separated)"
                  value={formData.allergies}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                <Input
                  id="chronicConditions"
                  placeholder="e.g., Diabetes, Hypertension (comma separated)"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Input
                  id="currentMedications"
                  placeholder="e.g., Metformin, Aspirin (comma separated)"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Emergency Contact
              </CardTitle>
              <CardDescription>Person to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  placeholder="Full name"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relationship</Label>
                <Input
                  id="emergencyContactRelation"
                  placeholder="e.g., Spouse, Parent, Sibling"
                  value={formData.emergencyContactRelation}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                <Input
                  id="emergencyContactPhone"
                  placeholder="+1234567890"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {editing ? (
              <>
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    // Reset form data
                    setFormData({
                      name: user?.name || '',
                      phone: user?.phone || '',
                      bloodType: user?.bloodType || '',
                      allergies: user?.allergies?.join(', ') || '',
                      chronicConditions: user?.chronicConditions?.join(', ') || '',
                      currentMedications: user?.currentMedications?.join(', ') || '',
                      emergencyContactName: user?.emergencyContact?.name || '',
                      emergencyContactRelation: user?.emergencyContact?.relation || '',
                      emergencyContactPhone: user?.emergencyContact?.phone || '',
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)} className="flex-1">
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
