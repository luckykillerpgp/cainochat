import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';
import signaling from './signaling';
import SERVER_CONFIG from '../config/server';

// ICE servers from config
const ICE_SERVERS = SERVER_CONFIG.ICE_SERVERS;

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.onRemoteStream = null;
    this.onConnectionStateChange = null;
    this.onCallEnd = null;
    this.roomId = null;
    this.userId = null;
  }

  // Get user media (camera + mic)
  async getLocalStream(videoEnabled = true, audioEnabled = true) {
    const constraints = {
      audio: audioEnabled,
      video: videoEnabled
        ? {
            facingMode: 'user',
            width: {ideal: 1280},
            height: {ideal: 720},
          }
        : false,
    };

    this.localStream = await mediaDevices.getUserMedia(constraints);
    return this.localStream;
  }

  // Get screen share stream (paid feature)
  async getScreenShareStream() {
    try {
      const stream = await mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      return stream;
    } catch (e) {
      console.error('[WebRTC] Screen share error:', e);
      return null;
    }
  }

  // Create peer connection and join room
  async startCall(roomId, userId, isCaller = true) {
    this.roomId = roomId;
    this.userId = userId;

    // Create peer connection
    this.peerConnection = new RTCPeerConnection(ICE_SERVERS);

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    }

    // Handle remote stream
    this.remoteStream = new MediaStream();
    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        event.streams[0].getTracks().forEach((track) => {
          this.remoteStream.addTrack(track);
        });
        if (this.onRemoteStream) {
          this.onRemoteStream(this.remoteStream);
        }
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        signaling.sendIceCandidate(roomId, event.candidate, userId);
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState;
      console.log('[WebRTC] Connection state:', state);
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(state);
      }
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.endCall();
      }
    };

    // Connect to signaling server
    await signaling.connect(SERVER_CONFIG.SIGNALING_SERVER);
    signaling.joinRoom(roomId, userId);

    // Set up signaling listeners
    signaling.on('offer', async (data) => {
      if (data.userId !== userId) {
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        signaling.sendAnswer(roomId, answer, userId);
      }
    });

    signaling.on('answer', async (data) => {
      if (data.userId !== userId) {
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
      }
    });

    signaling.on('ice-candidate', async (data) => {
      if (data.userId !== userId && data.candidate) {
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(data.candidate),
        );
      }
    });

    signaling.on('user-joined', async (data) => {
      if (data.userId !== userId && isCaller) {
        // Create offer when another user joins
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        signaling.sendOffer(roomId, offer, userId);
      }
    });

    signaling.on('user-left', () => {
      this.endCall();
    });

    return this.peerConnection;
  }

  // Toggle audio
  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  // Toggle video
  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  // Switch camera (front/back)
  async switchCamera() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack._switchCamera();
      }
    }
  }

  // End call and clean up
  endCall() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Leave signaling room
    if (this.roomId && this.userId) {
      signaling.leaveRoom(this.roomId, this.userId);
    }
    signaling.disconnect();

    this.remoteStream = null;
    this.roomId = null;

    if (this.onCallEnd) {
      this.onCallEnd();
    }
  }
}

export default new WebRTCService();
