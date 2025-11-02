---

# 🧠 AI Wellness WebApp
<img width="1647" height="823" alt="image" src="https://github.com/user-attachments/assets/d7a31a68-dfb2-43ca-80b5-69dc7afe72ba" />

### 📋 Overview

The **AI Wellness WebApp** is a full-stack health assistant platform designed to simplify the process of medical data recording and reporting. Users fill out a detailed health form, and their data is securely stored in **Supabase**. The same data is then processed using the **Gemini API**, which helps structure and format the information into a **PDF report**. This report enables doctors to quickly understand a patient’s condition and prepare for consultation more effectively.

---

### 🚀 Features

* 🩺 **Smart Health Data Form:** Collects user symptoms, history, and lifestyle details through an easy-to-use form.
* 💾 **Supabase Storage:** Securely stores patient data in a cloud-based PostgreSQL database.
* 🤖 **AI-Powered Report Structuring:** Uses the **Gemini API** to intelligently format user data into a professional medical report.
* 📄 **Automated PDF Generation:** Creates downloadable PDF summaries for doctors.
* 📱 **Responsive Design:** Built with React and Tailwind CSS for seamless performance on all devices.

---
<img width="1527" height="769" alt="image" src="https://github.com/user-attachments/assets/4b86e06c-6e2a-4c1d-8cea-3ff720b6a73d" />

### 🧰 Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** Supabase (PostgreSQL)
* **AI API:** Gemini API (Google Generative AI)
* **Utilities:** jsPDF (or equivalent) for PDF generation

---

### 🏗️ How It Works

1. **User Input:** The user fills out the health assessment form.
2. **Data Storage:** Form responses are securely saved in Supabase.
3. **AI Processing:** The Gemini API analyzes and structures the input data to create a meaningful medical summary.
4. **Report Generation:** The structured content is exported as a downloadable PDF report for doctors.

---

### ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Shreyans-704/AI-Wellness-Health-Website.git

# Move into the project directory
cd AI-Wellness-Health-Website

# Install all dependencies
npm install

# Create a .env file and add the following:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
VITE_GEMINI_API_KEY=your_gemini_api_key

# Run the app
npm run dev
```

---
<img width="1625" height="861" alt="image" src="https://github.com/user-attachments/assets/0f3e5bbc-62f3-498e-9654-6519415eef2e" />


### 🧑‍💻 Usage

1. Launch the app and fill out the wellness form.
2. Submit your health details — they’ll be saved securely in Supabase.
3. The Gemini API will process your data and structure it into a readable report format.
4. Click **“Generate PDF”** to download your personalized report for your doctor.

---

### 📈 Future Improvements

* Integration of a **chatbot assistant** for real-time symptom discussion.
* Enhanced **doctor-side dashboard** to manage multiple patient reports.
* Support for **multi-language reports** and better PDF templates.


