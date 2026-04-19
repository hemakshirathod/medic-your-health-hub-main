import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ambulance, Phone, MapPin, AlertCircle, Activity, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { mockHospitals } from '@/lib/mockData';
import { toast } from 'sonner';
import { Hospital, EmergencyRequest } from '@/types';

const Emergency = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [emergencyForm, setEmergencyForm] = useState({
    location: '',
    destination: '',
    emergencyType: 'medical',
  });

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleAmbulanceRequest = () => {
    if (!emergencyForm.location) {
      toast.error('Please provide your current location');
      return;
    }

    const request: EmergencyRequest = {
      id: `emg_${Date.now()}`,
      userId: user.id,
      type: 'ambulance',
      location: emergencyForm.location,
      destination: emergencyForm.destination,
      emergencyType: emergencyForm.emergencyType,
      status: 'dispatched',
      timestamp: new Date().toISOString(),
    };

    const requests = storage.getEmergencyRequests(user.id);
    storage.setEmergencyRequests(user.id, [...requests, request]);

    toast.success('Ambulance dispatched! ETA: 8-12 minutes');
    setEmergencyForm({ location: '', destination: '', emergencyType: 'medical' });
  };

  const emergencyContacts = [
    { name: 'National Emergency', number: '112', icon: AlertCircle },
    { name: 'Ambulance', number: '108', icon: Ambulance },
    { name: 'Fire', number: '101', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Alert Banner */}
        <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-8 w-8 text-destructive flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-destructive mb-2">Emergency Services</h2>
              <p className="text-foreground">
                If this is a life-threatening emergency, call <strong>112</strong> immediately or use the quick dial buttons below.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <Card
                key={contact.number}
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-destructive"
                onClick={() => {
                  window.open(`tel:${contact.number}`, '_self');
                  toast.success(`Calling ${contact.name}: ${contact.number}`);
                }}
              >
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{contact.name}</h3>
                    <p className="text-2xl font-bold text-destructive">{contact.number}</p>
                  </div>
                  <Button variant="destructive" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Book Ambulance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ambulance className="h-5 w-5 text-destructive" />
                Book Ambulance
              </CardTitle>
              <CardDescription>Request immediate ambulance service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Current Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter your current address"
                  value={emergencyForm.location}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Hospital</Label>
                <Input
                  id="destination"
                  placeholder="Hospital name (optional)"
                  value={emergencyForm.destination}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, destination: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyType">Emergency Type</Label>
                <Select
                  value={emergencyForm.emergencyType}
                  onValueChange={(value) => setEmergencyForm({ ...emergencyForm, emergencyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Emergency</SelectItem>
                    <SelectItem value="accident">Accident</SelectItem>
                    <SelectItem value="cardiac">Cardiac Emergency</SelectItem>
                    <SelectItem value="trauma">Trauma</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                size="lg"
                onClick={handleAmbulanceRequest}
              >
                <Ambulance className="h-4 w-4 mr-2" />
                Request Ambulance Now
              </Button>
              <div className="p-3 bg-muted/50 rounded-lg text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Estimated arrival: 8-12 minutes</span>
              </div>
            </CardContent>
          </Card>

          {/* Nearest Hospitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Nearest Hospitals
              </CardTitle>
              <CardDescription>24/7 Emergency services available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hospitals.map((hospital) => (
                <Card key={hospital.id} className="border-l-4 border-l-accent">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{hospital.name}</h3>
                        <p className="text-sm text-muted-foreground">{hospital.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{hospital.distance}</p>
                        {hospital.emergencyAvailable && (
                          <Badge variant="default" className="mt-1">
                            <Activity className="h-3 w-3 mr-1" />
                            24/7
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hospital.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        window.open(`tel:${hospital.contact}`, '_self');
                        toast.success(`Calling ${hospital.name}`);
                      }}
                    >
                      <Phone className="h-3 w-3 mr-2" />
                      Call Hospital
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* First Aid Tips */}
        <Card className="bg-accent/5 border-accent">
          <CardHeader>
            <CardTitle className="text-accent">Quick First Aid Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• <strong>Bleeding:</strong> Apply firm pressure with clean cloth for 5-10 minutes</p>
            <p>• <strong>Burns:</strong> Cool with running water for 10-20 minutes, don't use ice</p>
            <p>• <strong>Choking:</strong> Perform Heimlich maneuver (abdominal thrusts)</p>
            <p>• <strong>Heart Attack:</strong> Call emergency, give aspirin if available, keep person calm</p>
            <p>• <strong>Unconsciousness:</strong> Check breathing, place in recovery position, call help</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Emergency;
