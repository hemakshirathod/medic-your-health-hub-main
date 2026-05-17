import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, FileText, Pill, TestTube2, Ambulance, Brain } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Book Appointments',
      description: 'Schedule consultations with top specialists',
    },
    {
      icon: FileText,
      title: 'Digital Health Records',
      description: 'Access your medical history anytime, anywhere',
    },
    {
      icon: Pill,
      title: 'Order Medicines',
      description: 'Get medicines delivered to your doorstep',
    },
    {
      icon: TestTube2,
      title: 'Lab Tests',
      description: 'Book tests with home sample collection',
    },
    {
      icon: Brain,
      title: 'AI Health Assistant',
      description: 'Get instant health guidance powered by AI',
    },
    {
      icon: Ambulance,
      title: '24/7 Emergency',
      description: 'Quick access to emergency services',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Hero Section */}
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-primary p-2">
              <Heart className="h-6 w-6 text-primary-foreground fill-current" />
            </div>
            <span className="text-2xl font-bold text-foreground">Medic</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign In</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container">
        {/* Hero */}
        <section className="py-20 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Heart className="h-4 w-4 fill-current" />
            Your Complete Healthcare 
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Healthcare Made
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Simple & Accessible
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Book appointments, manage records, order medicines, and access AI-powered health assistance - all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Best Health Today
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive healthcare services at your fingertips
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6 p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-lg text-muted-foreground">
              Happy thousands of users who trust Medic for their healthcare needs
            </p>
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2025 Medic. Your trusted healthcare partner.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
