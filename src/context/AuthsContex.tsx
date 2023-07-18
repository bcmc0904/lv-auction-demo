'use client'

import {createContext, ReactNode, useEffect, useState} from 'react';
import {get} from '@/utils/data';
import Loading from '@/components/system/loading';

export type Props = {
  children: ReactNode,
}

export type ContextValue = {
  ready: boolean;
  user: any;
  users: Array<any>;
  auctions: Array<any>;
  [key: string]: any
}

export const AuthsContext = createContext<ContextValue>({} as ContextValue)

export const AuthsProvider = ({children}: Props) => {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any>([])
  const [ready, setReady] = useState<boolean>(false)
  const [auctions, setAuctions] = useState<any>([])

  const getAllAuctions = async () => {
    const result = await get('/auctions/get_all')
    if (result.status) {
      setAuctions(result.docs)
    }
    setReady(true)
  }
  const getAllUsers = async () => {
    const result = await get('/users/get_all')
    if (result.status) {
      setUsers(result.docs)
    }
  }

  const initLogin = () => {
    if (!users || !users.length) return
    const userStorageId = localStorage.getItem('lv_auction_user_id')
    if (userStorageId) {
      let userData = users.find((item: any) => item._id === userStorageId)
      if (userData) {
        setUser(userData)
      }
      else {
        setUser(users[0])
      }
    }
    else {
      setUser(users[0])
    }
  }

  const setSelectedUserId = (id: string) => {
    let userData = users.find((item: any) => item._id === id)
    setUser(userData)
    localStorage.setItem('lv_auction_user_id', id)
  }

  useEffect(() => {
    const initData = async () => {
      await getAllUsers()
      await getAllAuctions()
    }
    initData()
  }, [])

  useEffect(() => {
    initLogin()
  }, [users])

  return <AuthsContext.Provider
    value={{
      ready,
      user,
      users,
      auctions,
      getAllAuctions,
      getAllUsers,
      setSelectedUserId
    }}>
    {
      !ready ?
        <main className="container mx-auto min-h-screen flex items-center justify-center">
          <Loading/>
        </main>
        :
        children
    }
  </AuthsContext.Provider>
}
