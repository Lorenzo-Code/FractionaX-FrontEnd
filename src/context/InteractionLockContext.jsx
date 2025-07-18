import { createContext, useContext, useState } from "react";

const InteractionLockContext = createContext();

export const InteractionLockProvider = ({ children }) => {
  const [locked, setLocked] = useState(false);
  return (
    <InteractionLockContext.Provider value={{ locked, setLocked }}>
      {children}
    </InteractionLockContext.Provider>
  );
};

export const useInteractionLock = () => useContext(InteractionLockContext);
