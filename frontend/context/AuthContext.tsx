"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react";
import { clearAuthCookies, getAuthToken, getUserData } from "@/lib/cookie";
import { useRouter } from "next/navigation";

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: any;
    setUser: (user: any) => void;
    logout: () => Promise<void>;
    loading: boolean;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    const checkAuth = useCallback(async () => {
        try {
            const token = await getAuthToken();
            const userData = await getUserData();
            
            // Set user and authenticated BEFORE setting loading to false
            setUser(userData);
            setIsAuthenticated(!!token);
        } catch (err) {
            console.error("[AuthContext.checkAuth] Error:", err);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await clearAuthCookies();
            setIsAuthenticated(false);
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);



    const contextValue = useMemo(() => ({ 
        isAuthenticated, 
        setIsAuthenticated, 
        user, 
        setUser, 
        logout, 
        loading, 
        checkAuth 
    }), [isAuthenticated, user, loading, logout, checkAuth]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};