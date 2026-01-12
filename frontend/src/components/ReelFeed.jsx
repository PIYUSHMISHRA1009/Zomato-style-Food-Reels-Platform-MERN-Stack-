import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Reusable feed for vertical reels
// Props:
// - items: Array of video items
// - onLike: (item) => void | Promise<void>
// - onSave: (item) => void | Promise<void>
// - emptyMessage: string
// - loading: boolean
// - activeTab: 'home' | 'saved'

const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = 'No videos yet.',
  loading = false,
  activeTab = 'home'
}) => {
  // Existing ref: stores video DOM elements
  const videoRefs = useRef(new Map())

  // NEW: stores watch start time per video (foodId -> timestamp)
  const watchStartTimeRef = useRef(new Map())

  /**
   * Send watch-duration event to backend
   * This is a SIDE EFFECT only — it must never break UI
   */
  const logWatchEvent = async (foodId, seconds) => {
    if (seconds < 1) return // ignore accidental/very short views

    try {
      await fetch('/api/events/watch', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          foodId,
          value: seconds
        })
      })
    } catch (err) {
      // Silent fail — UX must never break
      console.error('Watch event failed')
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return

          const foodId = video.dataset.foodid

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // START watch timer when reel becomes active
            watchStartTimeRef.current.set(foodId, Date.now())
            video.play().catch(() => {
              /* ignore autoplay errors */
            })
          } else {
            // STOP watch timer when reel leaves viewport
            const startTime = watchStartTimeRef.current.get(foodId)

            if (startTime) {
              const watchedSeconds =
                (Date.now() - startTime) / 1000

              watchStartTimeRef.current.delete(foodId)
              logWatchEvent(foodId, watchedSeconds)
            }

            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id)
      return
    }
    videoRefs.current.set(id, el)
  }

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {/* Skeleton loader */}
        {loading && (
          <div className="reel-skeleton">
            <div className="skeleton-video"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-text"></div>
              <div className="skeleton-line skeleton-text-short"></div>
            </div>
            <div className="skeleton-actions">
              <div className="skeleton-action"></div>
              <div className="skeleton-action"></div>
              <div className="skeleton-action"></div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <p className="empty-title">{emptyMessage}</p>
            <p className="empty-subtitle">
              Check back later for new content
            </p>
          </div>
        )}

        {items.map((item) => (
          <section key={item._id} className="reel" role="listitem">
            {/* VIDEO ELEMENT (UNCHANGED visually) */}
            <video
              ref={setVideoRef(item._id)}
              data-foodid={item._id} // NEW: used for watch tracking
              className="reel-video"
              src={item.video}
              muted
              playsInline
              loop
              preload="metadata"
            />

            <div className="reel-overlay">
              <div
                className="reel-overlay-gradient"
                aria-hidden="true"
              />

              {/* AI badge (visual only) */}
              <div className="reel-badge">
                <span className="badge-icon">✨</span>
                <span className="badge-text">Recommended</span>
              </div>

              {/* Action buttons */}
              <div className="reel-actions">
                <div className="reel-action-group">
                  <button
                    onClick={
                      onLike ? () => onLike(item) : undefined
                    }
                    className="reel-action"
                    aria-label="Like"
                  >
                    ❤️
                  </button>
                  <div className="reel-action__count">
                    {item.likeCount ??
                      item.likesCount ??
                      item.likes ??
                      0}
                  </div>
                </div>

                <div className="reel-action-group">
                  <button
                    className="reel-action"
                    onClick={
                      onSave ? () => onSave(item) : undefined
                    }
                    aria-label="Bookmark"
                  >
                    🔖
                  </button>
                  <div className="reel-action__count">
                    {item.savesCount ??
                      item.bookmarks ??
                      item.saves ??
                      0}
                  </div>
                </div>

                <div className="reel-action-group">
                  <button className="reel-action" aria-label="Comments">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</div>
                </div>
              </div>

              {/* Content */}
              <div className="reel-content">
                <h2 className="reel-title">
                  {item.name ||
                    item.foodName ||
                    'Delicious Food'}
                </h2>

                {item.foodPartner && (
                  <div className="reel-partner-info">
                    👨‍🍳 by Partner
                  </div>
                )}

                <p
                  className="reel-description"
                  title={item.description}
                >
                  {item.description}
                </p>

                {item.foodPartner && (
                  <Link
                    className="reel-btn"
                    to={'/food-partner/' + item.foodPartner}
                  >
                    Visit Store →
                  </Link>
                )}
              </div>

              {/* Bottom navigation moved outside each reel */}
            </div>
          </section>
        ))}
      </div>
      {/* Single fixed bottom navigation */}
      <nav className="reel-bottom-nav">
        <Link
          className={`reel-nav-item ${
            activeTab === 'home' ? 'is-active' : ''
          }`}
          to="/"
        >
          Home
        </Link>
        <Link
          className={`reel-nav-item ${
            activeTab === 'saved' ? 'is-active' : ''
          }`}
          to="/saved"
        >
          Saved
        </Link>
      </nav>
    </div>
  )
}

export default ReelFeed
