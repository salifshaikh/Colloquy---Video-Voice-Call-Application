import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io.connect('http://localhost:5000');

function App() {
  const [yourID, setYourID] = useState('');
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
    });

    socket.on('yourID', (id) => {
      setYourID(id);
    });

    socket.on('callReceived', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: yourID });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  return (
    <div>
      <div>
        <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
        {callAccepted && !callEnded ? (
          <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
        ) : null}
      </div>

      <input
        type="text"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
        placeholder="Enter ID to call"
      />
      <button onClick={() => callUser(idToCall)}>Call</button>

      {receivingCall && !callAccepted ? (
        <div>
          <h1>{caller} is calling...</h1>
          <button onClick={answerCall}>Answer</button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
