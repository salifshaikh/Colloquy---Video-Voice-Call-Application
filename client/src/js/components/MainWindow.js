/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { motion } from 'framer-motion';
import { PhoneIcon, VideoIcon, ClipboardCopyIcon, UserPlusIcon } from 'lucide-react';
import { socket } from '../communication';

function MainWindow({ startCall }) {
  const [clientID, setClientID] = useState('');
  const [friendID, setFriendID] = useState('');
  const [copyTooltip, setCopyTooltip] = useState(false);

  useEffect(() => {
    socket.on('init', ({ id }) => {
      document.title = 'Colloquy - Video Chat Application';
      setClientID(id);
    });
  }, []);

  const handleCopyID = () => {
    navigator.clipboard.writeText(clientID);
    setCopyTooltip(true);
    setTimeout(() => setCopyTooltip(false), 2000);
  };

  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

  return (
    <div className="artistic-main-window">
      <motion.div
        className="window-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          >
            Colloquy
          </motion.h1>
          <p className="subtitle">Connect. Communicate. Collaborate.</p>
        </div>

        <div className="id-section">
          <div className="client-id-container">
            <label>Your Unique ID</label>
            <div className="id-input-wrapper">
              <input
                type="text"
                value={clientID}
                readOnly
                className="client-id-display"
              />
              <motion.button
                onClick={handleCopyID}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="copy-btn"
              >
                <ClipboardCopyIcon />
              </motion.button>
            </div>
            {copyTooltip && <span className="copy-tooltip">Copied!</span>}
          </div>
        </div>

        <div className="call-section">
          <div className="friend-id-container">
            <label>Enter Friend's ID</label>
            <div className="friend-input-wrapper">
              <UserPlusIcon className="input-icon" />
              <input
                type="text"
                placeholder="Friend's Unique ID"
                value={friendID}
                onChange={(e) => setFriendID(e.target.value)}
                className="friend-id-input"
              />
            </div>
          </div>

          <div className="call-actions">
            <motion.button
              className="call-btn video-call"
              onClick={callWithVideo(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <VideoIcon />
              Video Call
            </motion.button>
            <motion.button
              className="call-btn voice-call"
              onClick={callWithVideo(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PhoneIcon />
              Voice Call
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

MainWindow.propTypes = {
  startCall: PropTypes.func.isRequired
};

export default MainWindow;
