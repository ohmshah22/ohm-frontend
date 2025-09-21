import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface StatusCardProps {
  title: string;
  value: string;
  status: 'normal' | 'good' | 'stable' | 'active' | 'warning';
  icon: LucideIcon;
  lastUpdated: string;
}

export function StatusCard({ title, value, status, icon: Icon, lastUpdated }: StatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'good':
      case 'stable':
        return '#10B981';
      case 'active':
        return '#3B82F6';
      case 'warning':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'good':
        return 'Good';
      case 'stable':
        return 'Stable';
      case 'active':
        return 'Active';
      case 'warning':
        return 'Monitor';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon size={20} color={getStatusColor(status)} />
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
            {getStatusText(status)}
          </Text>
        </View>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.lastUpdated}>{lastUpdated}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});