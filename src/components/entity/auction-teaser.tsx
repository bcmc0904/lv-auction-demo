import {dateTimeFormat, numberFormat} from '@/utils/helper';
import Link from 'next/link';

export default function AuctionTeaser({data}: {data: any}) {
  return <Link href={`/auction/${data._id}`}>
    <div className="auction-teaser flex flex-col gap-1 box">
      <h2 className="title">
        {data._id}
      </h2>
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
      <div className={'info'}>
        <span className={data.status === 'active' ? 'text-green-500' : 'text-red-500'}>{data.status}</span>
      </div>
      <div className={'text-right'}>
        <small className={'underline font-light'}>{`Chi tiết >>`}</small>
      </div>
    </div>
  </Link>
}
