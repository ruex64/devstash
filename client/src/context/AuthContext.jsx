import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import api from "../services/api";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC0o102y2bgUB0658ubtNZRJPCElcp4J5Q",
  authDomain: "devstash-ruex64.firebaseapp.com",
  projectId: "devstash-ruex64",
  storageBucket: "devstash-ruex64.firebasestorage.app",
  messagingSenderId: "239990395646",
  appId: "1:239990395646:web:34ca833aa3faa6aeb34baf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Create context
const AuthContext = createContext();

// ✅ THIS is what you're trying to import
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const firebaseToken = await res.user.getIdToken();

      const backendRes = await api.post("/auth/login", {
        token: firebaseToken,
      });

      setUser({
        ...backendRes.data.user,
        accessToken: backendRes.data.accessToken,
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setUser({ ...firebaseUser, token });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
