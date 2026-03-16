import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {useAuth} from '../context/AuthContext';
import ContactCard from '../components/ContactCard';
import TierBadge from '../components/TierBadge';
import {MOCK_CONTACTS, MOCK_CALL_HISTORY, formatTime, generateRoomId} from '../utils/helpers';

export default function HomeScreen({navigation}) {
  const {user, isPaid} = useAuth();
  const [tab, setTab] = useState('contacts');
  const [search, setSearch] = useState('');

  const filteredContacts = MOCK_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  const handleCall = (contact, type) => {
    navigation.navigate('Call', {
      contact,
      callType: type,
      roomId: generateRoomId(user?.id || 'me', contact.id),
      isIncoming: false,
    });
  };

  const handleContactPress = (contact) => {
    navigation.navigate('Chat', {contact});
  };

  const renderCallHistoryItem = ({item}) => {
    const directionIcon =
      item.direction === 'outgoing'
        ? '↗️'
        : item.direction === 'incoming'
        ? '↙️'
        : '❌';

    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => handleCall(item.contact, item.type)}>
        <Text style={styles.historyAvatar}>{item.contact.avatar}</Text>
        <View style={styles.historyInfo}>
          <Text style={styles.historyName}>{item.contact.name}</Text>
          <Text style={styles.historyDetails}>
            {directionIcon} {item.direction} • {item.type}{' '}
            {item.duration ? `• ${item.duration}` : ''}
          </Text>
        </View>
        <Text style={styles.historyTime}>{formatTime(item.timestamp)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hey {user?.contact?.split('@')[0] || 'there'} 👋</Text>
            <Text style={styles.headerTitle}>CainoChat</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => navigation.navigate('Search')}>
              <Text style={styles.settingsIcon}>🔍</Text>
            </TouchableOpacity>
            <TierBadge />
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search contacts..."
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'contacts' && styles.tabActive]}
          onPress={() => setTab('contacts')}>
          <Text
            style={[styles.tabText, tab === 'contacts' && styles.tabTextActive]}>
            👥 Contacts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'history' && styles.tabActive]}
          onPress={() => setTab('history')}>
          <Text
            style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>
            📞 History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {tab === 'contacts' ? (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <ContactCard
              contact={item}
              onPress={handleContactPress}
              onCall={handleCall}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={MOCK_CALL_HISTORY}
          keyExtractor={(item) => item.id}
          renderItem={renderCallHistoryItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Upgrade banner (free users only) */}
      {!isPaid && (
        <TouchableOpacity
          style={styles.upgradeBanner}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.upgradeIcon}>💎</Text>
          <View style={styles.upgradeText}>
            <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
            <Text style={styles.upgradeSubtext}>
              Group calls, HD quality, unlimited time
            </Text>
          </View>
          <Text style={styles.upgradeArrow}>→</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + 10,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    color: colors.text,
    fontSize: fontSize.title,
    fontWeight: '800',
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsIcon: {
    fontSize: 20,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.text,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyAvatar: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  historyDetails: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  historyTime: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  upgradeBanner: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.paid,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    color: colors.paid,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  upgradeSubtext: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  upgradeArrow: {
    color: colors.paid,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
});
