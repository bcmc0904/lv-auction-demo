import {dateTimeFormat, numberFormat} from '@/utils/helper';
import Link from 'next/link';
import Countdown from '@/components/system/countdown';
import {useState} from 'react';

export default function AuctionTeaser({data}: {data: any}) {
  const [update, setUpdate] = useState<number>(0)
  const renderAuctionTime = (data: any) => {
    const now = Math.floor(new Date().getTime() / 1000)

    if (now < data.startTime) {
      return <div className="auction-time">
        <div>Đấu giá bắt đầu sau</div>
        <div className="couter">
          <Countdown time={(data.startTime - now)} callback={() => { setUpdate(update + 1)}}/>
        </div>
      </div>
    }

    if (now <= data.endTime) {
      return <div className="auction-time">
        <div>Đấu giá kết thúc sau</div>
        <div className="couter">
          <Countdown time={(data.endTime - now)} callback={() => { setUpdate(update + 1)}}/>
        </div>
      </div>
    }

    return <div className="auction-time">
      <div className={'text-red-400 font-bold'}>Đấu giá đã kết thúc</div>
    </div>
  }

  return <Link href={`/auction/${data._id}`}>
    <div className="auction-teaser flex flex-col gap-1 box" key={update}>
      <h2 className="title">
        {data._id}
      </h2>
      <div className={'info'}>
        {
          renderAuctionTime(data)
        }
      </div>
      <div className={'flex flex-row gap-2'}>
        <span>Thời gian bắt đầu:</span>
        <span>{dateTimeFormat(data.startTime)}</span>
      </div>
      <div className={'flex flex-row gap-2'}>
        <span>Thời gian kết thúc:</span>
        <span>{dateTimeFormat(data.endTime)}</span>
      </div>
      <div className="flex flex-row gap-2">
        <span>Giá khởi điểm:</span>
        <strong className={'text-orange-500'}>{numberFormat(data.priceStarting, true)}</strong>
      </div>
      <div className="flex flex-row gap-2">
        <span>Bước giá:</span>
        <strong className={'text-orange-400'}>{numberFormat(data.priceStep, true)}</strong>
      </div>
      <div className={'text-right'}>
        <small className={'underline font-light'}>{`Chi tiết >>`}</small>
      </div>
    </div>
  </Link>
}
