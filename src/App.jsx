import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { 
  Smartphone, 
  Globe, 
  Palette, 
  TrendingUp, 
  ShoppingCart, 
  Cloud,
  MessageCircle,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Award,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import './App.css';

// Analytics helper
const trackEvent = (type, payload = {}) => {
  window.dispatchEvent(new CustomEvent('analytics', { 
    detail: { type, payload }
  }));
  console.log('Analytics:', type, payload);
};

// AI Quote Estimator Component
const QuoteEstimator = () => {
  const [service, setService] = useState('');
  const [features, setFeatures] = useState([]);
  const [projectDescription, setProjectDescription] = useState('');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const services = {
    'apps': 'Mobile App Development',
    'web': 'Web Development',
    'uiux': 'UI/UX Design',
    'seo': 'SEO & Social Media Marketing',
    'ecom': 'E-commerce Solutions',
    'cloud': 'IT & Cloud Solutions'
  };

  const featureOptions = [
    'User Login / Authentication',
    'Online Payments',
    'Booking / Scheduling',
    'Shopping Cart',
    'Loyalty / Rewards',
    'Cloud Hosting / CI/CD',
    'Analytics Dashboard',
    'SEO Audit & Optimization'
  ];

  const handleFeatureToggle = (feature) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const getQuote = async () => {
    if (!service) {
      setError('Please select a service to get started.');
      return;
    }

    setLoading(true);
    setError('');
    trackEvent('quote_requested', { service, features });

    try {
      const response = await fetch('/api/ai/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, features, description: projectDescription })
      });

      if (!response.ok) throw new Error('Failed to get quote');
      
      const result = await response.json();
      setQuote(result);
      trackEvent('quote_returned', result);
    } catch (err) {
      setError('Something went wrong. Try again or contact us.');
      trackEvent('error', { type: 'quote_failed', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-brand" />
          💡 Instant Quote Estimator
        </CardTitle>
        <CardDescription>
          Get a fast estimate for your project. Select the service and features, and we'll give you an estimated cost range in seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Choose a Service</label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger>
              <SelectValue placeholder="Select a service..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(services).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Features (optional)</label>
          <div className="grid grid-cols-2 gap-2">
            {featureOptions.map(feature => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tell us about your project</label>
          <Textarea
            placeholder="Example: A booking app for a salon with payment integration."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={3}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button 
          onClick={getQuote} 
          disabled={loading || !service}
          className="w-full"
        >
          {loading ? 'Calculating...' : 'Get My Quote'}
        </Button>

        {quote && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Your Estimated Range</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Based on your selections, your project is estimated at <strong>{quote.hours} hours</strong>, 
                ranging from <strong>${quote.priceLow?.toLocaleString()} – ${quote.priceHigh?.toLocaleString()}</strong>.
              </p>
              <p className="text-sm text-green-600 mb-4">
                Next step: click below to request a detailed proposal.
              </p>
              <Button className="w-full">Request Proposal</Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

// AI Concierge Chat Component
const AIConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'How can I help? Get a fast estimate or book a call.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    trackEvent('chat_message_sent', { message: input });

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const result = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
      trackEvent('chat_response_received');
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble right now. Please try the contact form or call us directly.' 
      }]);
      trackEvent('error', { type: 'chat_failed', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Get a Quote', action: () => setInput('I want a quote') },
    { label: 'Book a Call', action: () => setInput('I want to book a call') },
    { label: 'Ask a Question', action: () => setInput('I have a question') }
  ];

  return (
    <>
      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>TrillionTech Concierge</DialogTitle>
            <DialogDescription>
              How can I help you today?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {quickActions.map(action => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    action.action();
                    sendMessage();
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto space-y-2 p-2 border rounded">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded max-w-xs ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white ml-auto' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="bg-gray-100 text-gray-800 p-2 rounded max-w-xs">
                  Typing...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                Send
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              We use your info only to contact you about your request.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Demo Components
const MobileAppDemo = () => (
  <div className="phone-frame mx-auto">
    <div className="phone-screen p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center mb-6">
        <h3 className="font-bold text-lg">Salon Booking App</h3>
        <p className="text-sm text-gray-600">Book your appointment</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold">Available Services</h4>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Haircut & Style</span>
              <span className="font-bold">$65</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Color Treatment</span>
              <span className="font-bold">$120</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold">Select Time</h4>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {['9:00', '10:30', '2:00', '3:30', '5:00'].map(time => (
              <button key={time} className="p-2 bg-blue-100 rounded text-sm">
                {time}
              </button>
            ))}
          </div>
        </div>
        
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold">
          Book Appointment
        </button>
      </div>
    </div>
  </div>
);

const WebsiteDemo = () => (
  <div className="demo-frame">
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <h3 className="text-2xl font-bold">Elite Law Firm</h3>
        <p>Trusted legal expertise since 1985</p>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold">Corporate Law</h4>
            <p className="text-sm text-gray-600">Business formation, contracts, compliance</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold">Family Law</h4>
            <p className="text-sm text-gray-600">Divorce, custody, estate planning</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold">Personal Injury</h4>
            <p className="text-sm text-gray-600">Accidents, medical malpractice</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
            Free Consultation
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SEODashboardDemo = () => (
  <div className="demo-frame">
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">SEO Performance Dashboard</h3>
      
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">+127%</div>
          <div className="text-sm text-gray-600">Organic Traffic</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">43</div>
          <div className="text-sm text-gray-600">Keywords Ranking</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">8.2</div>
          <div className="text-sm text-gray-600">Avg. Position</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">2.4%</div>
          <div className="text-sm text-gray-600">Click Rate</div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Top Keywords</h4>
        <div className="space-y-2">
          {[
            { keyword: 'digital marketing agency', position: 3, traffic: 1240 },
            { keyword: 'SEO services', position: 7, traffic: 890 },
            { keyword: 'web design company', position: 12, traffic: 650 }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-sm">{item.keyword}</span>
              <div className="flex gap-4 text-sm">
                <span>#{item.position}</span>
                <span className="text-green-600">{item.traffic} visits</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
function App() {
  const [activeDemo, setActiveDemo] = useState('mobile');

  useEffect(() => {
    trackEvent('page_loaded');
  }, []);

  const services = [
    {
      id: 'apps',
      icon: Smartphone,
      title: 'Mobile App Development',
      price: '$50–$100/hr',
      description: 'Custom iOS & Android apps for booking, ordering, tracking, and engagement.',
      features: ['Native iOS & Android', 'Cross-platform React Native', 'Backend API integration', 'App Store deployment']
    },
    {
      id: 'web',
      icon: Globe,
      title: 'Web Development',
      price: '$40–$80/hr',
      description: 'Responsive, modern websites built to convert leads.',
      features: ['React/Next.js development', 'Responsive design', 'SEO optimization', 'Performance optimization']
    },
    {
      id: 'uiux',
      icon: Palette,
      title: 'UI/UX Design',
      price: '$35–$70/hr',
      description: 'User-friendly designs, wireframes, and clean interfaces that improve conversions.',
      features: ['User research', 'Wireframing & prototyping', 'Visual design', 'Usability testing']
    },
    {
      id: 'seo',
      icon: TrendingUp,
      title: 'SEO & Social Media',
      price: '$30–$60/hr',
      description: 'Search optimization and campaigns to grow visibility and brand authority.',
      features: ['Keyword research', 'On-page optimization', 'Content strategy', 'Social media management']
    },
    {
      id: 'ecom',
      icon: ShoppingCart,
      title: 'E-commerce Solutions',
      price: '$40–$75/hr',
      description: 'Shopify, WooCommerce, and Magento builds with secure checkout and product catalogs.',
      features: ['Platform setup', 'Payment integration', 'Inventory management', 'Analytics & reporting']
    },
    {
      id: 'cloud',
      icon: Cloud,
      title: 'IT & Cloud Solutions',
      price: '$50–$90/hr',
      description: 'Secure, scalable infrastructure, cloud migrations, and automation.',
      features: ['AWS/Azure setup', 'DevOps automation', 'Security implementation', 'Monitoring & maintenance']
    }
  ];

  const caseStudies = [
    {
      title: 'Medical Practice Booking System',
      problem: 'Dr. Martinez\'s clinic was losing patients due to phone-only booking',
      solution: 'Built a custom booking app with payment integration and automated reminders',
      result: 'Online booking increased 280%, patient satisfaction up 45%',
      metrics: { bookings: '+280%', satisfaction: '+45%', revenue: '+$120k' }
    },
    {
      title: 'Law Firm Lead Generation',
      problem: 'Elite Law Firm needed more qualified leads for their practice',
      solution: 'Redesigned website with SEO optimization and lead capture forms',
      result: '150+ qualified leads in 90 days, 3x conversion rate',
      metrics: { leads: '150+', conversion: '3x', cases: '+$500k' }
    },
    {
      title: 'Construction Project Management',
      problem: 'BuildCorp struggled with project tracking and client communication',
      solution: 'Developed a project portal with real-time updates and photo sharing',
      result: '3 major contracts closed worth $500k total',
      metrics: { contracts: '3', value: '$500k', efficiency: '+60%' }
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Martinez',
      company: 'Martinez Family Practice',
      quote: 'Our patients love the new booking system. It\'s so much easier for them and for us.',
      rating: 5
    },
    {
      name: 'John R.',
      title: 'Law Partner',
      company: 'Elite Law Firm',
      quote: 'They gave us a lead machine. Our website now brings in qualified clients every week.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <a href="#" className="logo">Trillion Web Solutions</a>
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#demos">Demos</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Web, Mobile & IT Solutions On Demand</h1>
            <p>
              From doctors and lawyers to restaurants, real estate, and home builders — 
              we design websites, mobile apps, and digital marketing campaigns that grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn primary">
                See Live Demos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="btn ghost">
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2>Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional digital solutions with transparent hourly pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="card h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-8 w-8 text-brand" />
                      <Badge variant="secondary" className="price">
                        {service.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">
                      View Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quote Estimator */}
          <QuoteEstimator />
        </div>
      </section>

      {/* Live Demos Section */}
      <section id="demos" className="section dark">
        <div className="container">
          <div className="text-center mb-12">
            <h2>Interactive Demos</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Experience our work firsthand with these live, interactive demonstrations
            </p>
          </div>

          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="mobile">Mobile Apps</TabsTrigger>
              <TabsTrigger value="website">Websites</TabsTrigger>
              <TabsTrigger value="seo">SEO Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mobile" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Salon Booking App</h3>
                <p className="opacity-80">Complete booking system with payments and scheduling</p>
              </div>
              <MobileAppDemo />
            </TabsContent>
            
            <TabsContent value="website" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Law Firm Website</h3>
                <p className="opacity-80">Professional website with lead capture and service showcase</p>
              </div>
              <WebsiteDemo />
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">SEO Analytics Dashboard</h3>
                <p className="opacity-80">Real-time SEO performance tracking and keyword monitoring</p>
              </div>
              <SEODashboardDemo />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Portfolio/Case Studies Section */}
      <section id="portfolio" className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2>Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real results from real clients
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {caseStudies.map((study, idx) => (
              <Card key={idx} className="card">
                <CardHeader>
                  <CardTitle className="text-lg">{study.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-1">Problem</h4>
                    <p className="text-sm text-muted-foreground">{study.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-1">Solution</h4>
                    <p className="text-sm text-muted-foreground">{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-1">Result</h4>
                    <p className="text-sm text-muted-foreground">{study.result}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                    {Object.entries(study.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="font-bold text-brand">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="card">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-4">"{testimonial.quote}"</blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    {testimonial.title && <div className="text-sm text-muted-foreground">{testimonial.title}</div>}
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section dark">
        <div className="container">
          <div className="text-center mb-12">
            <h2>Get Started Today</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Ready to transform your business? Let's discuss your project.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="contact-form">
              <CardHeader>
                <CardTitle>Request Your Demo</CardTitle>
                <CardDescription>
                  Tell us about your project and we'll get back to you within 1 business day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Your name" required />
                    <Input type="email" placeholder="Email" required />
                  </div>
                  <Input placeholder="Business / Website" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Service interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">Mobile Apps</SelectItem>
                      <SelectItem value="web">Web Development</SelectItem>
                      <SelectItem value="uiux">UI/UX</SelectItem>
                      <SelectItem value="seo">SEO & Social</SelectItem>
                      <SelectItem value="ecom">E-commerce</SelectItem>
                      <SelectItem value="cloud">IT & Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea rows={5} placeholder="Tell us what you need" />
                  <Button className="w-full" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-brand" />
                    <span>hello@trilliontech.dev</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-brand" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-brand" />
                    <span>Miami, FL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-brand" />
                    <span>Mon-Fri 9AM-6PM EST</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Quick Response Times</h4>
                <p className="text-sm opacity-80">
                  We typically respond to inquiries within 2 hours during business hours.
                  For urgent projects, call us directly.
                </p>
              </div>

              <Button size="lg" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Trillion Web Solutions</h4>
              <p className="text-sm opacity-80">
                Premium digital solutions for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="opacity-80 hover:opacity-100">Mobile Apps</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100">Web Development</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100">UI/UX Design</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100">SEO & Marketing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="opacity-80 hover:opacity-100">About</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100">Portfolio</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100">Blog</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="opacity-80 hover:opacity-100">Privacy Policy</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100">Terms of Service</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p>&copy; 2025 Trillion Web Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Concierge */}
      <AIConcierge />
    </div>
  );
}

export default App;
