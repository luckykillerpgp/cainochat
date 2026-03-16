import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {MOCK_CONTACTS} from '../utils/helpers';

// Mock searchable data
const SEARCHABLE_DATA = [
  ...MOCK_CONTACTS.map((c) => ({type: 'contact', ...c})),
  {type: 'message', id: 'm1', text: 'Hey! How are you doing?', sender: 'Emma de Vries', timestamp: Date.now() - 3600000},
  {type: 'message', id: 'm2', text: 'Let\'s call later today', sender: 'Jayden Bakker', timestamp: Date.now() - 7200000},
  {type: 'message', id: 'm3', text: 'Check out this new app!', sender: 'Sophie Jansen', timestamp: Date.now() - 86400000},
  {type: 'message', id: 'm4', text: 'The encryption is solid 🔐', sender: 'Daan Visser', timestamp: Date.now() - 172800000},
  {type: 'message', id: 'm5', text: 'See you tomorrow 👋', sender: 'Lotte Mulder', timestamp: Date.now() - 259200000},
];

export default function SearchScreen({navigation}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'Emma', 'video call', 'encryption',
  ]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      const filtered = SEARCHABLE_DATA.filter((item) => {
        if (item.type === 'contact') {
          return item.name.toLowerCase().includes(q) || item.phone.includes(q);
        }
        if (item.type === 'message') {
          return item.text.toLowerCase().includes(q) || item.sender.toLowerCase().includes(q);
        }
        return false;
      });
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleRecentPress = (term) => {
    setQuery(term);
  };

  const clearRecent = () => {
    setRecentSearches([]);
  };

  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderResult = ({item}) => {
    if (item.type === 'contact') {
      return (
        <TouchableOpacity
          style={styles.resultItem}
          onPress={() => navigation.navigate('Chat', {contact: item})}>
          <Text style={styles.resultAvatar}>{item.avatar}</Text>
          <View style={styles.resultInfo}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultSubtext}>{item.phone} • Contact</Text>
          </View>
          <Text style={styles.resultType}>👤</Text>
        </TouchableOpacity>
      );
    }

    if (item.type === 'message') {
      // Highlight matching text
      const idx = item.text.toLowerCase().indexOf(query.toLowerCase());
      const before = item.text.substring(0, idx);
      const match = item.text.substring(idx, idx + query.length);
      const after = item.text.substring(idx + query.length);

      return (
        <TouchableOpacity style={styles.resultItem}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultSender}>{item.sender}</Text>
            <Text style={styles.resultMessage}>
              {before}
              <Text style={styles.highlight}>{match}</Text>
              {after}
            </Text>
            <Text style={styles.resultTime}>{formatTime(item.timestamp)}</Text>
          </View>
          <Text style={styles.resultType}>💬</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search messages, contacts..."
            placeholderTextColor={colors.textMuted}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results or Recent */}
      {query.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderResult}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No results for "{query}"</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearRecent}>
              <Text style={styles.clearAllBtn}>Clear</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map((term, i) => (
            <TouchableOpacity
              key={i}
              style={styles.recentItem}
              onPress={() => handleRecentPress(term)}>
              <Text style={styles.recentIcon}>🕐</Text>
              <Text style={styles.recentTerm}>{term}</Text>
            </TouchableOpacity>
          ))}

          {/* Quick Filters */}
          <Text style={styles.filterTitle}>Quick Filters</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => setQuery('📹')}>
              <Text style={styles.filterText}>📹 Video calls</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => setQuery('🔒')}>
              <Text style={styles.filterText}>🔒 Verified</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => setQuery('online')}>
              <Text style={styles.filterText}>🟢 Online</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xxl + 10,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    marginRight: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    paddingVertical: spacing.sm + 2,
  },
  clearBtn: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    padding: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultAvatar: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  resultSubtext: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  resultSender: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  resultMessage: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  highlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  resultTime: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  resultType: {
    fontSize: 18,
    marginLeft: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  recentSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recentTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  clearAllBtn: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  recentIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  recentTerm: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  filterTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterText: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
});
