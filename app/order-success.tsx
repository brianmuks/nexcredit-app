import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';

export default function OrderSuccessScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { orderRef, total } = useLocalSearchParams<{ orderRef: string; total: string }>();

  const [notifStatus, setNotifStatus] = React.useState<'sending' | 'sent'>('sending');

  React.useEffect(() => {
    const timer = setTimeout(() => setNotifStatus('sent'), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>

        {/* Success Icon */}
        <View style={[styles.iconWrap, { backgroundColor: colors.success + '18' }]}>
          <View style={[styles.iconInner, { backgroundColor: colors.success + '30' }]}>
            <MaterialIcons name="check-circle" size={64} color={colors.success} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
          Order Placed!
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
          Your credit purchase request has been received successfully.
        </Text>

        {/* Order Details Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
              Order Reference
            </Text>
            <Text style={[styles.detailValue, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]}>
              {orderRef ?? 'NX-000000'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
              Total Amount
            </Text>
            <Text style={[styles.detailValue, { color: colors.primary, fontFamily: theme.fontFamily.headline }]}>
              K{total ?? '0'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
              Status
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.statusText, { color: colors.success, fontFamily: theme.fontFamily.bodySemiBold }]}>
                Confirmed
              </Text>
            </View>
          </View>
        </View>

        {/* Ambassador Notification Card */}
        <View style={[styles.agentCard, { backgroundColor: '#1A1F20', borderColor: notifStatus === 'sent' ? colors.success : colors.border }]}>
          <View style={styles.agentHeader}>
            <View style={[styles.agentIconWrap, { backgroundColor: notifStatus === 'sent' ? colors.success + '25' : 'rgba(255,255,255,0.08)' }]}>
              <MaterialIcons
                name={notifStatus === 'sent' ? 'campaign' : 'schedule'}
                size={24}
                color={notifStatus === 'sent' ? colors.success : 'rgba(255,255,255,0.5)'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.agentTitle, { fontFamily: theme.fontFamily.headline }]}>
                {notifStatus === 'sending' ? 'Notifying Ambassador...' : 'Ambassador Notified'}
              </Text>
              <Text style={[styles.agentSub, { fontFamily: theme.fontFamily.body }]}>
                {notifStatus === 'sending'
                  ? 'Connecting with your nearest NexCredit agent'
                  : 'Your NexCredit agent will contact you shortly'}
              </Text>
            </View>
            {notifStatus === 'sent' && (
              <MaterialIcons name="check-circle" size={20} color={colors.success} />
            )}
          </View>

          {notifStatus === 'sent' && (
            <>
              <View style={[styles.agentDivider, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
              <View style={styles.agentSteps}>
                {[
                  { icon: 'person-pin', text: 'Agent assigned to your order', done: true },
                  { icon: 'phone', text: 'Agent will call to schedule a meeting', done: true },
                  { icon: 'verified-user', text: 'Physical verification to activate credit', done: false },
                ].map((step, i) => (
                  <View key={i} style={styles.agentStep}>
                    <View style={[styles.agentStepDot, {
                      backgroundColor: step.done ? colors.success + '25' : 'rgba(255,255,255,0.06)',
                      borderColor: step.done ? colors.success : 'rgba(255,255,255,0.12)',
                    }]}>
                      <MaterialIcons
                        name={step.icon as any}
                        size={14}
                        color={step.done ? colors.success : 'rgba(255,255,255,0.4)'}
                      />
                    </View>
                    <Text style={[styles.agentStepText, {
                      color: step.done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                      fontFamily: theme.fontFamily.body,
                    }]}>
                      {step.text}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={[styles.agentNote, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }]}>
                <MaterialIcons name="info-outline" size={14} color="rgba(255,255,255,0.4)" />
                <Text style={[styles.agentNoteText, { fontFamily: theme.fontFamily.body }]}>
                  Your ambassador will physically meet you to complete KYC verification before credit is activated.
                </Text>
              </View>
            </>
          )}
        </View>

        {/* What's Next */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.whatsNextTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            What happens next?
          </Text>
          {[
            { icon: 'phone', label: 'You\'ll receive a call from your assigned ambassador within 24 hours.' },
            { icon: 'place', label: 'Meet your ambassador at a convenient location on or near campus.' },
            { icon: 'badge', label: 'Bring your student ID and national ID for verification.' },
            { icon: 'credit-score', label: 'Once verified, your NexCredit limit is activated instantly.' },
          ].map((step, i) => (
            <View key={i} style={styles.nextStep}>
              <View style={[styles.nextStepIcon, { backgroundColor: colors.primaryMuted }]}>
                <MaterialIcons name={step.icon as any} size={18} color={colors.primary} />
              </View>
              <Text style={[styles.nextStepText, { color: colors.textSecondary, fontFamily: theme.fontFamily.body }]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          onPress={() => router.replace('/(tabs)/marketplace')}
          style={({ pressed }) => [styles.ctaBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.88 }]}>
          <MaterialIcons name="storefront" size={18} color="#fff" />
          <Text style={[styles.ctaBtnText, { fontFamily: theme.fontFamily.headline }]}>
            Continue Shopping
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16, paddingTop: 32 },
  iconWrap: {
    width: 120, height: 120, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
  },
  iconInner: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginTop: -8 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  divider: { height: StyleSheet.hairlineWidth },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  statusText: { fontSize: 12, fontWeight: '600' },
  agentCard: { borderRadius: 20, borderWidth: 1, padding: 18, gap: 0, overflow: 'hidden' },
  agentHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  agentIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  agentTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  agentSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  agentDivider: { height: 1, marginVertical: 14 },
  agentSteps: { gap: 10 },
  agentStep: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  agentStepDot: { width: 28, height: 28, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  agentStepText: { flex: 1, fontSize: 13, lineHeight: 18 },
  agentNote: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginTop: 12, alignItems: 'flex-start' },
  agentNoteText: { flex: 1, color: 'rgba(255,255,255,0.4)', fontSize: 11, lineHeight: 16 },
  whatsNextTitle: { fontSize: 15, fontWeight: '700' },
  nextStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  nextStepIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  nextStepText: { flex: 1, fontSize: 13, lineHeight: 18, paddingTop: 8 },
  footer: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
