'use client'
import { ChatArea } from '@/components/chat/MiddlePanel/ChatArea'
import React from 'react'

const App: React.FC = () => {
  return (
    <div className='flex h-dvh bg-gray-100'>
      {/* Sidebar */}
      {/* <NavigationSidebar /> */}

      <div className='flex flex-1'>
        {/* Chat List Sidebar */}
        {/* <ChatSidebar messages={messages} weather={weather} /> */}
        {/* Main Chat Area */}
        <div className='flex flex-1 flex-col'>
          <ChatArea />
        </div>

        {/* Right Sidebar - Info Panel */}
        {/* <RightSidebar
          intimacyLevel={intimacyLevel}
          landPlots={landPlots}
          chartRef={chartRef as any}
          setCropDetailOpen={setCropDetailOpen}
          setSelectedCrop={setSelectedCrop}
          setSelectedPlot={setSelectedPlot}
        /> */}
      </div>
    </div>
  )
}

export default App
