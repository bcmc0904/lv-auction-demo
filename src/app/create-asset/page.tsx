'use client'

import {post} from '@/utils/data';

export default function CreateAsset() {
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    let data: any = {}
    const formData = new FormData(e.target)
    data['assetCode'] = formData.get('assetCode')
    data['priceStarting'] = formData.get('priceStarting')
    data['priceStep'] = formData.get('priceStep')
    // @ts-ignore
    data['startTime'] = Math.floor(new Date(formData.get('startTime')).getTime() / 1000)
    // @ts-ignore
    data['endTime'] = Math.floor(new Date(formData.get('endTime')).getTime() / 1000)

    const result = await post('/auctions/create_session', data)
    if (result.status) {
      // @ts-ignore
      const goToDetails = confirm(`Tạo thành công phiên đấu có ID: ${result.docs._id}. Đi đến trang chi tiết.`)
      if (goToDetails) {
        // @ts-ignore
        return window.location.pathname = `/auction/${result.docs._id}`
      }
      window.location.reload()
    }
  }
  return <div>
    <h1 className="text-center">Tạo phiên đấu giá</h1>
    <form onSubmit={handleSubmit} className="box mx-auto max-w-md flex flex-col gap-2">
      <div className="form-item">
        <small>Mã tài sản</small>
        <div>
          <input required type="text" name="assetCode" className="form-control"/>
        </div>
      </div>
      <div className="form-item">
        <small>Giá khởi điểm</small>
        <div>
          <input required type="number" name="priceStarting" className="form-control" min={1}/>
        </div>
      </div>
      <div className="form-item">
        <small>Bước giá</small>
        <div>
          <input required type="number" name="priceStep" className="form-control" min={1}/>
        </div>
      </div>
      <div className="form-item">
        <small>Thời gian bắt đầu</small>
        <div>
          <input required type="datetime-local" name="startTime" className="form-control"/>
        </div>
      </div>
      <div className="form-item">
        <small>Thời gian kết thúc</small>
        <div>
          <input required type="datetime-local" name="endTime" className="form-control"/>
        </div>
      </div>
      <div className="form-item">
        <button className="form-control text-white bg-red-500 hover:bg-red-950 transition-all" type="submit">Save</button>
      </div>
    </form>
  </div>
}
