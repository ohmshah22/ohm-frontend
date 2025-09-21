import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const demoHealthWorkers = [
  {
    name: 'Priya Sharma',
    role: 'ASHA Worker',
    location: 'Sector 15, Gurgaon',
    rating: 4.8,
    experience: '5 years',
    languages: ['Hindi', 'English'],
    specialization: 'Diabetes Care',
    available: true,
    distance: '2.1 km',
    phone: '+91 98765 43210',
    email: 'priya.sharma@asha.gov.in',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Community Health Volunteer',
    location: 'Old City, Gurgaon',
    rating: 4.6,
    experience: '3 years',
    languages: ['Hindi', 'Punjabi'],
    specialization: 'Hypertension Management',
    available: true,
    distance: '3.5 km',
    phone: '+91 98765 43211',
    email: 'rajesh.kumar@health.gov.in',
  },
  {
    name: 'Sunita Devi',
    role: 'ASHA Worker',
    location: 'DLF Phase 2',
    rating: 4.9,
    experience: '7 years',
    languages: ['Hindi', 'English'],
    specialization: 'General Health Guidance',
    available: false,
    distance: '4.2 km',
    phone: '+91 98765 43212',
    email: 'sunita.devi@asha.gov.in',
  },
];

export const demoVitalReadings = [
  {
    type: 'blood-pressure',
    value: '120/80',
    unit: 'mmHg',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    notes: 'Morning reading',
  },
  {
    type: 'blood-sugar',
    value: '95',
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    notes: 'Fasting',
  },
  {
    type: 'weight',
    value: '68.5',
    unit: 'kg',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    notes: 'Morning weight',
  },
];

export const demoReminders = [
  {
    title: 'Metformin - Morning Dose',
    time: '08:00 AM',
    type: 'medication',
    completed: true,
    frequency: 'Daily',
    createdAt: new Date(),
  },
  {
    title: 'Blood Pressure Check',
    time: '09:30 AM',
    type: 'checkup',
    completed: true,
    frequency: 'Daily',
    createdAt: new Date(),
  },
  {
    title: 'Metformin - Evening Dose',
    time: '08:00 PM',
    type: 'medication',
    completed: false,
    frequency: 'Daily',
    createdAt: new Date(),
  },
  {
    title: 'Doctor Appointment - Dr. Sharma',
    time: '10:00 AM',
    type: 'appointment',
    completed: false,
    frequency: 'Tomorrow',
    createdAt: new Date(),
  },
  {
    title: 'Evening Walk',
    time: '06:30 PM',
    type: 'exercise',
    completed: false,
    frequency: 'Daily',
    createdAt: new Date(),
  },
];

export const demoHealthTips = [
  {
    title: 'Morning Walk Benefits',
    description: 'A 30-minute morning walk can reduce blood sugar levels by up to 20%',
    category: 'Exercise',
    readTime: '2 min',
    language: 'en',
  },
  {
    title: 'Diabetes-Friendly Foods',
    description: 'Include bitter gourd, fenugreek, and cinnamon in your daily diet',
    category: 'Nutrition',
    readTime: '3 min',
    language: 'en',
  },
  {
    title: 'Blood Pressure Monitoring',
    description: 'Best time to check BP is morning before medication',
    category: 'Health Tips',
    readTime: '2 min',
    language: 'en',
  },
  {
    title: 'सुबह की सैर के फायदे',
    description: '30 मिनट की सुबह की सैर रक्त शर्करा के स्तर को 20% तक कम कर सकती है',
    category: 'व्यायाम',
    readTime: '2 मिनट',
    language: 'hi',
  },
];

export const populateDemoData = async () => {
  try {
    // Add health workers
    for (const worker of demoHealthWorkers) {
      await addDoc(collection(db, 'healthWorkers'), worker);
    }

    // Add vital readings
    for (const reading of demoVitalReadings) {
      await addDoc(collection(db, 'vitalReadings'), reading);
    }

    // Add reminders
    for (const reminder of demoReminders) {
      await addDoc(collection(db, 'reminders'), reminder);
    }

    // Add health tips
    for (const tip of demoHealthTips) {
      await addDoc(collection(db, 'healthTips'), tip);
    }

    console.log('Demo data populated successfully');
  } catch (error) {
    console.error('Error populating demo data:', error);
  }
};
