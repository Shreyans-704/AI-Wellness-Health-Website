import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Heart, AlertTriangle, Download, User, Activity, Menu, X, RefreshCw, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import jsPDF from "jspdf";
import { supabase } from '@/lib/supabase';

interface PersonalInfo {
  full_name: string;
  age: number;
  gender: string;
  allergies: string;
  current_medications: string;
  medical_history: string;
}

interface HealthAssessment {
  symptoms: string[];
  riskFactors: string[];
  vitals: {
    systolicBP: number;
    diastolicBP: number;
    heartRate: number;
    spO2: number;
    temperature: number;
  };
}

const Health: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loadingPersonalInfo, setLoadingPersonalInfo] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [healthAssessment, setHealthAssessment] = useState<HealthAssessment>({
    symptoms: [],
    riskFactors: [],
    vitals: {
      systolicBP: 0,
      diastolicBP: 0,
      heartRate: 0,
      spO2: 0,
      temperature: 0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);

  // Symptom options - Essential only
  const symptomOptions = [
    'Chest Pain',
    'Shortness of Breath',
    'Palpitations',
    'Fatigue',
    'Dizziness'
  ];

  // Risk factor options - Essential only
  const riskFactorOptions = [
    'Smoking',
    'Diabetes',
    'Hypertension',
    'High Cholesterol',
    'Stress'
  ];

  // Fetch latest personal information from database
  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    setLoadingPersonalInfo(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('personal_details')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const personalData = data[0];
        setPersonalInfo({
          full_name: personalData.full_name,
          age: personalData.age,
          gender: personalData.gender,
          allergies: personalData.allergies,
          current_medications: personalData.current_medications,
          medical_history: personalData.medical_history
        });
      } else {
        setError('No personal information found. Please complete the Personal Details form first.');
      }
    } catch (error: any) {
      console.error('Error fetching personal info:', error);
      setError('Error loading personal information: ' + error.message);
    } finally {
      setLoadingPersonalInfo(false);
    }
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string | number) => {
    if (personalInfo) {
      const updatedInfo = {
        ...personalInfo,
        [field]: value
      };
      
      setPersonalInfo(updatedInfo);
    }
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setHealthAssessment(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleRiskFactorChange = (factor: string, checked: boolean) => {
    setHealthAssessment(prev => ({
      ...prev,
      riskFactors: checked 
        ? [...prev.riskFactors, factor]
        : prev.riskFactors.filter(f => f !== factor)
    }));
  };

  const handleVitalChange = (vital: string, value: string) => {
    setHealthAssessment(prev => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [vital]: parseFloat(value) || 0
      }
    }));
  };

  const calculateRiskScore = (): number => {
    let score = 0;
    
    // Age factor
    if (personalInfo?.age && personalInfo.age > 65) score += 2;
    else if (personalInfo?.age && personalInfo.age > 50) score += 1;
    
    // Symptoms
    const highRiskSymptoms = ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Syncope (Fainting)'];
    const presentHighRiskSymptoms = healthAssessment.symptoms.filter(s => highRiskSymptoms.includes(s));
    score += presentHighRiskSymptoms.length * 2;
    
    // Risk factors
    const criticalRiskFactors = ['Diabetes', 'Hypertension', 'Family History of Heart Disease', 'Smoking'];
    const presentCriticalFactors = healthAssessment.riskFactors.filter(f => criticalRiskFactors.includes(f));
    score += presentCriticalFactors.length;
    
    // Vitals
    if (healthAssessment.vitals.systolicBP > 140 || healthAssessment.vitals.diastolicBP > 90) score += 2;
    if (healthAssessment.vitals.heartRate > 100 || healthAssessment.vitals.heartRate < 60) score += 1;
    if (healthAssessment.vitals.spO2 < 95) score += 3;
    
    return Math.min(score, 10); // Cap at 10
  };

  const generateReport = () => {
    if (!personalInfo) {
      setError('No personal information available. Please complete the Personal Details form first.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate processing time for realistic experience
    setTimeout(() => {
      const riskScore = calculateRiskScore();

      // Determine urgency level
      let urgencyLevel = 'LOW';
      let urgencyReasoning = 'Based on current assessment, routine follow-up is recommended.';
      
      if (riskScore >= 7) {
        urgencyLevel = 'URGENT';
        urgencyReasoning = 'High-risk symptoms and factors present. Immediate medical consultation recommended.';
      } else if (riskScore >= 4) {
        urgencyLevel = 'MODERATE';
        urgencyReasoning = 'Several risk factors identified. Medical consultation within 2-4 weeks recommended.';
      }

      // Generate comprehensive report
      const generatedReport = `
📋 PRELIMINARY HEALTH ASSESSMENT
Dear ${personalInfo.full_name},

Thank you for completing your Wellness AI health screening. This preliminary assessment is designed to help identify potential health concerns that may benefit from further evaluation by a healthcare professional.

👤 PATIENT INFORMATION SUMMARY
• Name: ${personalInfo.full_name}
• Age: ${personalInfo.age} years (${personalInfo.age < 18 ? 'Pediatric' : personalInfo.age < 65 ? 'Adult' : 'Senior'} category)
• Gender: ${personalInfo.gender}

🎯 ESTIMATED RISK SCORE
Risk Score: ${riskScore}/10

Risk Factors Contributing to Score:
${personalInfo.age > 65 ? '• Age factor: Senior category (+2 points)' : personalInfo.age > 50 ? '• Age factor: Middle-age category (+1 point)' : '• Age factor: Low risk'}
${healthAssessment.symptoms.filter(s => ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Dizziness'].includes(s)).length > 0 ? 
  `• Concerning symptoms present: ${healthAssessment.symptoms.filter(s => ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Dizziness'].includes(s)).join(', ')} (+${healthAssessment.symptoms.filter(s => ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Dizziness'].includes(s)).length * 2} points)` : 
  '• No concerning symptoms identified'}
${healthAssessment.riskFactors.filter(f => ['Diabetes', 'Hypertension', 'High Cholesterol', 'Smoking'].includes(f)).length > 0 ?
  `• Risk factors identified: ${healthAssessment.riskFactors.filter(f => ['Diabetes', 'Hypertension', 'High Cholesterol', 'Smoking'].includes(f)).join(', ')} (+${healthAssessment.riskFactors.filter(f => ['Diabetes', 'Hypertension', 'High Cholesterol', 'Smoking'].includes(f)).length} points)` :
  '• No major risk factors identified'}

📊 CURRENT VITAL SIGNS
• Blood Pressure: ${healthAssessment.vitals.systolicBP}/${healthAssessment.vitals.diastolicBP} mmHg ${healthAssessment.vitals.systolicBP > 140 || healthAssessment.vitals.diastolicBP > 90 ? '(ELEVATED - Contributing to risk)' : '(Normal range)'}
• Heart Rate: ${healthAssessment.vitals.heartRate} BPM ${healthAssessment.vitals.heartRate > 100 ? '(Tachycardia)' : healthAssessment.vitals.heartRate < 60 ? '(Bradycardia)' : '(Normal range)'}
• Oxygen Saturation: ${healthAssessment.vitals.spO2}% ${healthAssessment.vitals.spO2 < 95 ? '(LOW - Concerning)' : '(Normal)'}
• Temperature: ${healthAssessment.vitals.temperature}°F

🚨 URGENCY FOR CARDIOLOGIST CONSULTATION: ${urgencyLevel}

Reasoning: ${urgencyReasoning}

${urgencyLevel === 'URGENT' ? '⚠️ IMMEDIATE ACTION REQUIRED: Please contact a cardiologist or visit the emergency department within 24 hours.' : 
  urgencyLevel === 'MODERATE' ? '⚡ TIMELY FOLLOW-UP NEEDED: Schedule cardiology consultation within 2-4 weeks.' :
  '📅 ROUTINE MONITORING: Annual cardiac screening recommended.'}

🔬 SUGGESTED NEXT STEPS & DIAGNOSTIC TESTS
1. Electrocardiogram (ECG/EKG) - To assess heart rhythm and electrical activity
2. Echocardiogram - To evaluate heart structure and function
3. Chest X-ray - To assess heart size and lung condition
4. Complete Blood Count (CBC) - To check for underlying conditions
5. Comprehensive Metabolic Panel - To assess kidney function and electrolytes
6. Lipid Panel - To evaluate cardiovascular risk factors
7. Thyroid Function Tests - To rule out thyroid-related cardiac issues
${urgencyLevel === 'URGENT' ? '8. Emergency cardiac catheterization if indicated by cardiologist' : ''}
${riskScore >= 5 ? '9. Exercise stress test or cardiac CT scan for further evaluation' : ''}

🫀 POSSIBLE STRUCTURAL HEART DISEASE (SHD) CONDITIONS TO INVESTIGATE
Based on your symptoms and risk factors, consider evaluation for:

${healthAssessment.symptoms.includes('Chest Pain') ? '• Coronary Artery Disease (CAD)\n• Aortic Stenosis\n• Hypertrophic Cardiomyopathy' : ''}
${healthAssessment.symptoms.includes('Shortness of Breath') ? '• Mitral Valve Disease\n• Heart Failure\n• Pulmonary Hypertension' : ''}
${healthAssessment.symptoms.includes('Palpitations') ? '• Atrial Fibrillation\n• Mitral Valve Prolapse\n• Arrhythmogenic Cardiomyopathy' : ''}
${healthAssessment.symptoms.includes('Syncope (Fainting)') ? '• Aortic Stenosis\n• Hypertrophic Cardiomyopathy\n• Heart Block' : ''}

Primary conditions to rule out:
• Structural heart abnormalities
• Valvular heart disease
• Cardiomyopathies
• Congenital heart defects (if applicable)

💬 WHAT TO TELL YOUR DOCTOR
When you visit your healthcare provider, mention:

Symptoms: "${healthAssessment.symptoms.join(', ') || 'No specific symptoms reported'}"
Risk Factors: "${healthAssessment.riskFactors.join(', ') || 'No major risk factors identified'}"

Key phrases to use:
• "I completed a Wellness AI screening with a risk score of ${riskScore}/10"
• "I'm concerned about my health based on my symptoms"
• "I would like a comprehensive health evaluation"

🏥 RECOMMENDED SPECIALISTS & HOSPITALS
Based on your location:

Tier 1 Cardiac Centers:
• Regional Cardiovascular Institute
• Heart & Vascular Specialty Clinic
• Advanced Cardiac Care Center

Services to look for:
• Structural Heart Disease Program
• Non-invasive Cardiology
• Interventional Cardiology
• Cardiac Surgery (if needed)

🌍 ALTERNATIVE SCREENING FOR RURAL/LOW-RESOURCE SETTINGS
If specialist access is limited:

1. Telemedicine Cardiology Consultations
2. Mobile cardiac screening units
3. Community health center ECG programs
4. Pharmacy-based blood pressure monitoring
5. Remote patient monitoring devices

Basic tests available in most settings:
• ECG at local clinic
• Basic echocardiogram
• Blood pressure monitoring
• Basic blood work

🚩 RED FLAGS & CONTINUOUS CARE ADVICE

SEEK EMERGENCY CARE IMMEDIATELY if you experience:
• Severe chest pain or pressure
• Difficulty breathing at rest
• Loss of consciousness or fainting
• Rapid or irregular heartbeat with symptoms
• Severe swelling in legs/ankles
• Blue lips or fingernails

Lifestyle Recommendations:
• Monitor blood pressure regularly
• Follow a balanced diet
• Regular exercise as tolerated
• Medication compliance (if applicable)
• Avoid smoking and excessive alcohol
• Stress management techniques

Follow-up Schedule:
• ${urgencyLevel === 'URGENT' ? 'Healthcare provider consultation within 24-48 hours' : 
    urgencyLevel === 'MODERATE' ? 'Healthcare provider consultation within 2-4 weeks' :
    'Annual health screening'}
• Blood pressure monitoring: Weekly
• Symptom tracking: Daily

👨‍⚕️ CLINICAL SUMMARY (For Healthcare Providers)

Patient: ${personalInfo.full_name}, ${personalInfo.age}y ${personalInfo.gender}
AI Wellness Risk Score: ${riskScore}/10 (${urgencyLevel} priority)

Current Status:
• BP: ${healthAssessment.vitals.systolicBP}/${healthAssessment.vitals.diastolicBP} mmHg
• HR: ${healthAssessment.vitals.heartRate} BPM
• SpO2: ${healthAssessment.vitals.spO2}%
• Temperature: ${healthAssessment.vitals.temperature}°F
• Symptoms: ${healthAssessment.symptoms.join(', ') || 'None reported'}
• Risk Factors: ${healthAssessment.riskFactors.join(', ') || 'None identified'}

Medical History:
• Allergies: ${personalInfo.allergies}
• Current Medications: ${personalInfo.current_medications}
• Medical History: ${personalInfo.medical_history}

Recommendations:
1. ${urgencyLevel === 'URGENT' ? 'STAT' : urgencyLevel === 'MODERATE' ? 'Urgent' : 'Routine'} healthcare provider appointment
2. Complete vital signs assessment
3. Consider additional diagnostic testing as clinically indicated
4. Follow-up based on urgency level

---

⚠️ MEDICAL DISCLAIMER
This AI Wellness report is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. It is designed to assist in identifying potential cardiac concerns that warrant professional medical evaluation. Always consult with qualified healthcare professionals for proper medical assessment and treatment decisions.

Generated: ${new Date().toLocaleDateString()} | AI Wellness v2.0
Report ID: ${Date.now().toString(36).toUpperCase()}`;

      setReport(generatedReport);
      setLoading(false);
    }, 3000); // 3 second delay to simulate AI processing
  };

  const downloadReport = () => {
    if (!report || !personalInfo) return;

    const reportContent = `AI Wellness Screening Report
Health Assessment Analysis

Patient Information:
Name: ${personalInfo.full_name}
Age: ${personalInfo.age} years
Gender: ${personalInfo.gender}
Date: ${new Date().toLocaleDateString()}

${report}

Generated by AI Wellness
${new Date().toLocaleDateString()}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.full_name.replace(/\s+/g, '_')}_Health_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePDFReport = async () => {
    if (!report || !personalInfo) return;

    setLoading(true);

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
      doc.text("Health Assessment Report", margin, 35);

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

      // Patient Information Section
      addSection("Patient Information");
      addFieldRow("Full Name", personalInfo.full_name);
      addFieldRow("Age", personalInfo.age + " years");
      addFieldRow("Gender", personalInfo.gender.charAt(0).toUpperCase() + personalInfo.gender.slice(1));

      yPosition += 5;

      // Health Assessment Section
      addSection("Health Assessment");
      addFieldRow("Symptoms", healthAssessment.symptoms.length > 0 ? healthAssessment.symptoms.join(", ") : "None");
      addFieldRow("Risk Factors", healthAssessment.riskFactors.length > 0 ? healthAssessment.riskFactors.join(", ") : "None");

      yPosition += 5;

      // Vital Signs Section
      addSection("Vital Signs");
      addFieldRow("Blood Pressure", `${healthAssessment.vitals.systolicBP}/${healthAssessment.vitals.diastolicBP} mmHg`);
      addFieldRow("Heart Rate", `${healthAssessment.vitals.heartRate} BPM`);
      addFieldRow("Oxygen Saturation", `${healthAssessment.vitals.spO2}%`);
      addFieldRow("Temperature", `${healthAssessment.vitals.temperature}°F`);

      yPosition += 5;

      // Medical History Section
      addSection("Medical History");
      addFieldRow("Medical History", personalInfo.medical_history);
      addFieldRow("Current Medications", personalInfo.current_medications);
      addFieldRow("Allergies", personalInfo.allergies);

      yPosition += 5;

      // Risk Score Section
      const riskScore = calculateRiskScore();
      addSection("Risk Assessment");
      let riskLevel = "";
      if (riskScore >= 7) {
        riskLevel = "URGENT - Immediate consultation recommended";
      } else if (riskScore >= 4) {
        riskLevel = "MODERATE - Consultation recommended within 2-4 weeks";
      } else {
        riskLevel = "LOW - Annual screening recommended";
      }
      addFieldRow("Risk Score", `${riskScore}/10 - ${riskLevel}`);

      yPosition += 10;

      // Footer with borders
      doc.setDrawColor(30, 58, 138);
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, pageHeight - 18);
      doc.text("This document is confidential and for authorized healthcare professionals only.", margin, pageHeight - 12);
      doc.text("AI Wellness - Health Assessment System | www.aiwellness.com", margin, pageHeight - 6);

      // Save health data to Supabase health_data table
      const { error: saveError } = await supabase
        .from('health_data')
        .insert([{
          user_id: personalInfo.full_name,
          blood_pressure: `${healthAssessment.vitals.systolicBP}/${healthAssessment.vitals.diastolicBP}`,
          heart_rate: healthAssessment.vitals.heartRate,
          blood_glucose: 0, // Placeholder - not collected in form
          cholesterol: 0 // Placeholder - not collected in form
        }]);

      if (saveError) {
        console.error('Error saving health data:', saveError);
        throw new Error('Failed to save health data: ' + saveError.message);
      }

      console.log('Health data saved successfully to database');

      // Generate filename with patient folder
      const patientFolderName = personalInfo.full_name.replace(/\s+/g, "_");
      const fileName = `${patientFolderName}_health_report_${new Date().toISOString().split('T')[0]}.pdf`;
      const fullPath = `${patientFolderName}/${fileName}`;

      // Convert PDF to base64 for server upload
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Upload to server endpoint
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
      console.log('Health report uploaded successfully:', uploadResult);
      alert("Health report generated and stored successfully!");

      // Download the PDF to user's computer
      doc.save(fileName);

      // Reset the form after successful download and upload
      setHealthAssessment({
        symptoms: [],
        riskFactors: [],
        vitals: {
          systolicBP: 0,
          diastolicBP: 0,
          heartRate: 0,
          spO2: 0,
          temperature: 0
        }
      });
      setReport('');

    } catch (error: any) {
      console.error('Error generating/uploading health report:', error);
      alert('Error uploading health report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPersonalInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your personal information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span>{error}</span>
                  <Button
                    onClick={fetchPersonalInfo}
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patient Info Summary */}
          {personalInfo && (
            <Card className="mb-6 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                  <Button
                    onClick={() => setShowPersonalInfoForm(!showPersonalInfoForm)}
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    {showPersonalInfoForm ? 'Hide' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showPersonalInfoForm ? (
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div><strong>Name:</strong> {personalInfo.full_name}</div>
                    <div><strong>Age:</strong> {personalInfo.age} years</div>
                    <div><strong>Gender:</strong> {personalInfo.gender}</div>
                    <div className="md:col-span-3"><strong>Medical History:</strong> {personalInfo.medical_history}</div>
                    <div className="md:col-span-3"><strong>Current Medications:</strong> {personalInfo.current_medications}</div>
                    <div className="md:col-span-3"><strong>Allergies:</strong> {personalInfo.allergies}</div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={personalInfo.full_name}
                        onChange={(e) => updatePersonalInfo('full_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={personalInfo.age}
                        onChange={(e) => updatePersonalInfo('age', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        value={personalInfo.gender}
                        onChange={(e) => updatePersonalInfo('gender', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="medicalHistory">Medical History</Label>
                      <Textarea
                        id="medicalHistory"
                        value={personalInfo.medical_history}
                        onChange={(e) => updatePersonalInfo('medical_history', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea
                        id="medications"
                        value={personalInfo.current_medications}
                        onChange={(e) => updatePersonalInfo('current_medications', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea
                        id="allergies"
                        value={personalInfo.allergies}
                        onChange={(e) => updatePersonalInfo('allergies', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Health Assessment Form */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Health Assessment
                </CardTitle>
                <CardDescription>
                  Complete your health assessment to generate your cardiac screening report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Vital Signs */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                      <Input
                        id="systolicBP"
                        type="number"
                        placeholder="120"
                        onChange={(e) => handleVitalChange('systolicBP', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
                      <Input
                        id="diastolicBP"
                        type="number"
                        placeholder="80"
                        onChange={(e) => handleVitalChange('diastolicBP', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                      <Input
                        id="heartRate"
                        type="number"
                        placeholder="72"
                        onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="spO2">SpO2 (%)</Label>
                      <Input
                        id="spO2"
                        type="number"
                        placeholder="98"
                        onChange={(e) => handleVitalChange('spO2', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        placeholder="98.6"
                        step="0.1"
                        onChange={(e) => handleVitalChange('temperature', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <h3 className="font-semibold mb-3">Current Symptoms</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {symptomOptions.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          onCheckedChange={(checked) => 
                            handleSymptomChange(symptom, checked as boolean)
                          }
                        />
                        <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h3 className="font-semibold mb-3">Risk Factors</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {riskFactorOptions.map((factor) => (
                      <div key={factor} className="flex items-center space-x-2">
                        <Checkbox
                          id={factor}
                          onCheckedChange={(checked) => 
                            handleRiskFactorChange(factor, checked as boolean)
                          }
                        />
                        <Label htmlFor={factor} className="text-sm">{factor}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Report Button */}
                <Button
                  onClick={generateReport}
                  disabled={loading || !personalInfo}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Wellness Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Report Display */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  WellnessAI Screening Report
                </CardTitle>
                <CardDescription>
                  Structural Heart Disease Analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyzing your health data...</p>
                    <p className="text-sm text-gray-500 mt-2">Generating personalized recommendations...</p>
                  </div>
                )}
                
                {report && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="text-center mb-4 pb-4 border-b border-gray-200">
                        <h3 className="font-bold text-lg text-gray-800">WellnessAI Screening Report</h3>
                        <p className="text-sm text-gray-600">Structural Heart Disease Analysis</p>
                        <p className="text-xs text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
                        <p className="text-xs text-red-600 font-semibold mt-2">
                          ⚠️ This is a clinical assistance tool and not a substitute for professional medical diagnosis.
                        </p>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                          {report}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={downloadReport}
                        className="flex-1"
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download TXT
                      </Button>
                      <Button
                        onClick={generatePDFReport}
                        disabled={loading}
                        className="flex-1"
                        variant="outline"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {!report && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Complete the health assessment and click "Generate WellnessAI Report" to see your personalized analysis.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Health;