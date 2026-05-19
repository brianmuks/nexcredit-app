import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppTheme } from '@/theme';

const SCORE = 748;
const SCORE_LABEL = 'EXCELLENT';
const SCORE_MSG = "You're in the top 12% of users. Your credit health is looking exceptional this month.";

export function CreditStandingCard({ theme }: { theme: AppTheme }) {
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/vendor')}
      accessibilityRole="button"
      accessibilityLabel="View your credit standing in vendor dashboard"
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>

      {/* Label row */}
      <Text style={styles.standingLabel}>CURRENT STANDING</Text>

      {/* Gauge ring */}
      <View style={styles.gaugeWrap}>
        <View style={styles.gaugeOuter}>
          <View style={styles.gaugeInner}>
            <Text style={styles.scoreNumber}>{SCORE}</Text>
            <Text style={styles.scoreLabel}>{SCORE_LABEL}</Text>
          </View>
        </View>
        {/* Accent arc decoration */}
        <View style={styles.arcAccent} pointerEvents="none" />
      </View>

      <Text style={styles.scoreMsg}>{SCORE_MSG}</Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>K5,200</Text>
          <Text style={styles.statCaption}>Available Credit</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>35%</Text>
          <Text style={styles.statCaption}>Utilization</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#22C55E' }]}>Good</Text>
          <Text style={styles.statCaption}>Standing</Text>
        </View>
      </View>

      {/* Footer CTA */}
      <View style={styles.cardFooter}>
        <Text style={styles.ctaText}>View Vendor Dashboard</Text>
        <MaterialIcons name="arrow-forward" size={16} color="rgba(255,255,255,0.7)" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: '#1A1F20',
    padding: 24,
    gap: 16,
    overflow: 'hidden',
  },
  standingLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  gaugeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  gaugeOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#F05A28',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  arcAccent: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: '#F05A28',
    borderRightColor: '#F05A28',
    transform: [{ rotate: '45deg' }],
  },
  scoreNumber: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  scoreLabel: {
    color: '#F05A28',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scoreMsg: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.1)' },
  statValue: { color: '#fff', fontSize: 16, fontWeight: '700' },
  statCaption: { color: 'rgba(255,255,255,0.45)', fontSize: 10 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
  },
  ctaText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
});
