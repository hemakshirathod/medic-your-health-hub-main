import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Pill, TestTube2, MessageSquare, Ambulance, Clock, Activity } from 'lucide-react';
import { storage } from '@/lib/storage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    appointments: 0,
    records: 0,
    labTests: 0,
    orders: 0,
  });

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // Load user stats
    const appointments = storage.getAppointments(currentUser.id);
    const records = storage.getHealthRecords(currentUser.id);
    const labBookings = storage.getLabBookings(currentUser.id);
    const orders = storage.getOrders(currentUser.id);

    setStats({
      appointments: appointments.length,
      records: records.length,
      labTests: labBookings.length,
      orders: orders.length,
    });
  }, [navigate]);

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with a doctor',
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      path: '/appointments',
    },
    {
      title: 'Health Records',
      description: 'View and manage your medical records',
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      path: '/health-records',
    },
    {
      title: 'Order Medicine',
      description: 'Browse and order medicines online',
      icon: Pill,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      path: '/medicines',
    },
    {
      title: 'Book Lab Test',
      description: 'Schedule lab tests with home collection',
      icon: TestTube2,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      path: '/lab-tests',
    },
    {
      title: 'AI Assistant',
      description: 'Check symptoms and get health advice',
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      path: '/ai-assistant',
    },
    {
      title: 'Emergency',
      description: 'Quick access to emergency services',
      icon: Ambulance,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      path: '/emergency',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your health in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appointments
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.appointments}</div>
              <p className="text-xs text-muted-foreground mt-1">Total booked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Health Records
              </CardTitle>
              <FileText className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.records}</div>
              <p className="text-xs text-muted-foreground mt-1">Documents stored</p>
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
              <div className="text-2xl font-bold text-foreground">{stats.labTests}</div>
              <p className="text-xs text-muted-foreground mt-1">Tests completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Medicine Orders
              </CardTitle>
              <Pill className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.orders}</div>
              <p className="text-xs text-muted-foreground mt-1">Orders placed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.title}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                  onClick={() => navigate(action.path)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-2`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Health Tips */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Health Tip of the Day</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stay hydrated! Drinking 8 glasses of water daily helps maintain optimal body function, 
              improves skin health, and boosts energy levels.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
