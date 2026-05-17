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
import { Checkbox } from '@/components/ui/checkbox';
import { TestTube2, Search, Calendar, Clock, Download, Home } from 'lucide-react';
import { storage } from '@/lib/storage';
import { mockLabTests } from '@/lib/mockData';
import { toast } from 'sonner';
import { LabTest, LabBooking } from '@/types';

const LabTests = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tests, setTests] = useState<LabTest[]>(mockLabTests);
  const [bookings, setBookings] = useState<LabBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingTest, setBookingTest] = useState<LabTest | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    homeCollection: false,
    address: '',
  });

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setBookings(storage.getLabBookings(currentUser.id));
  }, [navigate]);

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookTest = () => {
    if (!bookingTest || !bookingDetails.date || !bookingDetails.time || !user) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (bookingDetails.homeCollection && !bookingDetails.address) {
      toast.error('Please provide your address for home collection');
      return;
    }

    const booking: LabBooking = {
      id: `booking_${Date.now()}`,
      userId: user.id,
      testId: bookingTest.id,
      testName: bookingTest.name,
      date: bookingDetails.date,
      time: bookingDetails.time,
      status: 'scheduled',
      homeCollection: bookingDetails.homeCollection,
      address: bookingDetails.address,
      price: bookingTest.price,
    };

    const updatedBookings = [...bookings, booking];
    storage.setLabBookings(user.id, updatedBookings);
    
    // Save to all bookings for admin
    const allBookings = storage.getAllLabBookings();
    storage.setAllLabBookings([...allBookings, booking]);

    setBookings(updatedBookings);
    setBookingTest(null);
    setBookingDetails({ date: '', time: '', homeCollection: false, address: '' });
    toast.success('Lab test booked successfully!');
  };

  const getStatusColor = (status: LabBooking['status']) => {
    switch (status) {
      case 'scheduled': return 'secondary';
      case 'sample-collected': return 'default';
      case 'processing': return 'default';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Lab Tests</h1>
          <p className="text-lg text-muted-foreground">Book lab tests with home sample collection</p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Tests</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings ({bookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lab tests by name or category..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tests Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredTests.map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <img
                      src={test.image}
                      alt={test.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{test.name}</CardTitle>
                        <Badge variant="secondary">{test.category}</Badge>
                      </div>
                      <CardDescription>{test.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-bold text-primary text-lg">₹{test.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Report delivery</span>
                        <span className="font-medium">{test.reportDeliveryTime}</span>
                      </div>
                      {test.preparationRequired && (
                        <Badge variant="outline" className="mt-2">Preparation Required</Badge>
                      )}
                      {test.homeCollection && (
                        <Badge variant="outline" className="mt-2 flex items-center gap-1 w-fit">
                          <Home className="h-3 w-3" />
                          Home Collection Available
                        </Badge>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" onClick={() => setBookingTest(test)}>
                          Book Test
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book {test.name}</DialogTitle>
                          <DialogDescription>Select date and time for your test</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={bookingDetails.date}
                              onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={bookingDetails.time}
                              onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                            />
                          </div>
                          {test.homeCollection && (
                            <>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="homeCollection"
                                  checked={bookingDetails.homeCollection}
                                  onCheckedChange={(checked) =>
                                    setBookingDetails({ ...bookingDetails, homeCollection: checked as boolean })
                                  }
                                />
                                <Label htmlFor="homeCollection" className="cursor-pointer">
                                  Home sample collection
                                </Label>
                              </div>
                              {bookingDetails.homeCollection && (
                                <div className="space-y-2">
                                  <Label htmlFor="address">Address</Label>
                                  <Input
                                    id="address"
                                    placeholder="Enter your address"
                                    value={bookingDetails.address}
                                    onChange={(e) => setBookingDetails({ ...bookingDetails, address: e.target.value })}
                                  />
                                </div>
                              )}
                            </>
                          )}
                          <Button className="w-full" onClick={handleBookTest}>
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

          <TabsContent value="bookings" className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <TestTube2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No lab test bookings yet</p>
                </CardContent>
              </Card>
            ) : (
              bookings.reverse().map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{booking.testName}</CardTitle>
                        <CardDescription>Booking ID: {booking.id.slice(-8)}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                    {booking.homeCollection && booking.address && (
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Home className="h-4 w-4 text-primary" />
                          <span className="font-medium">Home Collection</span>
                        </div>
                        <p className="text-muted-foreground ml-6">{booking.address}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Amount Paid</span>
                      <span className="text-lg font-bold text-primary">₹{booking.price}</span>
                    </div>
                    {booking.status === 'completed' && booking.reportUrl && (
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    )}
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

export default LabTests;
