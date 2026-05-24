import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'
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
    if (!user) throw new Error('Not authenticated')
    await addDoc(collection(db, 'users', user.uid, 'goals'), {
      ...data,
      progress: 0,
      createdAt: serverTimestamp()
    })
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'goals', id), updates)
  }

  const deleteGoal = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'goals', id))
  }

  return { goals, loading, addGoal, updateGoal, deleteGoal }
}
