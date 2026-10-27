
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function checkLogin() {
            try {
                const currentUser =
                    await authService.getCurrentUser();

                if (!cancelled) {
                    setUser(currentUser);
                    setAuthError(null);
                }
            } catch (error) {
                if (!cancelled) {
                    setAuthError(error.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        checkLogin();

        return () => {
            cancelled = true;
        };
    }, []);

    async function login(useremail, password) {
        const currentUser =
            await authService.login(useremail, password);

        setUser(currentUser);
        setAuthError(null);

        return currentUser;
    }

    async function logout() {
        await authService.logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                authError,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
