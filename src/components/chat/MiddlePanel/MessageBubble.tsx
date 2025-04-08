'use client'
import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TMessage } from '@/types'
import { formatTime } from '@/utils/formatters'
import { Bug, User, Cloud, CloudSun, Sun, Droplets, Wind } from 'lucide-react'
import AgriPriceTemplate from '@/components/chat/MiddlePanel/AgriPriceTemplate'
import FarmingTechniqueTemplate from '@/components/chat/MiddlePanel/FarmingTechniqueTemplate'
import WeatherTemplate from './WeatherTemplate'

interface MessageBubbleProps {
  message: TMessage
}
const renderWeatherTemplate = (
  weatherData = {
    location: 'Hà Nội',
    date: 'Thứ Năm, 03/04/2025',
    time: '15:30',
    temperature: 27,
    condition: 'Mây rải rác',
    humidity: 75,
    windSpeed: 12,
    forecast: [
      { day: 'Thứ Sáu', temperature: 26, condition: 'cloudy' },
      { day: 'Thứ Bảy', temperature: 27, condition: 'partly_cloudy' },
      { day: 'Chủ Nhật', temperature: 28, condition: 'sunny' }
    ]
  }
) => {
  // Function to determine weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className='h-6 w-6 text-blue-200' />
      case 'partly_cloudy':
        return <CloudSun className='h-6 w-6 text-blue-100' />
      case 'cloudy':
        return <Cloud className='h-6 w-6 text-blue-100' />
      case 'rainy':
        return <Droplets className='h-6 w-6 text-blue-100' />
      case 'windy':
        return <Wind className='h-6 w-6 text-blue-100' />
      default:
        return <CloudSun className='h-6 w-6 text-blue-100' />
    }
  }

  // Get main weather icon
  const getMainWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className='h-12 w-12 text-blue-100' />
      case 'partly_cloudy':
        return <CloudSun className='h-12 w-12 text-blue-100' />
      case 'cloudy':
        return <Cloud className='h-12 w-12 text-blue-100' />
      case 'rainy':
        return <Droplets className='h-12 w-12 text-blue-100' />
      case 'windy':
        return <Wind className='h-12 w-12 text-blue-100' />
      default:
        return <CloudSun className='h-12 w-12 text-blue-100' />
    }
  }

  // Determine main condition icon
  const mainConditionType = weatherData.condition?.toLowerCase().includes('mây')
    ? 'partly_cloudy'
    : weatherData.condition?.toLowerCase().includes('mưa')
      ? 'rainy'
      : weatherData.condition?.toLowerCase().includes('nắng')
        ? 'sunny'
        : 'partly_cloudy'

  return (
    <div className='animate-fade-in w-full max-w-lg overflow-hidden'>
      <div className='rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl'>
        <div className='mb-4 flex items-start justify-between'>
          <div>
            <h3 className='text-2xl font-bold'>{weatherData.location}</h3>
            <p className='text-sm opacity-90'>
              {weatherData.date} - {weatherData.time}
            </p>
          </div>
          <div className='animate-float text-5xl'>{getMainWeatherIcon(mainConditionType)}</div>
        </div>
        <div className='my-8 flex flex-col items-center'>
          <span className='mb-2 text-6xl font-bold'>{weatherData.temperature}°C</span>
          <span className='text-xl'>{weatherData.condition}</span>
        </div>
        <div className='mb-6 flex justify-around'>
          <div className='flex items-center'>
            <Droplets className='mr-2 h-5 w-5 text-blue-100' />
            <span>Độ ẩm: {weatherData.humidity}%</span>
          </div>
          <div className='flex items-center'>
            <Wind className='mr-2 h-5 w-5 text-blue-100' />
            <span>Gió: {weatherData.windSpeed} km/h</span>
          </div>
        </div>
        <div className='mt-4 grid grid-cols-3 gap-3'>
          {weatherData.forecast.map((day, index) => (
            <div
              key={index}
              className='rounded-lg bg-white/20 p-3 text-center shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:transform hover:bg-white/30'
            >
              <p className='text-sm font-medium'>{day.day}</p>
              <div className='my-2 flex justify-center'>{getWeatherIcon(day.condition)}</div>
              <p className='font-bold'>{day.temperature}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isWeatherData, setIsWeatherData] = useState(false)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [isAgriPriceData, setIsAgriPriceData] = useState(false)
  const [agriPriceData, setAgriPriceData] = useState<any>(null)
  const [isFarmingTechniqueData, setIsFarmingTechniqueData] = useState(false)
  const [farmingTechniqueData, setFarmingTechniqueData] = useState<any>(null)
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    if (message.sender === 'ai') {
      // Check for weather template markers
      const weatherRegex = /<WEATHER_DATA>([\s\S]*?)<\/WEATHER_DATA>/
      const weatherMatch = message.text.match(weatherRegex)

      // Check for agricultural price template markers
      const agriPriceRegex = /<AGRI_PRICE_DATA>([\s\S]*?)<\/AGRI_PRICE_DATA>/
      const agriPriceMatch = message.text.match(agriPriceRegex)

      // Check for farming technique template markers
      const farmingTechniqueRegex = /<FARMING_TECHNIQUE>([\s\S]*?)<\/FARMING_TECHNIQUE>/
      const farmingTechniqueMatch = message.text.match(farmingTechniqueRegex)

      let cleanedText = message.text

      if (weatherMatch && weatherMatch[1]) {
        try {
          // Extract the JSON data
          const jsonData = weatherMatch[1].trim()
          const parsedData = JSON.parse(jsonData)

          // Valid weather data
          setIsWeatherData(true)
          setWeatherData(parsedData)

          // Remove the weather template markers
          cleanedText = cleanedText.replace(weatherRegex, '').trim()
        } catch (error) {
          console.error('Failed to parse weather data:', error)
        }
      } else {
        setIsWeatherData(false)
        setWeatherData(null)
      }

      if (agriPriceMatch && agriPriceMatch[1]) {
        try {
          // Extract the JSON data
          const jsonData = agriPriceMatch[1].trim()
          const parsedData = JSON.parse(jsonData)

          // Valid agricultural price data
          setIsAgriPriceData(true)
          setAgriPriceData(parsedData)

          // Remove the agri price template markers
          cleanedText = cleanedText.replace(agriPriceRegex, '').trim()
        } catch (error) {
          console.error('Failed to parse agricultural price data:', error)
        }
      } else {
        setIsAgriPriceData(false)
        setAgriPriceData(null)
      }

      if (farmingTechniqueMatch && farmingTechniqueMatch[1]) {
        try {
          // Extract the JSON data
          const jsonData = farmingTechniqueMatch[1].trim()
          const parsedData = JSON.parse(jsonData)

          // Valid farming technique data
          setIsFarmingTechniqueData(true)
          setFarmingTechniqueData(parsedData)

          // Remove the farming technique template markers
          cleanedText = cleanedText.replace(farmingTechniqueRegex, '').trim()
        } catch (error) {
          console.error('Failed to parse farming technique data:', error)
        }
      } else {
        setIsFarmingTechniqueData(false)
        setFarmingTechniqueData(null)
      }

      setDisplayText(cleanedText)
    } else {
      // Not AI message
      setIsWeatherData(false)
      setWeatherData(null)
      setIsAgriPriceData(false)
      setAgriPriceData(null)
      setIsFarmingTechniqueData(false)
      setFarmingTechniqueData(null)
      setDisplayText(message.text)
    }
  }, [message.text, message.sender])

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex w-full max-w-[90%] gap-2 lg:max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
        {message.sender === 'ai' && (
          <Avatar className='mt-1 h-8 w-8 bg-gradient-to-r from-amber-500 to-yellow-400 shadow-md ring-1 ring-amber-300'>
            <AvatarImage
              src='https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish'
              alt='Đom Đóm AI'
              className='object-cover'
            />
            <AvatarFallback className='bg-gradient-to-r from-amber-500 to-yellow-400'>
              <Bug className='text-xs text-white' />
            </AvatarFallback>
          </Avatar>
        )}

        {message.sender === 'user' ? (
          <div
            className={`rounded-2xl p-3 shadow-sm ${
              message.sender === 'user' ? 'bg-amber-600 text-white hover:bg-amber-700' : 'border border-amber-200 bg-white text-gray-800 hover:border-amber-300'
            } transition-colors duration-200`}
          >
            <p className='leading-relaxed'>{message.text}</p>
            <div className={`mt-1 text-xs ${message.sender === 'user' ? 'text-amber-100' : 'text-gray-500'}`}>{formatTime(message.timestamp)}</div>
          </div>
        ) : (
          <div className={`rounded-2xl border border-amber-200 bg-white p-3 text-gray-800 shadow-sm transition-colors duration-200 hover:border-amber-300`}>
            <p className='leading-relaxed'>{displayText}</p>
            {isWeatherData && weatherData && <div className='mt-3 w-full'>{<WeatherTemplate weatherData={weatherData} />}</div>}
            {isAgriPriceData && agriPriceData && (
              <div className='mt-3 w-full'>
                <AgriPriceTemplate priceData={agriPriceData} />
              </div>
            )}
            {isFarmingTechniqueData && (
              <div className='mt-3 w-full'>
                <FarmingTechniqueTemplate techniqueData={farmingTechniqueData} isLoading={!farmingTechniqueData} />
              </div>
            )}
            <div className={`mt-1 text-xs text-gray-500`}>{formatTime(message.timestamp)}</div>
          </div>
        )}

        {message.sender === 'user' && (
          <Avatar className='mt-1 h-8 w-8 shadow-md ring-1 ring-green-300'>
            <AvatarImage
              src='https://readdy.ai/api/search-image?query=Portrait of a Vietnamese farmer in his 40s, wearing a traditional conical hat, with a weathered face showing experience and wisdom, standing in a lush green rice field during golden hour, with mountains in the background&width=100&height=100&seq=2&orientation=squarish'
              alt='Anh Tuấn'
              className='object-cover'
            />
            <AvatarFallback className='bg-green-100 text-green-700'>
              <User className='text-xs text-green-700' />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}
