import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        ok: 'OK',
        yes: 'Yes',
        no: 'No',
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
      },
      
      // Navigation
      navigation: {
        home: 'Home',
        vitals: 'Vitals',
        reminders: 'Reminders',
        healthWorkers: 'Health Workers',
        profile: 'Profile',
      },
      
      // Home Screen
      home: {
        welcome: 'Welcome to Aarogya Sahayak',
        subtitle: 'Your Health Companion',
        quickActions: 'Quick Actions',
        logVitals: 'Log Vitals',
        setReminder: 'Set Reminder',
        findWorker: 'Find Health Worker',
        healthTips: 'Health Tips',
        recentActivity: 'Recent Activity',
      },
      
      // Vitals
      vitals: {
        title: 'Health Vitals',
        bloodPressure: 'Blood Pressure',
        bloodSugar: 'Blood Sugar',
        weight: 'Weight',
        temperature: 'Temperature',
        heartRate: 'Heart Rate',
        systolic: 'Systolic',
        diastolic: 'Diastolic',
        fasting: 'Fasting',
        postMeal: 'Post Meal',
        unit: {
          mmhg: 'mmHg',
          mgdl: 'mg/dL',
          kg: 'kg',
          celsius: '°C',
          bpm: 'bpm',
        },
        addReading: 'Add Reading',
        viewHistory: 'View History',
        normal: 'Normal',
        high: 'High',
        low: 'Low',
        critical: 'Critical',
      },
      
      // Reminders
      reminders: {
        title: 'Reminders',
        medication: 'Medication',
        appointment: 'Appointment',
        checkup: 'Health Checkup',
        exercise: 'Exercise',
        addReminder: 'Add Reminder',
        editReminder: 'Edit Reminder',
        reminderType: 'Reminder Type',
        title: 'Title',
        description: 'Description',
        date: 'Date',
        time: 'Time',
        repeat: 'Repeat',
        frequency: {
          once: 'Once',
          daily: 'Daily',
          weekly: 'Weekly',
          monthly: 'Monthly',
        },
        status: {
          active: 'Active',
          completed: 'Completed',
          missed: 'Missed',
        },
      },
      
      // Health Workers
      healthWorkers: {
        title: 'Health Workers',
        asha: 'ASHA Worker',
        volunteer: 'Community Volunteer',
        doctor: 'Doctor',
        nurse: 'Nurse',
        searchWorkers: 'Search Health Workers',
        nearby: 'Nearby Workers',
        available: 'Available',
        busy: 'Busy',
        offline: 'Offline',
        contact: 'Contact',
        call: 'Call',
        message: 'Message',
        rating: 'Rating',
        experience: 'Experience',
        specialization: 'Specialization',
        languages: 'Languages',
        distance: 'Distance',
      },
      
      // Profile
      profile: {
        title: 'Profile',
        personalInfo: 'Personal Information',
        healthInfo: 'Health Information',
        settings: 'Settings',
        language: 'Language',
        notifications: 'Notifications',
        privacy: 'Privacy',
        about: 'About',
        logout: 'Logout',
        name: 'Name',
        age: 'Age',
        gender: 'Gender',
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        emergencyContact: 'Emergency Contact',
        medicalConditions: 'Medical Conditions',
        medications: 'Current Medications',
        allergies: 'Allergies',
        bloodGroup: 'Blood Group',
      },
      
      // Health Tips
      healthTips: {
        title: 'Health Tips',
        diabetes: 'Diabetes Management',
        hypertension: 'Blood Pressure Control',
        diet: 'Healthy Diet',
        exercise: 'Physical Activity',
        lifestyle: 'Lifestyle Changes',
        readMore: 'Read More',
        share: 'Share',
      },
    },
  },
  
  hi: {
    translation: {
      // Common
      common: {
        save: 'सेव करें',
        cancel: 'रद्द करें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        add: 'जोड़ें',
        search: 'खोजें',
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता',
        ok: 'ठीक है',
        yes: 'हाँ',
        no: 'नहीं',
        today: 'आज',
        yesterday: 'कल',
        tomorrow: 'कल',
      },
      
      // Navigation
      navigation: {
        home: 'होम',
        vitals: 'स्वास्थ्य माप',
        reminders: 'याददाश्त',
        healthWorkers: 'स्वास्थ्य कर्मी',
        profile: 'प्रोफ़ाइल',
      },
      
      // Home Screen
      home: {
        welcome: 'आरोग्य सहायक में आपका स्वागत है',
        subtitle: 'आपका स्वास्थ्य साथी',
        quickActions: 'त्वरित कार्य',
        logVitals: 'स्वास्थ्य माप दर्ज करें',
        setReminder: 'याददाश्त सेट करें',
        findWorker: 'स्वास्थ्य कर्मी खोजें',
        healthTips: 'स्वास्थ्य सुझाव',
        recentActivity: 'हाल की गतिविधि',
      },
      
      // Vitals
      vitals: {
        title: 'स्वास्थ्य माप',
        bloodPressure: 'रक्तचाप',
        bloodSugar: 'रक्त शर्करा',
        weight: 'वजन',
        temperature: 'तापमान',
        heartRate: 'हृदय गति',
        systolic: 'सिस्टोलिक',
        diastolic: 'डायस्टोलिक',
        fasting: 'उपवास',
        postMeal: 'भोजन के बाद',
        unit: {
          mmhg: 'mmHg',
          mgdl: 'mg/dL',
          kg: 'किलो',
          celsius: '°C',
          bpm: 'bpm',
        },
        addReading: 'माप जोड़ें',
        viewHistory: 'इतिहास देखें',
        normal: 'सामान्य',
        high: 'उच्च',
        low: 'निम्न',
        critical: 'गंभीर',
      },
      
      // Reminders
      reminders: {
        title: 'याददाश्त',
        medication: 'दवाई',
        appointment: 'अपॉइंटमेंट',
        checkup: 'स्वास्थ्य जांच',
        exercise: 'व्यायाम',
        addReminder: 'याददाश्त जोड़ें',
        editReminder: 'याददाश्त संपादित करें',
        reminderType: 'याददाश्त प्रकार',
        title: 'शीर्षक',
        description: 'विवरण',
        date: 'तारीख',
        time: 'समय',
        repeat: 'दोहराएं',
        frequency: {
          once: 'एक बार',
          daily: 'दैनिक',
          weekly: 'साप्ताहिक',
          monthly: 'मासिक',
        },
        status: {
          active: 'सक्रिय',
          completed: 'पूर्ण',
          missed: 'छूट गया',
        },
      },
      
      // Health Workers
      healthWorkers: {
        title: 'स्वास्थ्य कर्मी',
        asha: 'आशा कर्मी',
        volunteer: 'सामुदायिक स्वयंसेवक',
        doctor: 'डॉक्टर',
        nurse: 'नर्स',
        searchWorkers: 'स्वास्थ्य कर्मी खोजें',
        nearby: 'पास के कर्मी',
        available: 'उपलब्ध',
        busy: 'व्यस्त',
        offline: 'ऑफलाइन',
        contact: 'संपर्क',
        call: 'कॉल करें',
        message: 'संदेश',
        rating: 'रेटिंग',
        experience: 'अनुभव',
        specialization: 'विशेषज्ञता',
        languages: 'भाषाएं',
        distance: 'दूरी',
      },
      
      // Profile
      profile: {
        title: 'प्रोफ़ाइल',
        personalInfo: 'व्यक्तिगत जानकारी',
        healthInfo: 'स्वास्थ्य जानकारी',
        settings: 'सेटिंग्स',
        language: 'भाषा',
        notifications: 'सूचनाएं',
        privacy: 'गोपनीयता',
        about: 'के बारे में',
        logout: 'लॉग आउट',
        name: 'नाम',
        age: 'आयु',
        gender: 'लिंग',
        phone: 'फोन',
        email: 'ईमेल',
        address: 'पता',
        emergencyContact: 'आपातकालीन संपर्क',
        medicalConditions: 'चिकित्सा स्थितियां',
        medications: 'वर्तमान दवाएं',
        allergies: 'एलर्जी',
        bloodGroup: 'रक्त समूह',
      },
      
      // Health Tips
      healthTips: {
        title: 'स्वास्थ्य सुझाव',
        diabetes: 'मधुमेह प्रबंधन',
        hypertension: 'रक्तचाप नियंत्रण',
        diet: 'स्वस्थ आहार',
        exercise: 'शारीरिक गतिविधि',
        lifestyle: 'जीवनशैली परिवर्तन',
        readMore: 'और पढ़ें',
        share: 'साझा करें',
      },
    },
  },
  
  // Telugu
  te: {
    translation: {
      common: {
        save: 'సేవ్ చేయండి',
        cancel: 'రద్దు చేయండి',
        delete: 'తొలగించండి',
        edit: 'సవరించండి',
        add: 'జోడించండి',
        search: 'వెతకండి',
        loading: 'లోడ్ అవుతోంది...',
        error: 'లోపం',
        success: 'విజయం',
        ok: 'సరే',
        yes: 'అవును',
        no: 'కాదు',
        today: 'ఈరోజు',
        yesterday: 'నిన్న',
        tomorrow: 'రేపు',
      },
      auth: {
        selectRole: 'మీ పాత్రను ఎంచుకోండి',
        patient: 'రోగి',
        healthWorker: 'ఆరోగ్య కార్యకర్త',
        createProfile: 'ప్రొఫైల్ సృష్టించండి',
      },
    },
  },
  // Tamil
  ta: {
    translation: {
      common: {
        save: 'சேமி',
        cancel: 'ரத்து செய்',
        delete: 'நீக்கு',
        edit: 'திருத்து',
        add: 'சேர்',
        search: 'தேடு',
        loading: 'ஏற்றுகிறது...',
        error: 'பிழை',
        success: 'வெற்றி',
        ok: 'சரி',
        yes: 'ஆம்',
        no: 'இல்லை',
        today: 'இன்று',
        yesterday: 'நேற்று',
        tomorrow: 'நாளை',
      },
      auth: {
        selectRole: 'உங்கள் பாத்திரத்தை தேர்ந்தெடுக்கவும்',
        patient: 'நோயாளி',
        healthWorker: 'ஆரோக்கிய பணியாளர்',
        createProfile: 'சுயவிவரம் உருவாக்கு',
      },
    },
  },
  // Bengali
  bn: {
    translation: {
      common: {
        save: 'সংরক্ষণ',
        cancel: 'বাতিল',
        delete: 'মুছে ফেলুন',
        edit: 'সম্পাদনা',
        add: 'যোগ করুন',
        search: 'অনুসন্ধান',
        loading: 'লোড হচ্ছে...',
        error: 'ত্রুটি',
        success: 'সফল',
        ok: 'ঠিক আছে',
        yes: 'হ্যাঁ',
        no: 'না',
        today: 'আজ',
        yesterday: 'গতকাল',
        tomorrow: 'আগামীকাল',
      },
      auth: {
        selectRole: 'আপনার ভূমিকা নির্বাচন করুন',
        patient: 'রোগী',
        healthWorker: 'স্বাস্থ্য কর্মী',
        createProfile: 'প্রোফাইল তৈরি করুন',
      },
    },
  },
  // Marathi
  mr: {
    translation: {
      common: {
        save: 'जतन करा',
        cancel: 'रद्द करा',
        delete: 'हटवा',
        edit: 'संपादित करा',
        add: 'जोडा',
        search: 'शोधा',
        loading: 'लोड होत आहे...',
        error: 'त्रुटी',
        success: 'यशस्वी',
        ok: 'ठीक आहे',
        yes: 'होय',
        no: 'नाही',
        today: 'आज',
        yesterday: 'काल',
        tomorrow: 'उद्या',
      },
      auth: {
        selectRole: 'आपली भूमिका निवडा',
        patient: 'रुग्ण',
        healthWorker: 'आरोग्य कर्मचारी',
        createProfile: 'प्रोफाइल तयार करा',
      },
    },
  },
  // Gujarati
  gu: {
    translation: {
      common: {
        save: 'સેવ કરો',
        cancel: 'રદ કરો',
        delete: 'ડિલીટ કરો',
        edit: 'એડિટ કરો',
        add: 'ઉમેરો',
        search: 'શોધો',
        loading: 'લોડ થઈ રહ્યું છે...',
        error: 'ભૂલ',
        success: 'સફળ',
        ok: 'બરાબર',
        yes: 'હા',
        no: 'ના',
        today: 'આજે',
        yesterday: 'ગઈકાલે',
        tomorrow: 'કાલે',
      },
      auth: {
        selectRole: 'તમારી ભૂમિકા પસંદ કરો',
        patient: 'રોગી',
        healthWorker: 'આરોગ્ય કાર્યકર',
        createProfile: 'પ્રોફાઇલ બનાવો',
      },
    },
  },
  // Kannada
  kn: {
    translation: {
      common: {
        save: 'ಉಳಿಸಿ',
        cancel: 'ರದ್ದುಗೊಳಿಸಿ',
        delete: 'ಅಳಿಸಿ',
        edit: 'ಸಂಪಾದಿಸಿ',
        add: 'ಸೇರಿಸಿ',
        search: 'ಹುಡುಕಿ',
        loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        error: 'ದೋಷ',
        success: 'ಯಶಸ್ಸು',
        ok: 'ಸರಿ',
        yes: 'ಹೌದು',
        no: 'ಇಲ್ಲ',
        today: 'ಇಂದು',
        yesterday: 'ನಿನ್ನೆ',
        tomorrow: 'ನಾಳೆ',
      },
      auth: {
        selectRole: 'ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        patient: 'ರೋಗಿ',
        healthWorker: 'ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ',
        createProfile: 'ಪ್ರೊಫೈಲ್ ರಚಿಸಿ',
      },
    },
  },
  // Malayalam
  ml: {
    translation: {
      common: {
        save: 'സേവ് ചെയ്യുക',
        cancel: 'റദ്ദാക്കുക',
        delete: 'ഡിലീറ്റ് ചെയ്യുക',
        edit: 'എഡിറ്റ് ചെയ്യുക',
        add: 'ചേർക്കുക',
        search: 'തിരയുക',
        loading: 'ലോഡ് ചെയ്യുന്നു...',
        error: 'പിശക്',
        success: 'വിജയം',
        ok: 'ശരി',
        yes: 'അതെ',
        no: 'അല്ല',
        today: 'ഇന്ന്',
        yesterday: 'ഇന്നലെ',
        tomorrow: 'നാളെ',
      },
      auth: {
        selectRole: 'നിങ്ങളുടെ പങ്ക് തിരഞ്ഞെടുക്കുക',
        patient: 'രോഗി',
        healthWorker: 'ആരോഗ്യ പ്രവർത്തകൻ',
        createProfile: 'പ്രൊഫൈൽ സൃഷ്ടിക്കുക',
      },
    },
  },
  // Punjabi
  pa: {
    translation: {
      common: {
        save: 'ਸੇਵ ਕਰੋ',
        cancel: 'ਰੱਦ ਕਰੋ',
        delete: 'ਮਿਟਾਓ',
        edit: 'ਸੰਪਾਦਨ ਕਰੋ',
        add: 'ਜੋੜੋ',
        search: 'ਖੋਜੋ',
        loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
        error: 'ਗਲਤੀ',
        success: 'ਸਫਲ',
        ok: 'ਠੀਕ ਹੈ',
        yes: 'ਹਾਂ',
        no: 'ਨਹੀਂ',
        today: 'ਅੱਜ',
        yesterday: 'ਕੱਲ੍ਹ',
        tomorrow: 'ਕੱਲ੍ਹ',
      },
      auth: {
        selectRole: 'ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ',
        patient: 'ਮਰੀਜ਼',
        healthWorker: 'ਸਿਹਤ ਕਰਮਚਾਰੀ',
        createProfile: 'ਪ੍ਰੋਫਾਈਲ ਬਣਾਓ',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale?.split('-')[0] || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
