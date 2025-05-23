// mirrorchat/lib/webrtc.js

export async function createPeerConnection(onTrackCallback) {
  const config = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      // Optional: Add TURN server here for production
    ],
  };

  const peerConnection = new RTCPeerConnection(config);

  // Handle incoming media
  peerConnection.ontrack = (event) => {
    if (onTrackCallback) {
      onTrackCallback(event.streams[0]);
    }
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("New ICE candidate:", event.candidate);
    }
  };

  return peerConnection;
}

export async function getLocalStream(audio = true, video = true) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
    return stream;
  } catch (error) {
    console.error("Failed to access media devices:", error);
    throw error;
  }
}

export async function createOffer(pc) {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return offer;
}

export async function createAnswer(pc, offer) {
  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
}

export async function addRemoteAnswer(pc, answer) {
  await pc.setRemoteDescription(new RTCSessionDescription(answer));
}

