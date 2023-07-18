'use client'

import {useAuths} from '@/context/useAuths';
import AuctionTeaser from '@/components/entity/auction-teaser';

export default function Home() {
  const {auctions} = useAuths()

  return <div className="mt-8 mb-6">
    <h1>All Auctions</h1>
    <div className="flex gap-4 flex-wrap">
      {
        auctions.map((item: any, index: number) => <AuctionTeaser key={index} data={item}/>)
      }
    </div>
  </div>
}
