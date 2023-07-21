'use client'

import {useEffect, useState} from 'react';
import {post} from '@/utils/data';
import Loading from '@/components/system/loading';
import {dateTimeFormat, numberFormat} from '@/utils/helper';
import BidTeaser from '@/components/entity/bid-teaser';
import Countdown from '@/components/system/countdown';
import {useAuths} from '@/context/useAuths';

export default function AuctionDetails({params}: {params: {id: string}}) {
  const [loading, setLoading] = useState<boolean>(true)
  const [update, setUpdate] = useState<number>(0)
  const [data, setData] = useState<any>(null)
  const [bidPrice, setBidPrice] = useState<number>(0)
  const [curTopPrice, setCurTopPrice] = useState<number>(0)
  const [curUserTopPrice, setCurUserTopPrice] = useState<number>(0)
  const [userDenied, setUserDenied] = useState<boolean>(false)
  const [userWon, setUserWon] = useState<boolean>(false)
  const [userFinalizeBid, setUserFinalizeBid] = useState<boolean>(false)
  const {auctions, user, getAllAuctions} = useAuths()
  const getData = async () => {
    if (!auctions || !auctions.length) return

    const result = auctions.find((item: any) => item._id === params.id)

    if (!result) return

    setData(result)
    let max = 0
    const actions = result.actions.sort((a: any, b: any) => new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime() ? -1 : 1);

    actions.map((item: any, index: number) => {
        if (item.type === 'make_bid') {
          if (!(actions[index - 1] && actions[index - 1].user._id === item.user._id && actions[index - 1].type === 'deny_bid')) {
            if (item.price > max) max = item.price
          }
        }
      })
    if (!bidPrice || bidPrice <= max) setBidPrice(Math.max(max, result.priceStarting) + result.priceStep)
    setCurTopPrice(max)
    setLoading(false)
  }

  const getUserData = () => {
    if (!user || !data) return
    const userActions = data.actions
      .filter((item: any) => item.user._id === user._id)
      .sort((a: any, b: any) => new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime() ? -1 : 1)
    let max = 0
    let hasDenyBid = false
    let hasFinalizeBid = false
    userActions.map((item: any) => {
      if (item.type === 'make_bid' && item.price > max) max = item.price
      if (item.type === 'deny_bid') {
        hasDenyBid = true
      }
      if (item.type === 'finalize_bid') {
        hasFinalizeBid = true
      }
    })
    setUserDenied(hasDenyBid)
    setUserFinalizeBid(hasFinalizeBid)
    setCurUserTopPrice(max)
    const now = Math.floor(new Date().getTime() / 1000)
    const won = !hasDenyBid && max === curTopPrice && data.endTime < now
    setUserWon(won)
  }

  const toggleBidPrice = (inc: boolean = true) => {
    if (inc) {
      setBidPrice(bidPrice + data.priceStep)
    }
    else {
      const newPrice = Math.max(
        bidPrice - data.priceStep,
        Math.max(data.priceStarting + data.priceStep, curUserTopPrice + data.priceStep)
      )
      setBidPrice(newPrice)
    }
  }

  const bidPriceToTop = () => {
    setBidPrice(Math.max(curTopPrice, data.priceStarting) + data.priceStep)
  }

  const renderActionHistories = (histories: Array<any>) => {
    const tmp = histories.sort((a: any, b: any) => new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1)
    return tmp.map((item: any, index: number) => <BidTeaser
      key={index}
      auctionId={data._id}
      startTime={data.startTime}
      endTime={data.endTime}
      order={index + 1}
      {...item}
      loading={loading}
      handleDeny={handleDeny}
    />)
  }

  const validDate = () => {
    const now = Math.floor(new Date().getTime() / 1000)
    if (user && userDenied) {
      return false
    }
    return data.startTime <= now && data.endTime >= now
  }

  const handleAuction = async () => {
    if (!validDate()) {
      alert('Dau gia ket thuc roi!')
      return
    }

    if (!bidPrice || bidPrice < curTopPrice + data.priceStep || bidPrice < data.priceStep + data.priceStarting) {
      alert('Giá không hợp lệ!')
      return
    }

    setLoading(true)
    const result = await post(`/auctions/make_bid`, {
      auctionId: data._id,
      userId: user._id,
      priceBid: bidPrice
    })
    if (result.status) {
      alert(`Xác nhận bạn đã trả ${numberFormat(bidPrice, true)}!`)
      await getAllAuctions()
    }
    else {
      alert('Something wrong.')
    }
    setLoading(false)
  }

  const handlefinalizeBid = async () => {
    setLoading(true)
    const result = await post(`/auctions/finalize_bid`, {
      auctionId: data._id,
      userId: user._id
    })
    if (result.status) {
      alert('Xác nhận thành công.')
      await getAllAuctions()
    }
    else {
      alert('Something wrong.')
    }
    setLoading(false)
  }

  const handleDeny = async () => {
    setLoading(true)
    const confirmed = confirm('Bạn có chắc chắn rút lại giá đã trả?')
    if (!confirmed) {
      setLoading(false)
      return
    }

    const result = await post('/auctions/deny_bid', {
      auctionId: data._id,
      userId: user._id
    })

    if (result.status) {
      alert('Success')
      await getAllAuctions()
    }
    else {
      alert('Something wrong')
    }
    setLoading(false)
  }

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

  const renderBidAction = () => {
    if (userWon) {
      return <div className="flex flex-col gap-4">
        <div className="text-green-500 text-center">
          <strong>Chúc mừng. Bạn là người chiến thắng</strong>
        </div>
        {
          userFinalizeBid ? ''
            :
            <div className="flex gap-4 items-center justify-center">
              <button
                onClick={handleDeny}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >Huỷ kết quả</button>
              <button
                onClick={handlefinalizeBid}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >Nhận sản phẩm</button>
            </div>
        }
      </div>
    }

    return <div className="flex justify-between items-center bid-action">
      <div className="input-wrapper">
        <div className="input">
          <button
            disabled={!validDate() || loading}
            onClick={() => {
              toggleBidPrice(false)
            }}
          >-
          </button>
          <span className="value">{bidPrice ? numberFormat(bidPrice) : 0}</span>
          <button
            disabled={!validDate() || loading}
            onClick={() => {
              toggleBidPrice(true)
            }}
          >+
          </button>
        </div>
        <div>
          <button
            disabled={!validDate() || loading}
            onClick={bidPriceToTop}
          >Đặt giá cao hơn mức giá cao nhất 01 (một) bước giá
          </button>
        </div>
      </div>
      <div className="btns">
        <button
          disabled={!validDate() || loading}
          onClick={handleAuction}
        >
          {
            loading ?
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                   viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"/>
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"/>
              </svg>
              :
              <svg className="svg-inline--fa fa-gavel" aria-hidden="true" focusable="false" data-prefix="fas"
                   data-icon="gavel" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                   data-fa-i2svg="">
                <path fill="currentColor"
                      d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z"></path>
              </svg>
          }
          <span>Trả giá</span>
        </button>
      </div>
    </div>
  }

  useEffect(() => {
    getData()
  }, [auctions, update])

  useEffect(() => {
    getUserData()
  }, [data, user?._id, update])

  if (!data) return <div className="mt-8">
    <h1>All Auction</h1>
    <div className="flex justify-center">
      <Loading/>
    </div>
  </div>

  return <div className="mt-8 mb-6">
    <h1>Auction {params.id}</h1>
    <div className="auction-item" key={update}>
      <div className="flex gap-2 flex-wrap auction-info">
        <div className="flex gap-4 flex-col box">
          <h3>Thông tin phiên đấu giá</h3>
          <div className={'info'}>
            <span>Mã phiên đấu giá</span>
            <span>{data._id}</span>
          </div>
          <div className={'info'}>
            <span>Thời gian bắt đầu</span>
            <span>{dateTimeFormat(data.startTime)}</span>
          </div>
          <div className={'info'}>
            <span>Thời gian kết thúc</span>
            <span>{dateTimeFormat(data.endTime)}</span>
          </div>
          <div className={'info'}>
            <span>Giá khởi điểm</span>
            <strong className={'text-orange-500'}>{numberFormat(data.priceStarting, true)}</strong>
          </div>
          <div className={'info'}>
            <span>Bước giá</span>
            <strong className={'text-orange-400'}>{numberFormat(data.priceStep, true)}</strong>
          </div>
        </div>
        <div className="actions box flex flex-col gap-4">
          <div className={'flex justify-between'}>
            <h3>Đặt giá (VNĐ)</h3>
            {
              user ?
                <div className={'login-as'} title={`id: ${user._id}`}>
                  Login as <strong>{user.name}</strong>
                </div>
                :
                ''
            }
          </div>
          {renderAuctionTime(data)}
          <div className="flex justify-between">
            <span>Giá cao nhất hiện tại:</span> <strong className="text-green-500">{numberFormat(curTopPrice, true)}</strong>
          </div>
          <hr/>
          <div className="flex justify-between">
            <span>Giá cao nhất của bạn:</span> <strong className="text-orange-500">{numberFormat(curUserTopPrice, true)}</strong>
          </div>
          {
            userDenied ?
              <div className="text-center text-red-500">Bạn không có quyền đấu giá</div>
              :
              renderBidAction()
          }
        </div>
      </div>
      <div className="mt-6 bid-histories box">
        <h2>Lịch sử đấu giá</h2>
        <div className="table-wrapper">
          <table className="table">
            <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th>Người trả</th>
              <th>Giá</th>
              <th>Thời gian</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {
              renderActionHistories(data.actions)
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
}
