import { useState, useEffect } from 'react'
import './Weather.css'

const WEATHER_CACHE_KEY = 'tera_weather'
const CACHE_TTL = 30 * 60 * 1000 // 30 分钟

const ICON_MAP = {
  晴: '☀️',
  少云: '🌤️',
  晴间多云: '⛅',
  多云: '⛅',
  阴: '☁️',
  雨: '🌧️',
  小雨: '🌧️',
  中雨: '🌧️',
  大雨: '🌧️',
  暴雨: '⛈️',
  雷阵雨: '⛈️',
  雪: '❄️',
  小雪: '❄️',
  中雪: '❄️',
  大雪: '🌨️',
  雾: '🌫️',
  风: '💨',
  沙尘: '💨',
}

function getIcon(weather) {
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (weather.includes(key)) return icon
  }
  return '🌡️'
}

async function fetchWeather() {
  const cached = localStorage.getItem(WEATHER_CACHE_KEY)
  if (cached) {
    const data = JSON.parse(cached)
    if (Date.now() - data._ts < CACHE_TTL) {
      return data
    }
  }

  try {
    const res = await fetch('https://uapis.cn/api/v1/misc/weather')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const data = { ...json, _ts: Date.now() }
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(data))
    return data
  } catch {
    // 请求失败时返回缓存（即使过期）
    if (cached) return JSON.parse(cached)
    return null
  }
}

export default function Weather() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    const load = async () => {
      const result = await fetchWeather()
      if (alive) {
        setData(result)
        setLoading(false)
      }
    }

    load()
    const timer = setInterval(load, CACHE_TTL)

    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [])

  if (loading) return <span className="weather weather--loading" aria-label="加载天气中…" />

  if (!data) return null

  return (
    <span className="weather" title={`${data.weather} · ${data.wind_direction}${data.wind_power} · 湿度 ${data.humidity}%`}>
      <span className="weather__icon" aria-hidden="true">{getIcon(data.weather)}</span>
      <span className="weather__temp">{data.temperature}°</span>
      <span className="weather__desc">{data.weather}</span>
    </span>
  )
}
