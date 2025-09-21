import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Award } from 'lucide-react-native';
import { colors } from '@/config/colors';

interface HealthScoreCardProps {
  score: number;
  trend: 'improving' | 'stable' | 'declining';
}

export function HealthScoreCard({ score, trend }: HealthScoreCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp size={20} color={colors.primary[500]} />;
      case 'declining':
        return <TrendingDown size={20} color={colors.status.error} />;
      default:
        return <Award size={20} color={colors.accent.amber} />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'improving':
        return colors.primary[500];
      case 'declining':
        return colors.status.error;
      default:
        return colors.accent.amber;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Needs Attention';
      default:
        return 'Stable';
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return colors.primary[500];
    if (score >= 60) return colors.accent.amber;
    return colors.status.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Score</Text>
        <View style={styles.trendContainer}>
          {getTrendIcon()}
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {getTrendText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: getScoreColor() }]}>{score}</Text>
        <Text style={styles.scoreLabel}>/ 100</Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${score}%`, backgroundColor: getScoreColor() }
          ]} 
        />
      </View>
      
      <Text style={styles.description}>
        {score >= 80 
          ? "Excellent! Keep up the great work with your health management."
          : score >= 60 
          ? "Good progress! Focus on medication adherence and regular monitoring."
          : "Your health needs attention. Please consult with your health worker."
        }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 18,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});