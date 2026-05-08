import React from 'react';

const BubbleContainer = ({ children }) => (
  <div style={styles.container}>{children}</div>
);

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
};

export default BubbleContainer;
