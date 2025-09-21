import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, MapPin, MessageCircle, Phone, Video, Calendar } from 'lucide-react-native';

interface HealthWorkerCardProps {
  worker: {
    id: number;
    name: string;
    role: string;
    location: string;
    rating: number;
    experience: string;
    languages: string[];
    specialization: string;
    available: boolean;
    distance: string;
  };
  onCall: () => void;
  onVideoCall: () => void;
  onMessage: () => void;
  onBook: () => void;
}

export function HealthWorkerCard({ worker, onCall, onVideoCall, onMessage, onBook }: HealthWorkerCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{worker.name.charAt(0)}</Text>
        </View>
        <View style={styles.workerInfo}>
          <Text style={styles.name}>{worker.name}</Text>
          <Text style={styles.role}>{worker.role}</Text>
          <View style={styles.rating}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{worker.rating}</Text>
            <Text style={styles.experience}>• {worker.experience}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: worker.available ? '#10B981' : '#6B7280' }]}>
          <Text style={styles.statusText}>{worker.available ? 'Available' : 'Busy'}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.detailText}>{worker.location} • {worker.distance}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.specialization}>{worker.specialization}</Text>
        </View>
        <View style={styles.languages}>
          <Text style={styles.languagesLabel}>Languages: </Text>
          <Text style={styles.languagesText}>{worker.languages.join(', ')}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onMessage}>
          <MessageCircle size={16} color="#14B8A6" />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onCall}>
          <Phone size={16} color="#3B82F6" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onVideoCall}>
          <Video size={16} color="#8B5CF6" />
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.bookButton]} onPress={onBook}>
          <Calendar size={16} color="#FFFFFF" />
          <Text style={[styles.actionText, styles.bookButtonText]}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  experience: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  specialization: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14B8A6',
  },
  languages: {
    flexDirection: 'row',
    marginTop: 4,
  },
  languagesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  languagesText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookButton: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  bookButtonText: {
    color: '#FFFFFF',
  },
});