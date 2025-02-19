import React, { Component } from 'react';
import _ from 'lodash';
import { socket, PeerConnection } from './communication';
import MainWindow from './components/MainWindow';
import CallWindow from './components/CallWindow';
import CallModal from './components/CallModal';
import Footer from './components/Footer';

class App extends Component {
  constructor() {
    super();
    this.state = {
      callWindow: '',
      callModal: '',
      callFrom: '',
      localSrc: null,
      peerSrc: null,
      showMainWindow: true // Add a state to control MainWindow visibility
    };
    this.pc = {};
    this.config = null;
    this.startCallHandler = this.startCall.bind(this);
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
  }

  componentDidMount() {
    socket
      .on('request', ({ from: callFrom }) => {
        this.setState({
          callModal: 'active',
          callFrom,
          showMainWindow: false // Hide main window when call request comes
        });
      })
      .on('call', (data) => {
        if (data.sdp) {
          this.pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') this.pc.createAnswer();
        } else this.pc.addIceCandidate(data.candidate);
      })
      .on('end', this.endCall.bind(this, false))
      .emit('init');
  }

  startCall(isCaller, friendID, config) {
    this.config = config;
    this.pc = new PeerConnection(friendID)
      .on('localStream', (src) => {
        const newState = {
          callWindow: 'active',
          localSrc: src,
          showMainWindow: false // Hide main window when call starts
        };
        if (!isCaller) newState.callModal = '';
        this.setState(newState);
      })
      .on('peerStream', (src) => this.setState({ peerSrc: src }))
      .start(isCaller);
  }

  rejectCall() {
    const { callFrom } = this.state;
    socket.emit('end', { to: callFrom });
    this.setState({
      callModal: '',
      showMainWindow: true // Show main window if call is rejected
    });
  }

  endCall(isStarter) {
    if (_.isFunction(this.pc.stop)) {
      this.pc.stop(isStarter);
    }
    this.pc = {};
    this.config = null;
    this.setState({
      callWindow: '',
      callModal: '',
      localSrc: null,
      peerSrc: null,
      showMainWindow: true // Always show main window when call ends
    });
  }

  render() {
    const {
      callFrom,
      callModal,
      callWindow,
      localSrc,
      peerSrc,
      showMainWindow
    } = this.state;

    return (
      <div className="min-h-screen pb-20">
        {showMainWindow && (
          <MainWindow startCall={this.startCallHandler} />
        )}
        {!_.isEmpty(this.config) && (
          <CallWindow
            status={callWindow}
            localSrc={localSrc}
            peerSrc={peerSrc}
            config={this.config}
            mediaDevice={this.pc.mediaDevice}
            endCall={this.endCallHandler}
          />
        )}
        <CallModal
          status={callModal}
          startCall={this.startCallHandler}
          rejectCall={this.rejectCallHandler}
          callFrom={callFrom}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
