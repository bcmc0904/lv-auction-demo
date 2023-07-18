import {numberFormat} from '@/utils/helper';
import moment from 'moment';
import {useAuths} from '@/context/useAuths';
import {useState} from 'react';
import {post} from '@/utils/data';

interface BidInterface {
  order: number
  type: string
  price: number
  user: {
    name: string
    [key: string]: any
  }
  [key: string]: any
}
export default function BidTeaser(props: BidInterface) {
  const {user, getAllAuctions} = useAuths()
  const [loading, setLoading] = useState<boolean>(false)
  const handleDeny = async () => {
    setLoading(true)
    const confirmed = confirm('Bạn có chắc chắn rút lại giá đã trả?')
    if (!confirmed) {
      setLoading(false)
      return
    }

    const result = await post('/auctions/deny_bid', {
      auctionId: props.auctionId,
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
  return <tr className={
    props.type === 'deny_bid' ?
      'line-through text-gray-400'
      :
      props.type === 'finalize_bid' ? 'text-green-500' : ''
    }>
    <td>{props.order}</td>
    <td>{props._id}<br/><small>{props.type}</small></td>
    <td>{props.user.name}</td>
    <td>{numberFormat(props.price, true)}</td>
    <td>{moment(props.createdAt).format('DD/MM/YYYY - HH:mm:ss.SSSS')}</td>
    <td className={'text-center'}>
      {
        props.order === 1 && user && props.user._id === user._id && props.type === 'make_bid' ?
          <button
            className={'text-red-400'}
            disabled={loading}
            onClick={handleDeny}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill={`rgb(248 113 113 / var(--tw-text-opacity))`} viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"></path></svg>
          </button>
          :
          ''
      }
    </td>
  </tr>
}
