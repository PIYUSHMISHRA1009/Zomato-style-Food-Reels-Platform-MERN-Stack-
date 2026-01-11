import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed.jsx'

const Saved = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/food/save', { withCredentials: true })
      .then((res) => {
        const savedFoods = res?.data?.savedFoods || []
        const flattened = savedFoods
          .filter((entry) => entry?.food)
          .map((entry) => ({ ...entry.food, saved: true }))
        setItems(flattened)
      })
      .catch((err) => {
        console.error('Failed to fetch saved items', err)
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLike = async (item) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/food/like',
        { foodId: item._id },
        { withCredentials: true }
      )

      const isUnlike = String(res?.data?.message || '').toLowerCase().includes('unliked')

      setItems((prev) => prev.map((video) => {
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
        'http://localhost:3000/api/food/save',
        { foodId: item._id },
        { withCredentials: true }
      )

      const isUnsave = String(res?.data?.message || '').toLowerCase().includes('unsaved')

      if (isUnsave) {
        setItems((prev) => prev.filter((video) => video._id !== item._id))
        return
      }

      setItems((prev) => prev.map((video) => {
        if (video._id !== item._id) return video
        const delta = 1
        return { ...video, savesCount: Math.max(0, (video.savesCount || 0) + delta), saved: true }
      }))
    } catch (error) {
      console.error('Failed to save video', error)
    }
  }

  return (
    <ReelFeed
      items={items}
      loading={loading}
      activeTab="saved"
      onLike={handleLike}
      onSave={handleSave}
      emptyMessage="Nothing saved yet."
    />
  )
}

export default Saved
