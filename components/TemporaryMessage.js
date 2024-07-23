import React, { useState, useEffect } from 'react';

const TemporaryMessage = ({ message, duration = 3000, is_err = false }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]); // Dependency array ensures effect runs when `message` changes

  if (!visible) return null;

  return (
    <div className={`mt-4 p-2 rounded-lg ${is_err ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
      {message}
    </div>
  );
};

export default TemporaryMessage;
