import PodcastsAdmin from "../pages/admin/PodcastsAdmin";
import React from 'react';
import VideosAdmin from "../pages/admin/VideosAdmin";

export const MEDIA_LOGOS = [
    {
        logoMin: require("../assets/logos/cosyCorner/cosyCornerSmall.png"),
        name: "Le Cosy Corner",
    },
    {
        name: "Silence on joue !",
        logoMin: require("../assets/logos/silenceOnJoue/silenceOnJoueMini.png"),
    },
    {
        name: "ZQSD",
        logoMin: require("../assets/logos/zqsd/zqsdMin.png"),
    },
    {
        name: "Gamekult Jeux Vidéo",
        logoMin: require("../assets/logos/gamekult/gamekultMin.png"),
    },
    {
        name: "Fin Du Game",
        logoMin: require("../assets/logos/finDuGame/finDuGameMin.png"),
    },
    {
        name: "Quick Load, le podcast qui met des tartes graphiques",
        logoMin: require("../assets/logos/quickload/quickloadMin.png"),
    }
];
//
// const VIDEOS = [
//     {
//         dataLabel: "gameMakerToolkit",
//         name: "Game Maker Toolkit",
//         author: "Mark Brown",
//         logo: require("../assets/logos/gameMakerToolkit/gameMakerToolkitFull.jpg"),
//         logoMin: require("../assets/logos/gameMakerToolkit/gameMakerToolkitMin.png"),
//         app: "youtube",
//     },
//     {
//         dataLabel: "exServ",
//         name: "Ex Serv",
//         author: "Ex Serv",
//         logo: require("../assets/logos/exServ/exServFull.jpg"),
//         logoMin: require("../assets/logos/exServ/exServMin.jpg"),
//         app: "youtube",
//     }
// ];

export const MEDIA_TYPES = [
    {
        name: "Podcasts",
        route: "/admin/podcasts",
        logo: require("../assets/logos/mediaTypes/podcasts.jpg"),
        logoMin: require("../assets/logos/mediaTypes/podcastsMin.png"),
        component: PodcastsAdmin,
        dataLabel: "podcast",
        ref: React.createRef()
    },
    {
        name: "Vidéos",
        route: "/admin/videos",
        logo: require("../assets/logos/mediaTypes/videos.jpg"),
        logoMin: require("../assets/logos/mediaTypes/videosMin.png"),
        component: VideosAdmin,
        dataLabel: "video",
        ref: React.createRef()
    }
];