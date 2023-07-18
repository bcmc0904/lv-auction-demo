'use client'
import {useEffect, useState} from 'react';

export default function Countdown({time, callback}: {time: number, callback?: {(): any}}) {
  const [update, setUpdate] = useState<number>(Math.floor(time))

  const renderTime = () => {
    if (update <= 0) {
      return <>
        <div>
          <strong>0</strong>
          <small>Ngày</small>
        </div>
        <div>
          <strong>0</strong>
          <small>Giờ</small>
        </div>
        <div>
          <strong>0</strong>
          <small>Phút</small>
        </div>
        <div>
          <strong>0</strong>
          <small>Giây</small>
        </div>
      </>
    }

    const d = Math.floor(update / 86400)
    const h = Math.floor((update - d * 86400) / 3600)
    const m = Math.floor((update - d * 86400 - h * 3600) / 60)
    const s = Math.floor(update - d * 86400 - h * 3600 - m * 60)

    return <>
      <div>
        <strong>{d}</strong>
        <small>Ngày</small>
      </div>
      <div>
        <strong>{h}</strong>
        <small>Giờ</small>
      </div>
      <div>
        <strong>{m}</strong>
        <small>Phút</small>
      </div>
      <div>
        <strong>{s}</strong>
        <small>Giây</small>
      </div>
    </>
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (update <= 0) {
        if (typeof callback === 'function') {
          callback()
        }

        return
      }

      setUpdate(update - 1)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [update])

  return <div className={'flex items-center gap-2 countdown'}>
    {renderTime()}
  </div>
}
