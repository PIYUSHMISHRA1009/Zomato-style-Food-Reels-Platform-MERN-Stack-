import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed.jsx';


const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((response) => {
        console.log(response.data)
        setVideos(response.data.foodItems || [])
      })
      .catch((err) => {
        console.error("Failed to fetch videos", err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLike = async (item) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: item._id },
        { withCredentials: true }
      )

      const isUnlike = String(res?.data?.message || '').toLowerCase().includes('unliked')

      setVideos((prev) => prev.map((video) => {
        if (video._id !== item._id) return video
        const delta = isUnlike ? -1 : 1
        return { ...video, likeCount: Math.max(0, (video.likeCount || 0) + delta) }
      }))
    } catch (error) {
      console.error('Failed to like video', error)
    }
  }

  const handleSave = async (item) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      )

      const isUnsave = String(res?.data?.message || '').toLowerCase().includes('unsaved')

      setVideos((prev) => prev.map((video) => {
        if (video._id !== item._id) return video
        const delta = isUnsave ? -1 : 1
        return { ...video, savesCount: Math.max(0, (video.savesCount || 0) + delta), saved: !isUnsave }
      }))
    } catch (error) {
      console.error('Failed to save video', error)
    }
  }

  return (
    <ReelFeed
      items={videos}
      loading={loading}
      activeTab="home"
      onLike={handleLike}
      onSave={handleSave}
      emptyMessage="No videos available."
    />
  )
}

export default Home
