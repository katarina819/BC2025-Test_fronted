import { createContext, useContext } from "react";

// Kreiraj kontekst
export const NotificationContext = createContext();

// Custom hook za lakši pristup
export const useNotification = () => useContext(NotificationContext);
