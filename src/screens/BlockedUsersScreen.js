import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

const MOCK_BLOCKED = [
  {id: '1', name: 'Spam Account', phone: '+31600000001', avatar: '🚫'},
  {id: '2', name: 'Unknown User', phone: '+31600000002', avatar: '👤'},
];

export default function BlockedUsersScreen({navigation}) {
  const [blockedUsers, setBlockedUsers] = useState(MOCK_BLOCKED);

  const handleUnblock = (user) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${user.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Unblock',
          onPress: () => {
            setBlockedUsers((prev) => prev.filter((u) => u.id !== user.id));
          },
        },
      ],
    );
  };

  const renderBlockedUser = ({item}) => (
    <View style={styles.userCard}>
      <Text style={styles.avatar}>{item.avatar}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.unblockBtn}
        onPress={() => handleUnblock(item)}>
        <Text style={styles.unblockText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Blocked Users</Text>
        <Text style={styles.subtitle}>
          Blocked users cannot call or message you
        </Text>
      </View>

      {blockedUsers.length > 0 ? (
        <FlatList
          data={blockedUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderBlockedUser}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyText}>No blocked users</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.xxl + 10,
    marginBottom: spacing.lg,
  },
  backBtn: {
    color: colors.primary,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.title,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  phone: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  unblockBtn: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  unblockText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
  },
});
