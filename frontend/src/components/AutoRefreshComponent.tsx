import { useState, useEffect } from "react";

const AutoRefreshComponent = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date()); // Updates time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <p>Current Time: {time.getTime()}</p>;
};

export default AutoRefreshComponent;