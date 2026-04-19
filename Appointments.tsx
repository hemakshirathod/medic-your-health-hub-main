import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Star, Clock, Search } from 'lucide-react';
import { storage } from '@/lib/storage';
import { mockDoctors } from '@/lib/mockData';
import { toast } from 'sonner';
import { Doctor, Appointment } from '@/types';

const Appointments = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const specialties = ['All', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'General Medicine'];

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setAppointments(storage.getAppointments(currentUser.id));
  }, [navigate]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = () => {
    if (!bookingDoctor || !selectedSlot || !user) return;

    const newAppointment: Appointment = {
      id: `apt_${Date.now()}`,
      userId: user.id,
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      specialty: bookingDoctor.specialty,
      date: selectedSlot.date,
      time: selectedSlot.time,
      status: 'confirmed',
      fee: bookingDoctor.consultationFee,
    };

    const userAppointments = [...appointments, newAppointment];
    storage.setAppointments(user.id, userAppointments);
    
    // Save to all appointments
    const allAppointments = storage.getAllAppointments();
    storage.setAllAppointments([...allAppointments, newAppointment]);

    setAppointments(userAppointments);
    setBookingDoctor(null);
    setSelectedSlot(null);
    toast.success('Appointment booked successfully!');
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'confirmed' || apt.status === 'pending');
  const pastAppointments = appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Appointments</h1>
          <p className="text-lg text-muted-foreground">Book and manage your doctor consultations</p>
        </div>

        <Tabs defaultValue="book" className="space-y-6">
          <TabsList>
            <TabsTrigger value="book">Book Appointment</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors by name or specialty..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {specialties.map((specialty) => (
                    <Button
                      key={specialty}
                      variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSpecialty(specialty)}
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doctors Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <CardTitle>{doctor.name}</CardTitle>
                        <CardDescription>{doctor.specialty}</CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="text-sm font-medium">{doctor.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {doctor.experience} years exp
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Consultation Fee</span>
                      <span className="text-lg font-bold text-primary">₹{doctor.consultationFee}</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" onClick={() => setBookingDoctor(doctor)}>
                          Book Appointment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                          <DialogDescription>Select a convenient time slot</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            {doctor.availableSlots.map((slot, index) => (
                              <Button
                                key={index}
                                variant={selectedSlot === slot ? 'default' : 'outline'}
                                className="justify-start"
                                onClick={() => setSelectedSlot(slot)}
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                {slot.date} at {slot.time}
                              </Button>
                            ))}
                          </div>
                          <Button
                            className="w-full"
                            disabled={!selectedSlot}
                            onClick={handleBookAppointment}
                          >
                            Confirm Booking
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                          <Badge>{appointment.specialty}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.time}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Fee: </span>
                          <span className="font-semibold text-primary">₹{appointment.fee}</span>
                        </div>
                      </div>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No past appointments</p>
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                          <Badge variant="outline">{appointment.specialty}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">{appointment.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Appointments;
