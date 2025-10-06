// store.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (userObj) => set({ user: userObj }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // key in localStorage
    }
  )
)

export default useStore
