import React, { useState } from 'react';
import BubbleContainer from '../components/welcome/BubbleContainer';
import MainBubble from '../components/welcome/MainBubble';
import FeatureBubbles from '../components/welcome/FeatureBubbles';
import AuthBubbles from '../components/welcome/AuthBubbles';

const Welcome = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.background} />
      <BubbleContainer>
        {showFeatures && <FeatureBubbles />}
        <MainBubble
          onGetStarted={() => setShowAuth(true)}
          onExplore={() => setShowFeatures(v => !v)}
        />
      </BubbleContainer>
      {showAuth && <AuthBubbles onClose={() => setShowAuth(false)} />}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    background: '#0a0a0f',
  },
  background: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(135deg,
      #0a0a0f 0%,
      rgba(124,58,237,0.08) 25%,
      rgba(6,182,212,0.08) 50%,
      rgba(168,85,247,0.08) 75%,
      #0a0a0f 100%)`,
    pointerEvents: 'none',
  },
};

export default Welcome;
