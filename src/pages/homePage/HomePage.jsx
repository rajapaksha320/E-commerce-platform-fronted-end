import React from 'react'
import Header from '../../components/homePageComponents/header/Header'
import Shops from '../../components/homePageComponents/shops/Shops'
import BestItems from '../../components/homePageComponents/bestItems/BestItems'
import PopularShops from '../../components/homePageComponents/popularShops/PopularShops'
import SellWithUs from '../../components/homePageComponents/sellWithUs/SellWithUs'
const HomePage = () => {
  return (
    <div>
      <Header />
      <Shops />
      <BestItems />
      <PopularShops />
      <SellWithUs/>
    </div>
  )
}

export default HomePage