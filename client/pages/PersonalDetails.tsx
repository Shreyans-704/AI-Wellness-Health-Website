import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, User, Heart, Ruler, Weight, Mail, Phone,Download } from "lucide-react";
import jsPDF from "jspdf";

export default function PersonalDetails() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    BMI: "",
    height: "",
    weight: "",
    bloodGroup: "",
    emergencyContact: "",
    emergencyPhone: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
    insuranceProvider: "",
    policyNumber: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

      const generatePDF = () => {
    const doc = new jsPDF();

    // Check if form has data
    if (!formData.firstName && !formData.lastName) {
      alert("Please fill in the form before downloading PDF");
      return;
    }

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("WellnessAI - Patient Information", 20, 30);

    // Line under header
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    let yPosition = 50;
    const lineHeight = 8;

    // Helper function to add field
    const addField = (label: string, value: string) => {
      if (value) {
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`${label}:`, 20, yPosition);
        doc.setTextColor(20, 20, 20);
        doc.text(value, 70, yPosition);
        yPosition += lineHeight;
      }
    };

    // Personal Information
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Personal Information", 20, yPosition);
    yPosition += 10;

    addField("First Name", formData.firstName);
    addField("Last Name", formData.lastName);
    addField("Email", formData.email);
    addField("Phone", formData.phone);
    addField("Date of Birth", formData.dateOfBirth);
    addField("Age", formData.age);
    addField("BMI", formData.BMI);
    addField("Gender", formData.gender);
    addField("Insurance Provider", formData.insuranceProvider);
    addField("Policy Number", formData.policyNumber);

    yPosition += 5;

    // Physical Information
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Physical Information", 20, yPosition);
    yPosition += 10;

    addField("Height", formData.height ? `${formData.height} cm` : "");
    addField("Weight", formData.weight ? `${formData.weight} kg` : "");
    addField("Blood Group", formData.bloodGroup);

    yPosition += 5;

    // Emergency Contact
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Emergency Contact", 20, yPosition);
    yPosition += 10;

    addField("Contact Name", formData.emergencyContact);
    addField("Contact Phone", formData.emergencyPhone);

    yPosition += 5;

    // Medical Information
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Medical Information", 20, yPosition);
    yPosition += 10;

    // Handle longer text fields
    if (formData.allergies) {
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Allergies:", 20, yPosition);
      yPosition += 6;
      doc.setTextColor(20, 20, 20);
      const allergiesLines = doc.splitTextToSize(formData.allergies, 150);
      doc.text(allergiesLines, 20, yPosition);
      yPosition += allergiesLines.length * 6 + 4;
    }

    if (formData.medications) {
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Current Medications:", 20, yPosition);
      yPosition += 6;
      doc.setTextColor(20, 20, 20);
      const medicationsLines = doc.splitTextToSize(formData.medications, 150);
      doc.text(medicationsLines, 20, yPosition);
      yPosition += medicationsLines.length * 6 + 4;
    }

    if (formData.medicalHistory) {
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Medical History:", 20, yPosition);
      yPosition += 6;
      doc.setTextColor(20, 20, 20);
      const historyLines = doc.splitTextToSize(formData.medicalHistory, 150);
      doc.text(historyLines, 20, yPosition);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pageHeight - 20);
    doc.text("WellnessAI Patient Information System", 20, pageHeight - 10);

    // Save the PDF
    const fileName = `${formData.firstName || 'Patient'}_${formData.lastName || 'Info'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'age',
      'gender', 'BMI', 'height', 'weight', 'bloodGroup', 'emergencyContact',
      'emergencyPhone', 'allergies', 'medications', 'medicalHistory'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields. Missing: ${missingFields.join(', ')}`);
      return;
    }

    console.log("Patient data:", formData);
    // TODO: Submit to backend
    alert("Patient information saved successfully! All required fields are complete.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
      <Header />
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <User className="h-8 w-8 text-primary" />
                Personal Details
              </CardTitle>
              <CardDescription className="text-lg">
                Please provide your basic information for our medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Personal Details */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                    <Select onValueChange={(value) => handleInputChange("gender", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/*Insurance group*/}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider" className="flex items-center gap-2">
                      Insurance Provider <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="insuranceProvider"
                      type="text"
                      placeholder="Enter your insurance provider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="policyNumber"
                      type="text"
                      placeholder="Enter your policy number"
                      value={formData.policyNumber}
                      onChange={(e) => handleInputChange("policyNumber", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bmi">BMI <span className="text-red-500">*</span></Label>
                    <Input
                      id="bmi"
                      type="number"
                      placeholder="22.5"
                      min="10"
                      max="50"
                      step="0.1"
                      value={formData.BMI}
                      onChange={(e) => handleInputChange("BMI", e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">It includes appropriate min/max values for BMI (10-50)</p>
                  </div>
                </div>

                {/* Physical Information */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Height (cm) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      min="50"
                      max="250"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Weight className="h-4 w-4" />
                      Weight (kg) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      min="20"
                      max="300"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Blood Group <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("bloodGroup", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="emergencyContact"
                      type="text"
                      placeholder="Enter emergency contact name"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone <span className="text-red-500">*</span></Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="+1 (555) 987-6543"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="allergies"
                      placeholder="List any known allergies (e.g., penicillin, peanuts, etc.)"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="medications"
                      placeholder="List current medications and dosages"
                      value={formData.medications}
                      onChange={(e) => handleInputChange("medications", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="medicalHistory"
                      placeholder="Describe any significant medical history, surgeries, or chronic conditions"
                      value={formData.medicalHistory}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row justify-center gap-4 pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto px-12 py-3 text-lg bg-primary hover:bg-primary/90"
                  >
                    Save Patient Information
                  </Button>
                  <Button
                    type="button"
                    onClick={generatePDF}
                    size="lg"
                    variant="outline"
                    className="w-full md:w-auto px-12 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
