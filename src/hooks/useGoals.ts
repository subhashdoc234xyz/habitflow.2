import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export interface Goal {
  id: string
  title: string
  description?: string
  category: string
  targetDate: string
  progress: number
  milestones: { id: string; title: string; completed: boolean }[]
  color: string
  createdAt: any
}

export const useGoals = () => {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setGoals([]); setLoading(false); return }
    const ref = collection(db, 'users', user.uid, 'goals')
    const q = query(ref, orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Goal[])
      setLoading(false)
    }, (err) => { console.error(err); setLoading(false) })
    return unsub
  }, [user])

  const addGoal = async (data: Omit<Goal, 'id' | 'createdAt' | 'progress'>) => {
    const uid = user?.uid || auth.currentUser?.uid
    console.log('[useGoals] addGoal called — uid:', uid)
    if (!uid) throw new Error('Not authenticated — please sign in again')
    try {
      await addDoc(collection(db, 'users', uid, 'goals'), {
        ...data,
        progress: 0,
        createdAt: serverTimestamp()
      })
    } catch (err: any) {
      console.error('[useGoals] Error adding goal:', err)
      if (err.code === 'permission-denied') {
        console.error('[useGoals] PERMISSION DENIED — Firestore rules may be blocking. Check Firebase Console.')
      }
      throw err
    }
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'goals', id), updates)
  }

  const deleteGoal = async (id: string) => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) return
    await deleteDoc(doc(db, 'users', uid, 'goals', id))
  }

  return { goals, loading, addGoal, updateGoal, deleteGoal }
}
