import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "./supabaseClient";
export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [session, setSession] = useState();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState();

  const value = {
    session,
    loading,
    event,
  };

  useEffect(() => {
    setSession(supabase.auth.session());
    setLoading(true);

    supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(false);
      setSession(session);
      setEvent(_event);
      setLoading(true);
    });
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
