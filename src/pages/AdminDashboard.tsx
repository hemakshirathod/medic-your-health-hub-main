import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, TestTube2, Package, Activity } from 'lucide-react';
import { storage } from '@/lib/storage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalLabBookings: 0,
    pendingAppointments: 0,
    pendingLabTests: 0,
  });
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [allLabBookings, setAllLabBookings] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    setUser(currentUser);

    // Load all data
    const users = storage.getAllUsers();
    const appointments = storage.getAllAppointments();
    const labBookings = storage.getAllLabBookings();

    setAllUsers(users);
    setAllAppointments(appointments);
    setAllLabBookings(labBookings);

    setStats({
      totalUsers: users.filter((u: any) => u.role === 'patient').length,
      totalAppointments: appointments.length,
      totalLabBookings: labBookings.length,
      pendingAppointments: appointments.filter((a: any) => a.status === 'pending' || a.status === 'confirmed').length,
      pendingLabTests: labBookings.filter((b: any) => b.status !== 'completed').length,
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage platform operations and monitor activity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered patients</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingAppointments} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lab Tests
              </CardTitle>
              <TestTube2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalLabBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingLabTests} pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹1.2L</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Activity
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">98%</div>
              <p className="text-xs text-muted-foreground mt-1">Platform uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Views */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            {allAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No appointments yet</p>
                </CardContent>
              </Card>
            ) : (
              allAppointments.reverse().map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{appointment.doctorName}</h3>
                          <Badge variant="outline">{appointment.specialty}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Patient ID: {appointment.userId}</p>
                          <p>Date: {appointment.date} at {appointment.time}</p>
                          <p>Fee: ₹{appointment.fee}</p>
                        </div>
                      </div>
                      <Badge>{appointment.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="lab-tests" className="space-y-4">
            {allLabBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No lab bookings yet</p>
                </CardContent>
              </Card>
            ) : (
              allLabBookings.reverse().map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{booking.testName}</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Patient ID: {booking.userId}</p>
                          <p>Date: {booking.date} at {booking.time}</p>
                          <p>Price: ₹{booking.price}</p>
                          {booking.homeCollection && (
                            <Badge variant="outline">Home Collection</Badge>
                          )}
                        </div>
                      </div>
                      <Badge>{booking.status.replace('-', ' ')}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            {allUsers.filter((u: any) => u.role === 'patient').map((patient) => (
              <Card key={patient.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{patient.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Email: {patient.email}</p>
                        <p>Phone: {patient.phone}</p>
                        {patient.bloodType && <p>Blood Type: {patient.bloodType}</p>}
                      </div>
                    </div>
                    <Badge variant="secondary">Patient</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
