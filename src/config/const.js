import React from 'react';

export const MEDIA_TYPES = [
    {
        name: "Podcasts",
        creator: "Podcast",
        emoji: "🎙️",
        route: "/admin/podcasts",
        dataLabel: "podcast",
        ref: React.createRef()
    },
    {
        name: "Vidéos",
        creator: "Vidéaste",
        emoji: "🎥",
        route: "/admin/videos",
        dataLabel: "video",
        ref: React.createRef()
    }
];

export const NAV_ROUTES = [
    {
        path: "/",
        name: "Jeux"
    },
    {
        path: "/media",
        name: "Médias"
    }
]