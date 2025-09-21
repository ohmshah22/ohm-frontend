import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, ChevronRight } from 'lucide-react-native';

interface HealthTipCardProps {
  title: string;
  description: string;
  category: string;
  readTime: string;
}

export function HealthTipCard({ title, description, category, readTime }: HealthTipCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'exercise':
        return '#3B82F6';
      case 'nutrition':
        return '#10B981';
      case 'health tips':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(category)}20` }]}>
          <Text style={[styles.categoryText, { color: getCategoryColor(category) }]}>
            {category}
          </Text>
        </View>
        <View style={styles.readTime}>
          <Clock size={12} color="#6B7280" />
          <Text style={styles.readTimeText}>{readTime}</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.footer}>
        <Text style={styles.readMore}>Read more</Text>
        <ChevronRight size={16} color="#14B8A6" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14B8A6',
    marginRight: 4,
  },
});