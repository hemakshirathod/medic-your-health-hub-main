import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ShoppingCart, Pill, Plus, Minus, Package } from 'lucide-react';
import { storage } from '@/lib/storage';
import { mockMedicines } from '@/lib/mockData';
import { toast } from 'sonner';
import { Medicine, CartItem, Order } from '@/types';

const Medicines = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setCart(storage.getCart(currentUser.id));
    setOrders(storage.getOrders(currentUser.id));
  }, [navigate]);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.composition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (medicine: Medicine) => {
    const existingItem = cart.find(item => item.medicine.id === medicine.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.medicine.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { medicine, quantity: 1 }];
    }
    
    setCart(updatedCart);
    storage.setCart(user.id, updatedCart);
    toast.success('Added to cart');
  };

  const updateQuantity = (medicineId: string, delta: number) => {
    const updatedCart = cart.map(item => {
      if (item.medicine.id === medicineId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    setCart(updatedCart);
    storage.setCart(user.id, updatedCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const order: Order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      items: cart,
      total: cartTotal,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      shippingAddress: user.phone || 'Not provided',
    };

    const updatedOrders = [...orders, order];
    storage.setOrders(user.id, updatedOrders);
    setOrders(updatedOrders);
    setCart([]);
    storage.setCart(user.id, []);
    toast.success('Order placed successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Medicines</h1>
          <p className="text-lg text-muted-foreground">Order medicines with doorstep delivery</p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Medicines</TabsTrigger>
            <TabsTrigger value="cart">
              Cart ({cart.length})
            </TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicines by name or composition..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medicines Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMedicines.map((medicine) => (
                <Card key={medicine.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{medicine.name}</CardTitle>
                        {medicine.prescriptionRequired && (
                          <Badge variant="secondary" className="text-xs">Rx</Badge>
                        )}
                      </div>
                      <CardDescription>{medicine.composition}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="text-xl font-bold text-primary">₹{medicine.price}</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <p><span className="text-muted-foreground">Manufacturer:</span> {medicine.manufacturer}</p>
                      <p><span className="text-muted-foreground">Dosage:</span> {medicine.dosage}</p>
                    </div>
                    <Button
                      className="w-full"
                      disabled={!medicine.inStock}
                      onClick={() => addToCart(medicine)}
                    >
                      {medicine.inStock ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      ) : (
                        'Out of Stock'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            {cart.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.medicine.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <img
                            src={item.medicine.image}
                            alt={item.medicine.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.medicine.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.medicine.composition}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.medicine.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.medicine.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="text-lg font-bold text-primary">
                                ₹{item.medicine.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-primary/5">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount</span>
                      <span className="text-2xl text-primary">₹{cartTotal}</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            ) : (
              orders.reverse().map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                        <CardDescription>{order.date}</CardDescription>
                      </div>
                      <Badge>{order.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.medicine.name} × {item.quantity}</span>
                        <span className="font-medium">₹{item.medicine.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">₹{order.total}</span>
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

export default Medicines;
