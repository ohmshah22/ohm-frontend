import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  User,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/config/firebase';

export interface BaseProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  preferredLanguage: string;
  role: 'patient' | 'health_worker';
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfile extends BaseProfile {
  role: 'patient';
  age: number;
  gender: 'male' | 'female' | 'other';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalConditions: string[];
  medications: string[];
  allergies: string[];
  bloodGroup: string;
  assignedHealthWorkerId?: string;
  healthWorkerName?: string;
}

export interface HealthWorkerProfile extends BaseProfile {
  role: 'health_worker';
  employeeId: string;
  specialization: string[];
  experience: number;
  languages: string[];
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  assignedPatients: string[];
  rating: number;
  totalPatients: number;
  isAvailable: boolean;
}

export type UserProfile = PatientProfile | HealthWorkerProfile;

export const authService = {
  // Sign up new user with role
  async signUp(email: string, password: string, userData: Partial<UserProfile>, role: 'patient' | 'health_worker') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Create base profile
      const baseProfile = {
        uid: user.uid,
        email: user.email || '',
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        preferredLanguage: userData.preferredLanguage || 'en',
        role,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      let userProfile: UserProfile;

      if (role === 'patient') {
        userProfile = {
          ...baseProfile,
          role: 'patient',
          age: (userData as PatientProfile).age || 0,
          gender: (userData as PatientProfile).gender || 'other',
          emergencyContact: (userData as PatientProfile).emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          },
          medicalConditions: (userData as PatientProfile).medicalConditions || [],
          medications: (userData as PatientProfile).medications || [],
          allergies: (userData as PatientProfile).allergies || [],
          bloodGroup: (userData as PatientProfile).bloodGroup || '',
        } as PatientProfile;
      } else {
        userProfile = {
          ...baseProfile,
          role: 'health_worker',
          employeeId: (userData as HealthWorkerProfile).employeeId || '',
          specialization: (userData as HealthWorkerProfile).specialization || [],
          experience: (userData as HealthWorkerProfile).experience || 0,
          languages: (userData as HealthWorkerProfile).languages || ['en'],
          workingHours: (userData as HealthWorkerProfile).workingHours || {
            start: '09:00',
            end: '17:00'
          },
          workingDays: (userData as HealthWorkerProfile).workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          location: (userData as HealthWorkerProfile).location || {
            latitude: 0,
            longitude: 0,
            address: ''
          },
          assignedPatients: [],
          rating: 0,
          totalPatients: 0,
          isAvailable: true,
        } as HealthWorkerProfile;
      }
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // Send welcome email notification
      await this.sendWelcomeEmail(user.email!, userData.name || 'User', role);
      
      return { user, profile: userProfile };
    } catch (error) {
      throw error;
    }
  },

  // Google Sign In
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists, if not redirect to role selection
      const userProfile = await this.getUserProfile(user.uid);
      if (!userProfile) {
        // User needs to complete profile setup
        return { user, needsProfileSetup: true };
      }
      
      return { user, needsProfileSetup: false };
    } catch (error) {
      throw error;
    }
  },

  // Send welcome email notification
  async sendWelcomeEmail(email: string, name: string, role: 'patient' | 'health_worker') {
    try {
      // This would typically call a cloud function or external email service
      // For now, we'll log it and you can implement the actual email service
      console.log(`Welcome email sent to ${email} for ${role} ${name}`);
      
      // You can integrate with services like:
      // - Firebase Functions with SendGrid
      // - AWS SES
      // - Nodemailer
      // - EmailJS
      
      // Example implementation with a cloud function:
      // await fetch('https://your-cloud-function-url/send-welcome-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, name, role })
      // });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Sign out user
  async signOutUser() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      throw error;
    }
  },

  // Get all health workers
  async getHealthWorkers() {
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const q = query(collection(db, 'users'), where('role', '==', 'health_worker'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as HealthWorkerProfile);
    } catch (error) {
      throw error;
    }
  },

  // Get patients assigned to a health worker
  async getAssignedPatients(healthWorkerId: string) {
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const q = query(collection(db, 'users'), where('assignedHealthWorkerId', '==', healthWorkerId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as PatientProfile);
    } catch (error) {
      throw error;
    }
  },

  // Assign patient to health worker
  async assignPatientToHealthWorker(patientId: string, healthWorkerId: string) {
    try {
      const { doc, updateDoc, getDoc } = await import('firebase/firestore');
      
      // Update patient's assigned health worker
      const patientRef = doc(db, 'users', patientId);
      const healthWorkerDoc = await getDoc(doc(db, 'users', healthWorkerId));
      const healthWorkerData = healthWorkerDoc.data() as HealthWorkerProfile;
      
      await updateDoc(patientRef, {
        assignedHealthWorkerId: healthWorkerId,
        healthWorkerName: healthWorkerData.name,
        updatedAt: new Date()
      });

      // Update health worker's assigned patients
      const healthWorkerRef = doc(db, 'users', healthWorkerId);
      await updateDoc(healthWorkerRef, {
        assignedPatients: [...healthWorkerData.assignedPatients, patientId],
        totalPatients: healthWorkerData.assignedPatients.length + 1,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  // Remove patient from health worker
  async removePatientFromHealthWorker(patientId: string, healthWorkerId: string) {
    try {
      const { doc, updateDoc, getDoc } = await import('firebase/firestore');
      
      // Update patient
      const patientRef = doc(db, 'users', patientId);
      await updateDoc(patientRef, {
        assignedHealthWorkerId: null,
        healthWorkerName: null,
        updatedAt: new Date()
      });

      // Update health worker
      const healthWorkerRef = doc(db, 'users', healthWorkerId);
      const healthWorkerDoc = await getDoc(healthWorkerRef);
      const healthWorkerData = healthWorkerDoc.data() as HealthWorkerProfile;
      
      const updatedPatients = healthWorkerData.assignedPatients.filter(id => id !== patientId);
      await updateDoc(healthWorkerRef, {
        assignedPatients: updatedPatients,
        totalPatients: updatedPatients.length,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  // Verify if user is a health worker
  async verifyHealthWorker(uid: string): Promise<boolean> {
    try {
      const userProfile = await this.getUserProfile(uid);
      return userProfile?.role === 'health_worker';
    } catch (error) {
      console.error('Error verifying health worker:', error);
      return false;
    }
  },

  // Get health worker profile with verification
  async getHealthWorkerProfile(uid: string): Promise<HealthWorkerProfile | null> {
    try {
      const userProfile = await this.getUserProfile(uid);
      if (userProfile?.role === 'health_worker') {
        return userProfile as HealthWorkerProfile;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
};
