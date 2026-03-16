import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {useAuth} from '../context/AuthContext';
import {encryptMessage, decryptMessage} from '../services/encryption';

// Mock message data
const INITIAL_MESSAGES = [
  {
    id: '1',
    senderId: 'other',
    text: 'Hey! How are you? 👋',
    timestamp: Date.now() - 600000,
    encrypted: false,
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Good! Just testing CainoChat 🔴',
    timestamp: Date.now() - 540000,
    encrypted: false,
  },
  {
    id: '3',
    senderId: 'other',
    text: 'The encryption is solid 🔐',
    timestamp: Date.now() - 480000,
    encrypted: false,
  },
];

export default function ChatScreen({route, navigation}) {
  const {contact} = route.params;
  const {user} = useAuth();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText.trim(),
      timestamp: Date.now(),
      encrypted: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        text: getRandomReply(),
        timestamp: Date.now(),
        encrypted: true,
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  const getRandomReply = () => {
    const replies = [
      'Got it! 👍',
      'Interesting...',
      'Tell me more!',
      '😄 Nice!',
      'That\'s cool',
      'Okay!',
      'Haha 😂',
      'I agree',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  const renderMessage = ({item}) => {
    const isMe = item.senderId === 'me';
    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        <View style={[styles.messageBubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>
              {formatTime(item.timestamp)}
            </Text>
            {item.encrypted && (
              <Text style={styles.encryptedIcon}>🔒</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfo}
          onPress={() => navigation.navigate('Security', {contact})}>
          <Text style={styles.headerAvatar}>{contact.avatar}</Text>
          <View>
            <Text style={styles.headerName}>{contact.name}</Text>
            <Text style={styles.headerStatus}>
              {contact.verified ? '🔒 Verified' : '⚠️ Not verified'} • {contact.status}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() =>
            navigation.navigate('Call', {
              contact,
              callType: 'video',
              roomId: `chat_${user?.id}_${contact.id}`,
              isIncoming: false,
            })
          }>
          <Text style={styles.callIcon}>📹</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={1000}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  headerName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  headerStatus: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: 1,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callIcon: {
    fontSize: 18,
  },
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  messageRow: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 20,
  },
  messageTextMe: {
    color: colors.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  messageTime: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  messageTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  encryptedIcon: {
    fontSize: 10,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    maxHeight: 100,
  },
  input: {
    color: colors.text,
    fontSize: fontSize.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: 40,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.surfaceLight,
  },
  sendIcon: {
    fontSize: 18,
    color: colors.text,
  },
});
