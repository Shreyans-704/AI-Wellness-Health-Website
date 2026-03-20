import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { User, Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { supabase } from '@/lib/supabase'





export default function PersonalDetails() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: ""
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePDF = async () => {
    // Check if form has data
    if (!formData.fullName) {
      alert("Please fill in the form before downloading PDF");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      let yPosition = 20;

      // Professional Header
      doc.setFillColor(30, 58, 138); // Dark blue
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      // Title
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("AI Wellness", margin, 25);
      
      // Subtitle
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);
      doc.text("Patient Information Report", margin, 35);

      yPosition = 65;

      // Helper function to add section with better formatting
      const addSection = (title: string) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(13);
        doc.setTextColor(30, 58, 138);
        doc.text(title, margin, yPosition);
        doc.setDrawColor(30, 58, 138);
        doc.line(margin, yPosition + 2, margin + 80, yPosition + 2);
        yPosition += 10;
      };

      // Helper function to add field with better formatting
      const addFieldRow = (label: string, value: string) => {
        if (!value) return;
        
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`${label}:`, margin, yPosition);
        
        doc.setFontSize(11);
        doc.setTextColor(30, 30, 30);
        const fieldWidth = contentWidth - 70;
        const lines = doc.splitTextToSize(value, fieldWidth);
        doc.text(lines, margin + 70, yPosition);
        yPosition += Math.max(6, lines.length * 5) + 3;
      };

      // Personal Information Section
      addSection("Personal Information");
      addFieldRow("Full Name", formData.fullName);
      addFieldRow("Age", formData.age + " years");
      addFieldRow("Gender", formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1));

      yPosition += 5;

      // Medical Information Section
      addSection("Medical Information");
      addFieldRow("Medical History", formData.medicalHistory);
      addFieldRow("Current Medications", formData.currentMedications);
      addFieldRow("Allergies", formData.allergies);

      yPosition += 10;

      // Footer with borders
      doc.setDrawColor(30, 58, 138);
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, pageHeight - 18);
      doc.text("This document is confidential and intended for authorized medical professionals only.", margin, pageHeight - 12);
      doc.text("AI Wellness - Patient Information System | www.aiwellness.com", margin, pageHeight - 6);

      // Generate filename with patient folder
      const patientFolderName = formData.fullName.replace(/\s+/g, "_");
      const fileName = `${patientFolderName}_personal_details_${new Date().toISOString().split('T')[0]}.pdf`;
      const fullPath = `${patientFolderName}/${fileName}`;

      // Convert PDF to base64 for server upload
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Upload to server endpoint which will handle Supabase storage
      const uploadResponse = await fetch('/api/upload-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: fullPath,
          fileData: pdfBase64
        })
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload PDF');
      }

      const uploadResult = await uploadResponse.json();
      console.log('PDF uploaded successfully:', uploadResult);
      alert("PDF downloaded and stored successfully!");

      // Download the PDF to user's computer
      doc.save(fileName);

    } catch (error: any) {
      console.error('Error generating/uploading PDF:', error);
      alert('Error uploading PDF: ' + error.message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    const requiredFields = ['fullName', 'age', 'gender', 'medicalHistory', 'currentMedications', 'allergies'];

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields. Missing: ${missingFields.join(', ')}`);
      return;
    }

    try {
    const { data, error } = await supabase
      .from('personal_details')
      .insert([
        {
          user_id: `user-${Date.now()}`,
          full_name: formData.fullName,
          age: parseInt(formData.age),
          gender: formData.gender,
          medical_history: formData.medicalHistory,
          current_medications: formData.currentMedications,
          allergies: formData.allergies
        }])

    if (error) throw error

    alert("Patient information saved successfully!");
    console.log("Saved data:", data);
    
  } catch (error: any) {
    console.error('Database error:', error.message);
    alert('Error saving to database: ' + error.message);
  }
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
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
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
                </div>

                {/* Gender */}
                <div className="space-y-2">
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

                {/* Medical Information */}
                <div className="space-y-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">Current Medications <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="currentMedications"
                      placeholder="List current medications and dosages"
                      value={formData.currentMedications}
                      onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
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
                    disabled={isGeneratingPDF}
                    size="lg"
                    variant="outline"
                    className="w-full md:w-auto px-12 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        Download & Upload PDF
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
