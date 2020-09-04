import PodcastsAdmin from "../pages/admin/PodcastsAdmin";
import React from 'react';
import VideosAdmin from "../pages/admin/VideosAdmin";

const PODCASTS = [
    {
        dataLabel: "cosyCorner",
        name: "Le Cosy Corner",
        author: "À L'aise Blaze",
        logo: require("../assets/logos/cosyCorner/cosyCornerFull.jpg"),
        logoMin: require("../assets/logos/cosyCorner/cosyCornerSmall.png"),
        app: "spotify",
    },
    {
        dataLabel: "silenceOnJoue",
        name: "Silence On Joue",
        author: "Erwan Cario",
        logo: require("../assets/logos/silenceOnJoue/silenceOnJoueFull.jpg"),
        logoMin: require("../assets/logos/silenceOnJoue/silenceOnJoueMini.png"),
        app: "spotify"
    },
    {
        dataLabel: "zqsd",
        name: "ZQSD",
        author: "ZQSD",
        logo: require("../assets/logos/zqsd/zqsdFull.jpg"),
        logoMin: require("../assets/logos/zqsd/zqsdMin.png"),
        app: "soundcloud"
    },
    {
        dataLabel: "gamekult",
        name: "Gamekult",
        author: "Gamekult",
        logo: require("../assets/logos/gamekult/gamekultFull.jpg"),
        logoMin: require("../assets/logos/gamekult/gamekultMin.png"),
        app: "soundcloud"
    }
];

const VIDEOS = [
    {
        dataLabel: "gameMakerToolkit",
        name: "Game Maker Toolkit",
        author: "Mark Brown",
        logo: require("../assets/logos/gameMakerToolkit/gameMakerToolkitFull.jpg"),
        logoMin: require("../assets/logos/gameMakerToolkit/gameMakerToolkitMin.png"),
        app: "youtube",
    },
    {
        dataLabel: "exServ",
        name: "Ex Serv",
        author: "Ex Serv",
        logo: require("../assets/logos/exServ/exServFull.jpg"),
        logoMin: require("../assets/logos/exServ/exServMin.jpg"),
        app: "youtube",
    }
];

export const MEDIA_TYPES = [
    {
        name: "Podcasts",
        medias: PODCASTS,
        route: "/admin/podcasts",
        logo: require("../assets/logos/mediaTypes/podcasts.jpg"),
        logoMin: require("../assets/logos/mediaTypes/podcastsMin.png"),
        component: PodcastsAdmin,
        dataLabel: "podcasts",
        ref: React.createRef()
    },
    {
        name: "Vidéos",
        medias: VIDEOS,
        route: "/admin/videos",
        logo: require("../assets/logos/mediaTypes/videos.jpg"),
        logoMin: require("../assets/logos/mediaTypes/videosMin.png"),
        component: VideosAdmin,
        dataLabel: "videos",
        ref: React.createRef()
    }
]