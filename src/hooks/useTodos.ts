import { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'
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
    if (!user) throw new Error('Not authenticated')
    await addDoc(collection(db, 'users', user.uid, 'todos'), {
      ...data,
      completed: false,
      createdAt: serverTimestamp()
    })
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'todos', id), { completed })
  }

  const deleteTodo = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'todos', id))
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'todos', id), updates)
  }

  return { todos, loading, addTodo, toggleTodo, deleteTodo, updateTodo }
}
