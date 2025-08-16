import Header from "@/components/Header";
import { Phone, Mail, MapPin, Clock, AlertCircle } from 'lucide-react';



const ContactInfoSection = () => {
  const doctorInfo = {
    name: 'Dr. Samarpreet, MD',
    specialty: 'Internal Medicine',
    phone: '+91 8940302356',
    email: 'dr.samarpreet@medicenter.com',
    hospitalName: 'Hospital and Scanning Centre',
    hospitalAddress: 'Model Town Jalandhar',
    hospitalCity: 'Jalandhar, JUC 144011',
    officeHours: 'Mon-Fri: 9:00 AM - 5:00 PM',
    emergencyLine: '+91 8940302356-HELP'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
          <Header />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Healthcare Provider Section */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Phone className="mr-3 text-blue-600" size={28} />
            Healthcare Provider
          </h2>

          <div className="space-y-6">
            {/* Doctor Info */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{doctorInfo.name}</h3>
              <p className="text-blue-600 font-medium mb-4">{doctorInfo.specialty}</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="mr-3 text-gray-500" size={18} />
                  <span className="text-gray-700">{doctorInfo.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 text-gray-500" size={18} />
                  <span className="text-gray-700">{doctorInfo.email}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-3 text-gray-500" size={18} />
                  <span className="text-gray-700">{doctorInfo.officeHours}</span>
                </div>
              </div>
            </div>

            {/* Hospital Info */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{doctorInfo.hospitalName}</h3>
              
              <div className="flex items-start">
                <MapPin className="mr-3 text-gray-500 mt-1" size={18} />
                <div>
                  <p className="text-gray-700">{doctorInfo.hospitalAddress}</p>
                  <p className="text-gray-700">{doctorInfo.hospitalCity}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <AlertCircle className="mr-2" size={20} />
                Emergency Contact
              </h3>
              <div className="flex items-center mb-2">
                <Phone className="mr-3 text-red-600" size={18} />
                <span className="text-red-700 font-semibold">{doctorInfo.emergencyLine}</span>
              </div>
              <p className="text-red-600 text-sm">Available 24/7 for medical emergencies</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Phone className="mr-2" size={16} />
                Call Doctor
              </button>
              <button className="flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Mail className="mr-2" size={16} />
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;         

