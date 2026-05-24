import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // CRITICAL: Handle redirect result first
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          console.log('Redirect result user:', result.user.uid)
          // Create user doc if needed
          const userRef = doc(db, 'users', result.user.uid)
          const snap = await getDoc(userRef)
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              createdAt: serverTimestamp(),
              level: 1,
              xp: 0,
              streak: 0,
            })
            console.log('Redirect user document created in Firestore')
          }
        }
      })
      .catch((err) => console.error('Redirect result error:', err))

    // Then listen for auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid || 'null')
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <p className="text-sm font-bold text-violet-600">Loading HabitFlow...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

