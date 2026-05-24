import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export interface Habit {
  id: string
  name: string
  description?: string
  category: string
  color: string
  icon: string
  frequency: 'daily' | 'weekly'
  targetDays?: number[]
  streak: number
  bestStreak: number
  completedDates: string[]
  createdAt: any
  userId: string
}

export const useHabits = () => {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setHabits([])
      setLoading(false)
      return
    }

    const habitsRef = collection(db, 'users', user.uid, 'habits')
    const q = query(habitsRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Habit[]
        setHabits(habitsData)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Firestore error:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user])

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'userId' | 'streak' | 'bestStreak' | 'completedDates'>) => {
    const uid = user?.uid || auth.currentUser?.uid
    console.log('[useHabits] addHabit called — uid:', uid)
    if (!uid) throw new Error('User not authenticated — please sign in again')
    
    try {
      const habitsRef = collection(db, 'users', uid, 'habits')
      const docRef = await addDoc(habitsRef, {
        ...habitData,
        streak: 0,
        bestStreak: 0,
        completedDates: [],
        userId: uid,
        createdAt: serverTimestamp()
      })
      console.log('[useHabits] Habit added with ID:', docRef.id)
      return docRef.id
    } catch (err: any) {
      console.error('[useHabits] Error adding habit:', err)
      if (err.code === 'permission-denied') {
        console.error('[useHabits] PERMISSION DENIED — Firestore rules may be blocking. Check Firebase Console → Firestore → Rules')
      }
      throw err
    }
  }

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) throw new Error('User not authenticated — please sign in again')
    const habitRef = doc(db, 'users', uid, 'habits', habitId)
    await updateDoc(habitRef, updates)
  }

  const deleteHabit = async (habitId: string) => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) throw new Error('User not authenticated — please sign in again')
    const habitRef = doc(db, 'users', uid, 'habits', habitId)
    await deleteDoc(habitRef)
  }

  const toggleHabitComplete = async (habitId: string) => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) return
    const today = new Date().toISOString().split('T')[0]
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const completedDates = habit.completedDates || []
    const alreadyDone = completedDates.includes(today)
    const newDates = alreadyDone
      ? completedDates.filter(d => d !== today)
      : [...completedDates, today]

    let streak = 0
    const sorted = [...newDates].sort().reverse()
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date()
      expected.setDate(expected.getDate() - i)
      if (sorted[i] === expected.toISOString().split('T')[0]) {
        streak++
      } else break
    }

    await updateHabit(habitId, {
      completedDates: newDates,
      streak,
      bestStreak: Math.max(streak, habit.bestStreak || 0)
    })
  }

  return { habits, loading, error, addHabit, updateHabit, deleteHabit, toggleHabitComplete }
}
