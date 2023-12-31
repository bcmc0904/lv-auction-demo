'use client'

import Link from 'next/link';
import {useAuths} from '@/context/useAuths';

export default function Header() {
  const {user, users, setSelectedUserId} = useAuths()
  return <div className={'container mx-auto'}>
    <nav className={'py-4'}>
      <ul className={'menu flex items-center justify-center gap-4'}>
        <li>
          <Link href={'/'}>Các phiên đấu</Link>
        </li>
        <li>
          <Link href={'/create-asset'}>Tạo phiên đấu giá</Link>
        </li>
        <li>
          <div className={'switch-user'}>
            <span>Thay đổi user</span>
            <select
              value={user ? user._id : ''}
              onChange={(e: any) => {
                setSelectedUserId(e.target.value)
              }}
            >
              {
                users.map((item: any, index: number) => <option value={item._id} key={index}>{item.name}</option>)
              }
            </select>
          </div>
        </li>
      </ul>
    </nav>
  </div>
}
