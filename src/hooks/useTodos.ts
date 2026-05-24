import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export interface Todo {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  category?: string
  dueDate?: string
  dueTime?: string
  createdAt: any
}

export const useTodos = () => {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setTodos([]); setLoading(false); return }
    const ref = collection(db, 'users', user.uid, 'todos')
    const q = query(ref, orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setTodos(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Todo[])
      setLoading(false)
    }, (err) => { console.error(err); setLoading(false) })
    return unsub
  }, [user])

  const addTodo = async (data: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    const uid = user?.uid || auth.currentUser?.uid
    console.log('[useTodos] addTodo called — uid:', uid)
    if (!uid) throw new Error('Not authenticated — please sign in again')
    try {
      await addDoc(collection(db, 'users', uid, 'todos'), {
        ...data,
        completed: false,
        createdAt: serverTimestamp()
      })
    } catch (err: any) {
      console.error('[useTodos] Error adding todo:', err)
      if (err.code === 'permission-denied') {
        console.error('[useTodos] PERMISSION DENIED — Firestore rules may be blocking. Check Firebase Console.')
      }
      throw err
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'todos', id), { completed })
  }

  const deleteTodo = async (id: string) => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) return
    await deleteDoc(doc(db, 'users', uid, 'todos', id))
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const uid = user?.uid || auth.currentUser?.uid
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'todos', id), updates)
  }

  return { todos, loading, addTodo, toggleTodo, deleteTodo, updateTodo }
}
