import React from 'react';

export const MEDIA_LOGOS = [
    //PODCASTS
    {
        logoMin: require("../assets/logos/medias/cosyCorner.png"),
        name: "Le Cosy Corner",
    },
    {
        name: "Silence on joue !",
        logoMin: require("../assets/logos/medias/silenceOnJoue.png"),
    },
    {
        name: "ZQSD",
        logoMin: require("../assets/logos/medias/zqsd.png"),
    },
    {
        name: "Gamekult",
        logoMin: require("../assets/logos/medias/gamekult.png"),
    },
    {
        name: "Fin Du Game",
        logoMin: require("../assets/logos/medias/finDuGame.png"),
    },
    {
        name: "Quick Load",
        logoMin: require("../assets/logos/medias/quickload.png"),
    },
    //VIDEOS
    {
        name: "Ex Serv",
        logoMin: require("../assets/logos/medias/exServ.jpg")
    },
    {
        name: "Game Next Door",
        logoMin: require("../assets/logos/medias/gameNextDoor.png")
    },
    {
        name: "GK Live",
        logoMin: require("../assets/logos/medias/gkLive.png")
    },
    {
        name: "Osmosis",
        logoMin: require("../assets/logos/medias/osmosis.jpg")
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
        dataLabel: "podcast",
        ref: React.createRef()
    },
    {
        name: "Vidéos",
        route: "/admin/videos",
        logo: require("../assets/logos/mediaTypes/videos.jpg"),
        logoMin: require("../assets/logos/mediaTypes/videosMin.png"),
        dataLabel: "video",
        ref: React.createRef()
    }
];