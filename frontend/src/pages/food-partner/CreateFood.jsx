import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/create-food.css";

const MAX_SIZE_MB = 40;
const MAX_DURATION_SECONDS = 90;

const getVideoDuration = (fileUrl) =>
    new Promise((resolve, reject) => {
        const videoEl = document.createElement("video");
        videoEl.preload = "metadata";
        videoEl.onloadedmetadata = () => resolve(videoEl.duration || 0);
        videoEl.onerror = () => reject(new Error("Unable to read video metadata."));
        videoEl.src = fileUrl;
    });

const CreateFood = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
        };
    }, [videoPreview]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            removeVideo();
            return;
        }

        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_SIZE_MB) {
            removeVideo(`Video is too large. Keep it under ${MAX_SIZE_MB} MB.`);
            event.target.value = "";
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        try {
            const duration = await getVideoDuration(previewUrl);
            if (duration > MAX_DURATION_SECONDS) {
                URL.revokeObjectURL(previewUrl);
                removeVideo(`Video is too long. Keep it under ${MAX_DURATION_SECONDS} seconds.`);
                event.target.value = "";
                return;
            }

            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoFile(file);
            setVideoPreview(previewUrl);
            setStatus("");
        } catch (error) {
            URL.revokeObjectURL(previewUrl);
            removeVideo("Could not read the video file. Try another clip.");
            event.target.value = "";
        }
    };

    const removeVideo = (message = "") => {
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoFile(null);
        setVideoPreview("");
        setStatus(message);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name.trim() || !formData.description.trim() || !videoFile) {
            setStatus("Fill name, description, and add a video to continue.");
            return;
        }

        const payload = new FormData();
        payload.append("name", formData.name.trim());
        payload.append("description", formData.description.trim());
        payload.append("video", videoFile);

        setIsSubmitting(true);
        setStatus("Uploading your dish...");

        try {
            const { data } = await axios.post("http://localhost:3000/api/food", payload, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });

            setStatus(data?.message || "Dish uploaded successfully.");
            setFormData({ name: "", description: "" });
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoFile(null);
            setVideoPreview("");
            navigate("/");
        } catch (error) {
            setStatus(error.response?.data?.message || "Upload failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearDraft = () => {
        removeVideo();
        setFormData({ name: "", description: "" });
        setStatus("");
    };

    return (
        <div className="create-food-page">
            <div className="create-food-shell">
                <header className="cf-hero">
                    <div className="cf-hero-text">
                        <p className="cf-kicker">Food Partner</p>
                        <h1 className="cf-title">Showcase a new dish</h1>
                        <p className="cf-subtitle">
                            Upload a short clip, name the dish, and add a flavorful description.
                            Keep it concise for mobile guests.
                        </p>
                    </div>
                    <div className="cf-hero-pill">
                        <span className="cf-pill-dot" />
                        Ready for vertical video
                    </div>
                </header>

                <form className="cf-form" onSubmit={handleSubmit}>
                    <div className="cf-fields">
                        <label className="cf-label" htmlFor="dishName">
                            Dish name
                            <span className="cf-optional">(required)</span>
                        </label>
                        <input
                            id="dishName"
                            name="name"
                            type="text"
                            placeholder="eg. Smoked Paneer Tikka Roll"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="cf-input"
                            maxLength={80}
                            autoComplete="off"
                        />
                    </div>

                    <div className="cf-fields">
                        <label className="cf-label" htmlFor="dishDescription">
                            Dish description
                            <span className="cf-helper">Add taste, spice level, and portion.</span>
                        </label>
                        <textarea
                            id="dishDescription"
                            name="description"
                            placeholder="Describe the flavors, portion size, and any pairing suggestions."
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="cf-input"
                            maxLength={240}
                        />
                        <div className="cf-hint">{formData.description.length}/240 characters</div>
                    </div>

                    <div className="cf-fields">
                        <div className="cf-label-row">
                            <label className="cf-label" htmlFor="dishVideo">
                                Dish video
                            </label>
                            <span className="cf-helper">MP4, MOV, or WebM · up to 90s</span>
                        </div>

                        <label className="cf-upload" htmlFor="dishVideo">
                            <div className="cf-upload-body">
                                {videoPreview ? (
                                    <video
                                        className="cf-video-preview"
                                        src={videoPreview}
                                        controls
                                        playsInline
                                    />
                                ) : (
                                    <div className="cf-upload-placeholder">
                                        <div className="cf-upload-icon" aria-hidden="true">
                                            <span className="cf-upload-glyph">VID</span>
                                        </div>
                                        <p className="cf-upload-title">Tap to add a video</p>
                                        <p className="cf-upload-text">Vertical clips look best on mobile.</p>
                                    </div>
                                )}
                            </div>
                            <input
                                id="dishVideo"
                                name="video"
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime"
                                onChange={handleFileChange}
                                className="cf-file-input"
                                disabled={isSubmitting}
                            />
                        </label>
                        {videoFile ? (
                            <div className="cf-file-meta">
                                <div>
                                    <p className="cf-file-name">{videoFile.name}</p>
                                    <p className="cf-file-size">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                                </div>
                                <button type="button" className="cf-reset" onClick={removeVideo} disabled={isSubmitting}>
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="cf-file-meta muted">No video selected yet</div>
                        )}
                    </div>

                    {status && <div className="cf-status" role="status">{status}</div>}

                    <div className="cf-actions">
                        <button type="button" className="cf-secondary" onClick={clearDraft} disabled={isSubmitting}>
                            Clear draft
                        </button>
                        <button type="submit" className="cf-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Uploading..." : "Save dish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;