import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, MessageCircle, Phone, MapPin, Star, Clock, Send, Video } from 'lucide-react-native';
import { colors, gradients } from '@/config/colors';
import { HealthWorkerCard } from '../../components/HealthWorkerCard';
import { useAuth } from '@/contexts/AuthContext';
import { HealthWorkerProfile, PatientProfile } from '@/services/auth';

export default function HealthWorkersScreen() {
  const { t } = useTranslation();
  const { user, userProfile, getHealthWorkers, getAssignedPatients, assignPatientToHealthWorker } = useAuth();
  const [activeTab, setActiveTab] = useState('workers');
  const [message, setMessage] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<HealthWorkerProfile | null>(null);
  const [healthWorkers, setHealthWorkers] = useState<HealthWorkerProfile[]>([]);
  const [assignedPatients, setAssignedPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHealthWorkers = async () => {
    try {
      setLoading(true);
      const workers = await getHealthWorkers();
      setHealthWorkers(workers);
    } catch (error) {
      console.error('Error loading health workers:', error);
      Alert.alert(t('common.error'), 'Failed to load health workers');
    } finally {
      setLoading(false);
    }
  };

  const loadAssignedPatients = async () => {
    if (!userProfile || userProfile.role !== 'health_worker') return;
    
    try {
      setLoading(true);
      const patients = await getAssignedPatients(userProfile.uid);
      setAssignedPatients(patients);
    } catch (error) {
      console.error('Error loading assigned patients:', error);
      Alert.alert(t('common.error'), 'Failed to load assigned patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.role === 'patient') {
      loadHealthWorkers();
    } else if (userProfile?.role === 'health_worker') {
      loadAssignedPatients();
    }
  }, [userProfile]);

  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const loadMessages = async (workerId: string) => {
    try {
      // In a real app, you would load messages from Firestore
      // For now, we'll show an empty state
      setChatMessages([]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedWorker) return;
    
    try {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'user',
        message: message.trim(),
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        timestamp: new Date(),
      };
      
      // Add message to local state
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // In a real app, you would save this to Firestore
      console.log('Message sent:', newMessage);
      
      // Simulate a response from health worker
      setTimeout(() => {
        const responseMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'worker',
          message: 'Thank you for your message. I will get back to you soon.',
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          workerName: selectedWorker.name,
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, responseMessage]);
      }, 2000);
      
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to send message');
    }
  };

  const handleAssignToHealthWorker = async (workerId: string) => {
    if (!user || !userProfile || userProfile.role !== 'patient') return;

    try {
      setLoading(true);
      await assignPatientToHealthWorker(userProfile.uid, workerId);
      Alert.alert(
        t('common.success'),
        'Successfully assigned to health worker!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Refresh the health workers list
              loadHealthWorkers();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error assigning to health worker:', error);
      Alert.alert(t('common.error'), 'Failed to assign to health worker');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorker = (worker: HealthWorkerProfile) => {
    setSelectedWorker(worker);
    setActiveTab('messages');
    loadMessages(worker.uid);
  };

  const handleCallWorker = (worker: any) => {
    Alert.alert(
      'Call Health Worker',
      `Call ${worker.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling...', `Connecting to ${worker.name}`) }
      ]
    );
  };

  const handleVideoCall = (worker: any) => {
    Alert.alert(
      'Video Consultation',
      `Start video call with ${worker.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Call', onPress: () => Alert.alert('Video Call Starting...', `Connecting to ${worker.name}`) }
      ]
    );
  };

  const handleBookAppointment = (worker: any) => {
    Alert.alert(
      'Book Appointment',
      `Book an appointment with ${worker.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book', onPress: () => Alert.alert('Appointment Booked', 'You will receive confirmation shortly.') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.care}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>{t('healthWorkers.title')}</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'workers' && styles.activeTab]}
            onPress={() => setActiveTab('workers')}
          >
            <Text style={[styles.tabText, activeTab === 'workers' && styles.activeTabText]}>
              {t('healthWorkers.searchWorkers')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
            onPress={() => setActiveTab('chat')}
          >
            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
              {t('healthWorkers.message')}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {activeTab === 'workers' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Emergency Contact */}
            <View style={styles.emergencySection}>
              <Text style={styles.emergencyTitle}>Emergency Contact</Text>
              <TouchableOpacity style={styles.emergencyButton}>
                <Phone size={24} color="#FFFFFF" />
                <Text style={styles.emergencyText}>Call 102 - Medical Emergency</Text>
              </TouchableOpacity>
            </View>

            {/* Nearby Health Workers */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('healthWorkers.nearby')}</Text>
              {healthWorkers.map(worker => (
                <HealthWorkerCard
                  key={worker.id}
                  worker={worker}
                  onCall={() => handleCallWorker(worker)}
                  onVideoCall={() => handleVideoCall(worker)}
                  onBook={() => handleBookAppointment(worker)}
                  onMessage={() => handleSelectWorker(worker)}
                />
              ))}
            </View>

            {/* Health Tips */}
            <View style={styles.section}>
              <View style={styles.tipCard}>
                <Users size={24} color="#14B8A6" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Why Connect with Health Workers?</Text>
                  <Text style={styles.tipDescription}>
                    ASHA workers and community health volunteers provide personalized guidance, 
                    help monitor your health, and offer support in your local language.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.chatContainer}>
          <ScrollView style={styles.messagesContainer}>
            {chatMessages.map(msg => (
              <View
                key={msg.id}
                style={[
                  styles.messageCard,
                  msg.sender === 'user' ? styles.userMessage : styles.workerMessage
                ]}
              >
                {msg.sender === 'worker' && (
                  <Text style={styles.workerName}>{msg.workerName}</Text>
                )}
                <Text style={styles.messageText}>{msg.message}</Text>
                <Text style={styles.messageTime}>{msg.time}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background.primary,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background.primary,
    opacity: 0.8,
  },
  activeTabText: {
    color: colors.background.primary,
    opacity: 1,
  },
  content: {
    padding: 20,
  },
  emergencySection: {
    marginBottom: 32,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  emergencyButton: {
    backgroundColor: colors.status.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  emergencyText: {
    color: colors.background.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: colors.background.primary,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipContent: {
    marginLeft: 12,
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: colors.accent.teal,
    alignSelf: 'flex-end',
  },
  workerMessage: {
    backgroundColor: colors.background.primary,
    alignSelf: 'flex-start',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  workerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.neutral[500],
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    color: colors.neutral[400],
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 12,
    padding: 12,
    maxHeight: 100,
    marginRight: 8,
    backgroundColor: colors.background.secondary,
  },
  sendButton: {
    backgroundColor: colors.accent.teal,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});