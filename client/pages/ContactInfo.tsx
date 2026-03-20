import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, AlertCircle, MessageSquare, Send, Users, Stethoscope, Heart, Brain, Activity } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ContactInfoSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const primaryContact = {
    name: 'Dr. Rajesh Kumar, MBBS, MD',
    specialty: 'Neurology & Sleep Medicine',
    phone: '+91 9876543210',
    email: 'dr.rajesh.kumar@aimedicalcenter.in',
    hospitalName: 'Advanced Medical Care Institute',
    hospitalAddress: '456 Sector 5, Chandigarh',
    hospitalCity: 'Chandigarh, India 160005',
    officeHours: 'Mon-Sat: 10:00 AM - 7:00 PM',
    emergencyLine: '+91 9876543210',
    whatsapp: '+91 9876543210'
  };

  const departments = [
    { name: 'Cardiology', icon: Heart, phone: '+91 9876543210', responseTime: '15 min' },
    { name: 'Internal Medicine', icon: Stethoscope, phone: '+91 9876543211', responseTime: '20 min' },
    { name: 'AI Health Screening', icon: Brain, phone: '+91 9876543212', responseTime: '10 min' },
    { name: 'Wellness & Prevention', icon: Activity, phone: '+91 9876543213', responseTime: '30 min' }
  ];

  const supportChannels = [
    { name: 'Phone Support', icon: Phone, value: '+91 8940302356', availability: '24/7' },
    { name: 'Email Support', icon: Mail, value: 'support@medicalai.com', availability: '24 hours' },
    { name: 'WhatsApp', icon: MessageSquare, value: 'Chat with us', availability: '24/7' },
    { name: 'Emergency Line', icon: AlertCircle, value: '+91 8940302356-EMERGENCY', availability: 'Anytime' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry. We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Medical AI Health Centre</h1>
            <p className="text-xl text-gray-600">Get in touch with our medical team for consultations, appointments, and inquiries</p>
          </div>

          {/* Primary Contact Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Doctor Card */}
            <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Chief Medical Officer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{primaryContact.name}</h3>
                  <p className="text-blue-600 font-semibold mt-1">{primaryContact.specialty}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600 mr-3" />
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Direct Phone</p>
                      <p className="font-semibold text-gray-900">{primaryContact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600 mr-3" />
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900 truncate">{primaryContact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600 mr-3" />
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Office Hours</p>
                      <p className="font-semibold text-gray-900">{primaryContact.officeHours}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hospital Info */}
            <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                  Healthcare Facility
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{primaryContact.hospitalName}</h3>
                  <p className="text-green-600 font-semibold mt-1">24/7 Medical AI Support</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start justify-center p-3 bg-green-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-900">{primaryContact.hospitalAddress}</p>
                      <p className="font-semibold text-gray-900">{primaryContact.hospitalCity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Emergency</p>
                      <p className="font-semibold text-red-700">{primaryContact.emergencyLine}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-green-600 mr-3" />
                    <div className="text-left">
                      <p className="text-sm text-gray-600">WhatsApp</p>
                      <p className="font-semibold text-gray-900">{primaryContact.whatsapp}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Departments Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Medical Departments</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept, index) => {
                const IconComponent = dept.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all hover:border-blue-300">
                    <CardContent className="pt-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-7 w-7 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">Phone: {dept.phone}</p>
                      <p className="text-sm font-semibold text-green-600">Response: {dept.responseTime}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Contact Channels */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Channels</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportChannels.map((channel, index) => {
                const IconComponent = channel.icon;
                const bgColor = index === 0 ? 'bg-blue-50' : index === 1 ? 'bg-green-50' : index === 2 ? 'bg-purple-50' : 'bg-red-50';
                const iconColor = index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : index === 2 ? 'text-purple-600' : 'text-red-600';
                
                return (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-6">
                      <div className={"flex justify-center mb-4 w-14 h-14 rounded-lg flex items-center justify-center mx-auto " + bgColor}>
                        <IconComponent className={`h-6 w-6 ${iconColor}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{channel.name}</h3>
                      <p className="text-sm text-gray-700 text-center font-semibold mb-2">{channel.value}</p>
                      <p className={`text-xs font-semibold text-center ${index === 3 ? 'text-red-600' : 'text-green-600'}`}>
                        {channel.availability}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="border-2 border-blue-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-6 w-6 text-blue-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>We'll respond to your inquiry within 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 text-lg"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">What are your office hours?</h3>
                <p className="text-gray-700">We are open Monday to Friday, 9:00 AM to 6:00 PM. Emergency services available 24/7.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">How do I schedule an appointment?</h3>
                <p className="text-gray-700">Call our office at +91 8940302356 or use our contact form. Appointments can be scheduled online.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Do you offer telemedicine consultations?</h3>
                <p className="text-gray-700">Yes, we offer virtual consultations. Call or email us to arrange a video appointment.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">What insurance do you accept?</h3>
                <p className="text-gray-700">We accept most major insurance plans. Please call for specific details about your coverage.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactInfoSection;