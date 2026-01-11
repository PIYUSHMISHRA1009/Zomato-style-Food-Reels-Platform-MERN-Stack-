import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/profile.css'

const Profile = () => {
    const { id: partnerId } = useParams();
    const [partner, setPartner] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isSubscribed = true;

        async function fetchProfile() {
            setLoading(true);
            setError('');
            try {
                const endpoint = partnerId
                    ? `http://localhost:3000/api/food-partner/${partnerId}`
                    : 'http://localhost:3000/api/food-partner/me';

                const { data } = await axios.get(endpoint, {
                    withCredentials: !partnerId
                });

                if (!isSubscribed) return;
                setPartner(data.foodPartner || null);
                setFoodItems(data.foodItems || []);
            } catch (err) {
                if (!isSubscribed) return;
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                if (isSubscribed) setLoading(false);
            }
        }

        fetchProfile();

        return () => {
            isSubscribed = false;
        };
    }, [partnerId]);

    const formattedStats = useMemo(() => {
        const lastAdded = foodItems[0]?.createdAt
            ? new Date(foodItems[0].createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric'
            })
            : '—';

        return [
            { label: 'menu items', value: foodItems.length || 0 },
            { label: 'last added', value: lastAdded }
        ];
    }, [foodItems]);

    const initials = partner?.name?.trim()?.[0]?.toUpperCase() || 'F';
    const isOwnProfile = !partnerId;

    return (
        <div className="fp-store-page">
            {loading && <div className="fp-loading">Loading profile…</div>}
            {error && !loading && <div className="fp-error">{error}</div>}

            {!loading && !error && (
                <>
                    <section className="fp-hero">
                        <div className="fp-hero-bg" aria-hidden="true" />
                        <div className="fp-hero-content">
                            <div className="fp-identity">
                                <div className="fp-avatar" aria-label="business avatar">{initials}</div>
                                <div className="fp-meta">
                                    <p className="fp-kicker">Food partner store</p>
                                    <h1 className="fp-title">{partner?.name || 'Business name'}</h1>
                                    <p className="fp-subtitle">{partner?.address || 'Address not provided'}</p>
                                    <div className="fp-contact">
                                        {partner?.contactName && <span>{partner.contactName}</span>}
                                        {partner?.phone && <span>{partner.phone}</span>}
                                        {partner?.email && <span>{partner.email}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="fp-stats-row">
                                {formattedStats.map((s) => (
                                    <div className="fp-chip" key={s.label}>
                                        <div className="fp-chip-label">{s.label}</div>
                                        <div className="fp-chip-value">{s.value}</div>
                                    </div>
                                ))}
                                {isOwnProfile && (
                                    <Link className="fp-cta" to="/create-food">Add new dish</Link>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="fp-section">
                        <div className="fp-section-head">
                            <div>
                                <p className="fp-eyebrow">Menu showcase</p>
                                <h2 className="fp-section-title">Signature dishes</h2>
                            </div>
                            {isOwnProfile && (
                                <Link className="fp-cta ghost" to="/create-food">Upload video</Link>
                            )}
                        </div>

                        <div className="fp-grid">
                            {foodItems.length === 0 ? (
                                <div className="fp-empty">
                                    <p>No dishes yet.</p>
                                    {isOwnProfile && <Link className="fp-empty-link" to="/create-food">Add your first dish</Link>}
                                </div>
                            ) : (
                                foodItems.map((item) => (
                                    <article className="fp-card" key={item._id}>
                                        <div className="fp-card-media">
                                            <video
                                                src={item.video}
                                                muted
                                                playsInline
                                                controls
                                                preload="metadata"
                                            />
                                        </div>
                                        <div className="fp-card-body">
                                            <div className="fp-card-title">{item.name}</div>
                                            <p className="fp-card-desc">{item.description || 'No description provided'}</p>
                                            <div className="fp-card-actions">
                                                <a className="fp-card-link" href={item.video} target="_blank" rel="noreferrer">Open video</a>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}

export default Profile