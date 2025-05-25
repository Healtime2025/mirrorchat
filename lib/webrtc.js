// mirrorchat/lib/webrtc.js

export async function createPeerConnection(onTrackCallback) {
  const config = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      // Optional: Add TURN server here for production reliability
    ],
  };

  const pc = new RTCPeerConnection(config);

  pc.ontrack = (event) => {
    if (onTrackCallback && event.streams[0]) {
      console.log("[RTC] Remote stream received.");
      onTrackCallback(event.streams[0]);
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("[RTC] ICE candidate:", event.candidate);
    }
  };

  pc.onconnectionstatechange = () => {
    console.log(`[RTC] Connection state: ${pc.connectionState}`);
  };

  return pc;
}

export async function getLocalStream(audio = true, video = true) {
  try {
    const constraints = { audio, video };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("[RTC] Local stream acquired.");
    return stream;
  } catch (error) {
    console.error("[RTC] Failed to access local media:", error);
    throw error;
  }
}

export async function createOffer(pc) {
  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    console.log("[RTC] Offer created.");
    return offer;
  } catch (err) {
    console.error("[RTC] Offer creation failed:", err);
    throw err;
  }
}

export async function createAnswer(pc, offer) {
  try {
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log("[RTC] Answer created.");
    return answer;
  } catch (err) {
    console.error("[RTC] Answer creation failed:", err);
    throw err;
  }
}

export async function addRemoteAnswer(pc, answer) {
  try {
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("[RTC] Remote answer set.");
  } catch (err) {
    console.error("[RTC] Failed to apply remote answer:", err);
    throw err;
  }
}
