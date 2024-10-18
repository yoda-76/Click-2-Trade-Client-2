import React, { useState } from 'react'
import TabSelection from '../Info/TabSelection';
import TabContent from '../Info/TabContent';
import Mtm from '../Info/Mtm';


function info() {
  const [selectedTab, setSelectedTab] = useState<"positions"|"orders"|"trades"|"funds">("positions");   
  return (
    <div className='text-white flex flex-col'>
    <Mtm />
    <TabSelection selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
    <TabContent   selectedTab={selectedTab} />
    </div> 
  )
}

export default React.memo(info);
