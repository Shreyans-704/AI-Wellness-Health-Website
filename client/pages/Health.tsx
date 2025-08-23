import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Heart, AlertTriangle, Download, User, Activity, Menu, X, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import jsPDF from "jspdf";
import { supabase } from '@/lib/supabase';

interface PersonalInfo {
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  bmi: number;
  blood_group: string;
  allergies: string;
  current_medications: string;
  medical_history: string;
  phone: string;
  email: string;
  insurance_provider: string;
  policy_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
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
  additionalSymptoms: string;
  familyHistory: string;
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
    },
    additionalSymptoms: '',
    familyHistory: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);

  // Symptom options
  const symptomOptions = [
    'Chest Pain',
    'Shortness of Breath',
    'Palpitations',
    'Fatigue',
    'Dizziness',
    'Syncope (Fainting)',
    'Cyanosis (Blue lips/skin)',
    'Nausea',
    'Sweating',
    'Irregular Heartbeat',
    'Swelling in legs/ankles',
    'Rapid breathing'
  ];

  // Risk factor options
  const riskFactorOptions = [
    'Smoking',
    'Alcohol Use',
    'Diabetes',
    'Hypertension',
    'Family History of Heart Disease',
    'High Cholesterol',
    'Sedentary Lifestyle',
    'Obesity',
    'Stress',
    'Previous Heart Attack'
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
          first_name: personalData.first_name,
          last_name: personalData.last_name,
          age: personalData.age,
          gender: personalData.gender,
          height_cm: personalData.height_cm,
          weight_kg: personalData.weight_kg,
          bmi: personalData.bmi,
          blood_group: personalData.blood_group,
          allergies: personalData.allergies,
          current_medications: personalData.current_medications,
          medical_history: personalData.medical_history,
          phone: personalData.phone,
          email: personalData.email,
          insurance_provider: personalData.insurance_provider,
          policy_number: personalData.policy_number,
          emergency_contact_name: personalData.emergency_contact_name,
          emergency_contact_phone: personalData.emergency_contact_phone
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
      
      // Recalculate BMI if height or weight changes
      if (field === 'height_cm' || field === 'weight_kg') {
        const height = field === 'height_cm' ? Number(value) : personalInfo.height_cm;
        const weight = field === 'weight_kg' ? Number(value) : personalInfo.weight_kg;
        updatedInfo.bmi = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));
      }
      
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
    
    // BMI factor
    if (personalInfo?.bmi && personalInfo.bmi > 30) score += 2;
    else if (personalInfo?.bmi && personalInfo.bmi > 25) score += 1;
    
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
      const bmiCategory = personalInfo.bmi < 18.5 ? 'Underweight' : 
                         personalInfo.bmi < 25 ? 'Normal weight' : 
                         personalInfo.bmi < 30 ? 'Overweight' : 'Obese';

      // Determine urgency level
      let urgencyLevel = 'LOW';
      let urgencyReasoning = 'Based on current assessment, routine follow-up is recommended.';
      
      if (riskScore >= 7) {
        urgencyLevel = 'URGENT';
        urgencyReasoning = 'High-risk symptoms and factors present. Immediate cardiology consultation recommended.';
      } else if (riskScore >= 4) {
        urgencyLevel = 'MODERATE';
        urgencyReasoning = 'Several risk factors identified. Cardiology consultation within 2-4 weeks recommended.';
      }

      // Generate comprehensive report
      const generatedReport = `
📋 PRELIMINARY SHD ASSESSMENT
Dear ${personalInfo.first_name} ${personalInfo.last_name},

Thank you for completing your Wellness AI Structural Heart Disease screening. This preliminary assessment is designed to help identify potential cardiac concerns that may benefit from further evaluation by a cardiologist.

👤 PATIENT INFORMATION SUMMARY
• Name: ${personalInfo.first_name} ${personalInfo.last_name}
• Age: ${personalInfo.age} years (${personalInfo.age < 18 ? 'Pediatric' : personalInfo.age < 65 ? 'Adult' : 'Senior'} category)
• Gender: ${personalInfo.gender}
• Physical Profile: ${personalInfo.height_cm} cm, ${personalInfo.weight_kg} kg (BMI: ${personalInfo.bmi} - ${bmiCategory})
• Blood Type: ${personalInfo.blood_group}
• Contact: ${personalInfo.phone}
• Insurance: ${personalInfo.insurance_provider} (Policy: ${personalInfo.policy_number})
• Emergency Contact: ${personalInfo.emergency_contact_name} (${personalInfo.emergency_contact_phone})

🎯 ESTIMATED RISK SCORE FOR STRUCTURAL HEART DISEASE
Risk Score: ${riskScore}/10

Risk Factors Contributing to Score:
${personalInfo.age > 65 ? '• Age factor: Senior category (+2 points)' : personalInfo.age > 50 ? '• Age factor: Middle-age category (+1 point)' : '• Age factor: Low risk'}
${personalInfo.bmi > 30 ? '• BMI factor: Obesity category (+2 points)' : personalInfo.bmi > 25 ? '• BMI factor: Overweight category (+1 point)' : '• BMI factor: Normal range'}
${healthAssessment.symptoms.filter(s => ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Syncope (Fainting)'].includes(s)).length > 0 ? 
  `• High-risk symptoms present: ${healthAssessment.symptoms.filter(s => ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Syncope (Fainting)'].includes(s)).join(', ')} (+${healthAssessment.symptoms.filter(s => ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Syncope (Fainting)'].includes(s)).length * 2} points)` : 
  '• No high-risk symptoms identified'}
${healthAssessment.riskFactors.filter(f => ['Diabetes', 'Hypertension', 'Family History of Heart Disease', 'Smoking'].includes(f)).length > 0 ?
  `• Critical risk factors: ${healthAssessment.riskFactors.filter(f => ['Diabetes', 'Hypertension', 'Family History of Heart Disease', 'Smoking'].includes(f)).join(', ')} (+${healthAssessment.riskFactors.filter(f => ['Diabetes', 'Hypertension', 'Family History of Heart Disease', 'Smoking'].includes(f)).length} points)` :
  '• No critical risk factors identified'}

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
Additional Concerns: "${healthAssessment.additionalSymptoms || 'None reported'}"
Family History: "${healthAssessment.familyHistory || 'No family history of heart disease reported'}"

Key phrases to use:
• "I completed a Wellness AI screening with a risk score of ${riskScore}/10"
• "I'm concerned about structural heart disease based on my symptoms"
• "I would like a comprehensive cardiac evaluation including echocardiogram"

🏥 RECOMMENDED CARDIAC SPECIALISTS & HOSPITALS
Based on your location (${personalInfo.phone.substring(0, 5)} area):

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
• Maintain healthy weight (current BMI: ${personalInfo.bmi})
• Follow heart-healthy diet
• Regular exercise as tolerated
• Medication compliance
• Avoid smoking and excessive alcohol
• Stress management techniques

Follow-up Schedule:
• ${urgencyLevel === 'URGENT' ? 'Cardiologist within 24-48 hours' : 
    urgencyLevel === 'MODERATE' ? 'Cardiologist within 2-4 weeks' :
    'Annual cardiac screening'}
• Blood pressure monitoring: Weekly
• Symptom tracking: Daily

👨‍⚕️ DOCTOR'S SUMMARY (For Healthcare Providers)

Patient: ${personalInfo.first_name} ${personalInfo.last_name}, ${personalInfo.age}y ${personalInfo.gender}
WellnessAI Risk Score: ${riskScore}/10 (${urgencyLevel} priority)

Clinical Presentation:
• BMI: ${personalInfo.bmi} (${bmiCategory})
• BP: ${healthAssessment.vitals.systolicBP}/${healthAssessment.vitals.diastolicBP} mmHg
• HR: ${healthAssessment.vitals.heartRate} BPM
• SpO2: ${healthAssessment.vitals.spO2}%
• Symptoms: ${healthAssessment.symptoms.join(', ') || 'None'}
• Risk Factors: ${healthAssessment.riskFactors.join(', ') || 'None'}

Medical History:
• Allergies: ${personalInfo.allergies}
• Current Medications: ${personalInfo.current_medications}
• Past Medical History: ${personalInfo.medical_history}
• Family History: ${healthAssessment.familyHistory || 'Non-contributory'}

Recommendations:
1. ${urgencyLevel === 'URGENT' ? 'STAT' : urgencyLevel === 'MODERATE' ? 'Urgent' : 'Routine'} cardiology referral
2. Echocardiogram and ECG
3. Basic metabolic panel and CBC
4. Consider stress testing if indicated

Insurance: ${personalInfo.insurance_provider} (${personalInfo.policy_number})

---

⚠️ MEDICAL DISCLAIMER
This WellnessAI report is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. It is designed to assist in identifying potential cardiac concerns that warrant professional medical evaluation. Always consult with qualified healthcare professionals for proper medical assessment and treatment decisions.

Generated: ${new Date().toLocaleDateString()} | WellnessAI v2.0
Report ID: ${Date.now().toString(36).toUpperCase()}`;

      setReport(generatedReport);
      setLoading(false);
    }, 3000); // 3 second delay to simulate AI processing
  };

  const downloadReport = () => {
    if (!report || !personalInfo) return;

    const reportContent = `WellnessAI Screening Report
Structural Heart Disease Analysis

Patient Information:
Name: ${personalInfo.first_name} ${personalInfo.last_name}
Age: ${personalInfo.age} years
Gender: ${personalInfo.gender}
Date: ${new Date().toLocaleDateString()}

${report}

Generated by WellnessAI
${new Date().toLocaleDateString()}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.first_name}_${personalInfo.last_name}_SHD_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePDFReport = () => {
    if (!report || !personalInfo) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("WellnessAI - Health Screening Report", 20, 25);
    
    doc.setFontSize(14);
    doc.text("Structural Heart Disease Analysis", 20, 35);

    // Line under header
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    let yPosition = 50;
    const lineHeight = 6;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Helper function to add text with page breaks
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      
      const lines = doc.splitTextToSize(text, 170);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };

    // Patient Information
    addText("PATIENT INFORMATION", 12, true);
    yPosition += 3;
    addText(`Name: ${personalInfo.first_name} ${personalInfo.last_name}`);
    addText(`Age: ${personalInfo.age} years`);
    addText(`Gender: ${personalInfo.gender}`);
    addText(`BMI: ${personalInfo.bmi}`);
    addText(`Blood Group: ${personalInfo.blood_group}`);
    addText(`Contact: ${personalInfo.phone}`);
    addText(`Email: ${personalInfo.email}`);
    addText(`Insurance: ${personalInfo.insurance_provider} (${personalInfo.policy_number})`);

    yPosition += 5;

    // Risk Assessment
    const riskScore = calculateRiskScore();
    addText("RISK ASSESSMENT", 12, true);
    yPosition += 3;
    addText(`Risk Score: ${riskScore}/10`);
    
    if (healthAssessment.symptoms.length > 0) {
      addText(`Symptoms: ${healthAssessment.symptoms.join(', ')}`);
    }
    
    if (healthAssessment.riskFactors.length > 0) {
      addText(`Risk Factors: ${healthAssessment.riskFactors.join(', ')}`);
    }

    yPosition += 5;

    // Vital Signs
    addText("VITAL SIGNS", 12, true);
    yPosition += 3;
    addText(`Blood Pressure: ${healthAssessment.vitals.systolicBP}/${healthAssessment.vitals.diastolicBP} mmHg`);
    addText(`Heart Rate: ${healthAssessment.vitals.heartRate} BPM`);
    addText(`Oxygen Saturation: ${healthAssessment.vitals.spO2}%`);
    addText(`Temperature: ${healthAssessment.vitals.temperature}°F`);

    yPosition += 5;

    // Recommendations
    addText("RECOMMENDATIONS", 12, true);
    yPosition += 3;
    
    let urgencyLevel = 'LOW';
    if (riskScore >= 7) {
      urgencyLevel = 'URGENT';
      addText("URGENT: Immediate cardiology consultation recommended within 24 hours.", 11, true);
    } else if (riskScore >= 4) {
      urgencyLevel = 'MODERATE';
      addText("MODERATE: Schedule cardiology consultation within 2-4 weeks.", 11, true);
    } else {
      addText("LOW RISK: Annual cardiac screening recommended.", 11, true);
    }

    yPosition += 3;
    addText("Suggested Tests:");
    addText("• Electrocardiogram (ECG/EKG)");
    addText("• Echocardiogram");
    addText("• Chest X-ray");
    addText("• Complete Blood Count (CBC)");
    addText("• Comprehensive Metabolic Panel");
    addText("• Lipid Panel");

    yPosition += 5;

    // Medical History
    addText("MEDICAL INFORMATION", 12, true);
    yPosition += 3;
    addText(`Allergies: ${personalInfo.allergies}`);
    addText(`Current Medications: ${personalInfo.current_medications}`);
    addText(`Medical History: ${personalInfo.medical_history}`);
    
    if (healthAssessment.familyHistory) {
      addText(`Family History: ${healthAssessment.familyHistory}`);
    }

    yPosition += 10;

    // Disclaimer
    addText("MEDICAL DISCLAIMER", 12, true);
    yPosition += 3;
    addText("This WellnessAI report is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for proper medical assessment and treatment decisions.", 9);

    // Footer
    const finalPageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | WellnessAI v2.0`, 20, finalPageHeight - 15);
    doc.text(`Report ID: ${Date.now().toString(36).toUpperCase()}`, 20, finalPageHeight - 10);

    // Save the PDF
    const fileName = `${personalInfo.first_name}_${personalInfo.last_name}_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
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
                    <div><strong>Name:</strong> {personalInfo.first_name} {personalInfo.last_name}</div>
                    <div><strong>Age:</strong> {personalInfo.age} years</div>
                    <div><strong>Gender:</strong> {personalInfo.gender}</div>
                    <div><strong>Height:</strong> {personalInfo.height_cm} cm</div>
                    <div><strong>Weight:</strong> {personalInfo.weight_kg} kg</div>
                    <div><strong>BMI:</strong> {personalInfo.bmi}</div>
                    <div><strong>Blood Group:</strong> {personalInfo.blood_group}</div>
                    <div><strong>Phone:</strong> {personalInfo.phone}</div>
                    <div><strong>Insurance:</strong> {personalInfo.insurance_provider}</div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.first_name}
                        onChange={(e) => updatePersonalInfo('first_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.last_name}
                        onChange={(e) => updatePersonalInfo('last_name', e.target.value)}
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
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={personalInfo.height_cm}
                        onChange={(e) => updatePersonalInfo('height_cm', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={personalInfo.weight_kg}
                        onChange={(e) => updatePersonalInfo('weight_kg', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Input
                        id="bloodGroup"
                        value={personalInfo.blood_group}
                        onChange={(e) => updatePersonalInfo('blood_group', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea
                        id="allergies"
                        value={personalInfo.allergies}
                        onChange={(e) => updatePersonalInfo('allergies', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea
                        id="medications"
                        value={personalInfo.current_medications}
                        onChange={(e) => updatePersonalInfo('current_medications', e.target.value)}
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

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="additionalSymptoms">Additional Symptoms or Concerns</Label>
                    <Textarea
                      id="additionalSymptoms"
                      placeholder="Describe any other symptoms..."
                      value={healthAssessment.additionalSymptoms}
                      onChange={(e) => setHealthAssessment(prev => ({
                        ...prev,
                        additionalSymptoms: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="familyHistory">Family History of Heart Disease</Label>
                    <Textarea
                      id="familyHistory"
                      placeholder="Describe family history of cardiac conditions..."
                      value={healthAssessment.familyHistory}
                      onChange={(e) => setHealthAssessment(prev => ({
                        ...prev,
                        familyHistory: e.target.value
                      }))}
                    />
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
                      Generate WellnessAI Report
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
                        className="flex-1"
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
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
    </div>
  );
};

export default Health;