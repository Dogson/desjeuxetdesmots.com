import React from 'react';

export const MEDIA_TYPES = [
    {
        name: "Podcasts",
        emoji: "🎙️",
        route: "/admin/podcasts",
        dataLabel: "podcast",
        ref: React.createRef()
    },
    {
        name: "Vidéos",
        emoji: "🎥",
        route: "/admin/videos",
        dataLabel: "video",
        ref: React.createRef()
    }
];