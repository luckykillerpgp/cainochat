import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {useAuth} from '../context/AuthContext';
import CallControls from '../components/CallControls';
import webrtc from '../services/webrtc';
import {TIER_LIMITS} from '../utils/helpers';

const {width, height} = Dimensions.get('window');

export default function CallScreen({route, navigation}) {
  const {contact, callType, roomId, isIncoming} = route.params;
  const {user, isPaid} = useAuth();
  const [callState, setCallState] = useState(isIncoming ? 'incoming' : 'calling');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(callType === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const tierLimits = TIER_LIMITS[isPaid ? 'paid' : 'free'];

  useEffect(() => {
    if (callState === 'calling' || callState === 'incoming') {
      // Pulse animation for calling state
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [callState]);

  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => {
          if (prev >= tierLimits.maxCallDuration) {
            handleEndCall();
            Alert.alert('Time Limit', 'Free calls are limited to 30 minutes. Upgrade to Premium for unlimited calls.');
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const initCall = async () => {
    try {
      const stream = await webrtc.getLocalStream(videoEnabled, audioEnabled);
      setLocalStream(stream);

      webrtc.onRemoteStream = (stream) => {
        setRemoteStream(stream);
        setCallState('connected');
      };

      await webrtc.startCall(roomId, user?.id || 'me', !isIncoming);
    } catch (e) {
      console.error('Call init error:', e);
      Alert.alert('Error', 'Could not start call. Check camera/mic permissions.');
      handleEndCall();
    }
  };

  const handleAcceptCall = async () => {
    setCallState('connecting');
    await initCall();
  };

  const handleDeclineCall = () => {
    handleEndCall();
  };

  const handleStartCall = async () => {
    setCallState('connecting');
    await initCall();
  };

  const handleEndCall = () => {
    webrtc.endCall();
    navigation.goBack();
  };

  const handleToggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    webrtc.toggleAudio(newState);
  };

  const handleToggleVideo = () => {
    const newState = !videoEnabled;
    setVideoEnabled(newState);
    webrtc.toggleVideo(newState);
  };

  const handleSwitchCamera = () => {
    webrtc.switchCamera();
  };

  const handleScreenShare = () => {
    if (!isPaid) {
      Alert.alert(
        'Premium Feature',
        'Screen sharing is available with Premium. Upgrade now!',
        [
          {text: 'Later', style: 'cancel'},
          {text: 'Upgrade', onPress: () => navigation.navigate('Settings')},
        ],
      );
      return;
    }
    Alert.alert('Screen Share', 'Starting screen share...');
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ========== INCOMING CALL SCREEN ==========
  if (callState === 'incoming') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.glowBackground} />

        <View style={styles.incomingContainer}>
          <Text style={styles.incomingLabel}>Incoming call</Text>

          <Animated.View style={[styles.callerAvatarContainer, {transform: [{scale: pulseAnim}]}]}>
            <Text style={styles.callerAvatar}>{contact.avatar}</Text>
          </Animated.View>

          <Text style={styles.callerName}>{contact.name}</Text>
          <Text style={styles.callerInfo}>
            {contact.verified ? '🔒 Verified • ' : ''}{callType === 'video' ? '📹 Video Call' : '📞 Audio Call'}
          </Text>

          {/* Caller preview placeholder */}
          <View style={styles.previewContainer}>
            <View style={styles.previewBox}>
              <Text style={styles.previewIcon}>📹</Text>
              <Text style={styles.previewText}>Camera preview</Text>
            </View>
          </View>

          <View style={styles.incomingActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.declineBtn]}
              onPress={handleDeclineCall}>
              <Text style={styles.actionIcon}>📵</Text>
              <Text style={styles.actionLabel}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.acceptBtn]}
              onPress={handleAcceptCall}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionLabel}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ========== CALLING SCREEN ==========
  if (callState === 'calling') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.glowBackground} />

        <View style={styles.incomingContainer}>
          <Text style={styles.incomingLabel}>Calling...</Text>

          <Animated.View style={[styles.callerAvatarContainer, {transform: [{scale: pulseAnim}]}]}>
            <Text style={styles.callerAvatar}>{contact.avatar}</Text>
          </Animated.View>

          <Text style={styles.callerName}>{contact.name}</Text>
          <Text style={styles.callerInfo}>
            {contact.status === 'online' ? '🟢 Online' : '⚫ Offline'} • {callType === 'video' ? '📹 Video' : '📞 Audio'}
          </Text>

          <View style={styles.previewContainer}>
            <View style={styles.previewBox}>
              <Text style={styles.previewIcon}>📹</Text>
              <Text style={styles.previewText}>Your camera</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.cancelBtn, {marginTop: spacing.xxl}]}
            onPress={handleEndCall}>
            <Text style={styles.actionIcon}>📵</Text>
            <Text style={styles.actionLabel}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startCallBtn}
            onPress={handleStartCall}>
            <Text style={styles.startCallText}>Start Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ========== CONNECTING / CONNECTED SCREEN ==========
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Remote video (full screen) */}
      <View style={styles.remoteVideoContainer}>
        {remoteStream ? (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
          />
        ) : (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingAvatar}>{contact.avatar}</Text>
            <Text style={styles.waitingName}>{contact.name}</Text>
            <Text style={styles.waitingStatus}>
              {callState === 'connecting' ? 'Connecting...' : 'Waiting...'}
            </Text>
          </View>
        )}
      </View>

      {/* Local video (PiP) */}
      {videoEnabled && localStream && (
        <View style={styles.localVideoContainer}>
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
            mirror
          />
        </View>
      )}

      {/* Call info overlay */}
      <View style={styles.callInfoOverlay}>
        <Text style={styles.callInfoName}>{contact.name}</Text>
        {callState === 'connected' && (
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        )}
        {contact.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>🔒 Verified</Text>
          </View>
        )}
      </View>

      {/* Call controls */}
      <View style={styles.controlsContainer}>
        <CallControls
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
          onEndCall={handleEndCall}
          onSwitchCamera={handleSwitchCamera}
          onScreenShare={handleScreenShare}
          showScreenShare={true}
        />
      </View>
    </View>
  );
}

// Lazy import RTCView
let RTCView;
try {
  RTCView = require('react-native-webrtc').RTCView;
} catch (e) {
  RTCView = () => null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glowBackground: {
    position: 'absolute',
    top: -height * 0.3,
    left: -width * 0.3,
    width: width * 1.6,
    height: height * 0.6,
    borderRadius: width,
    backgroundColor: colors.primaryDark,
    opacity: 0.15,
  },
  // Incoming / Calling styles
  incomingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  incomingLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    marginBottom: spacing.xxl,
  },
  callerAvatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  callerAvatar: {
    fontSize: 56,
  },
  callerName: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  callerInfo: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginBottom: spacing.xl,
  },
  previewContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  previewBox: {
    height: 150,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  previewText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  incomingActions: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    position: 'absolute',
    bottom: -24,
  },
  acceptBtn: {
    backgroundColor: colors.success,
  },
  declineBtn: {
    backgroundColor: colors.primary,
  },
  cancelBtn: {
    backgroundColor: colors.primary,
  },
  startCallBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
  },
  startCallText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  // Connected call styles
  remoteVideoContainer: {
    flex: 1,
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: colors.background,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  waitingAvatar: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  waitingName: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  waitingStatus: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  localVideoContainer: {
    position: 'absolute',
    top: spacing.xxl + 40,
    right: spacing.md,
    width: 120,
    height: 160,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 10,
  },
  localVideo: {
    flex: 1,
  },
  callInfoOverlay: {
    position: 'absolute',
    top: spacing.xxl + 20,
    left: spacing.md,
    zIndex: 5,
  },
  callInfoName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  callDuration: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
  verifiedBadge: {
    marginTop: spacing.xs,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: colors.success,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
