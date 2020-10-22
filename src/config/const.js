import React from 'react';

export const MEDIA_LOGOS = [
    //PODCASTS
    {
        logoMin: require("../assets/logos/medias/cosyCorner.png"),
        name: "Le Cosy Corner",
        type: "podcast"
    },
    {
        name: "Silence on joue !",
        logoMin: require("../assets/logos/medias/silenceOnJoue.png"),
        type: "podcast"
    },
    {
        name: "Gamekult",
        logoMin: require("../assets/logos/medias/gamekult.png"),
        type: "podcast"
    },
    {
        name: "Fin Du Game",
        logoMin: require("../assets/logos/medias/finDuGame.png"),
        type: "podcast"
    },
    {
        name: "Quick Load",
        logoMin: require("../assets/logos/medias/quickload.png"),
        type: "podcast"
    },
    {
        name: "ZQSD",
        logoMin: require("../assets/logos/medias/zqsd.jpg"),
        type: "podcast"
    },
    {
        name: "After Hate",
        logoMin: require("../assets/logos/medias/afterHate.jpg"),
        type: "podcast"
    },
    {
        name: "Third Editions",
        logoMin: require("../assets/logos/medias/thirdEditions.jpg"),
        type: "podcast"
    },
    {
        name: "La Playade",
        logoMin: require("../assets/logos/medias/laPlayade.jpg"),
        type: "podcast"
    },
    {
        name: "Artefact",
        logoMin: require("../assets/logos/medias/artefact.jpg"),
        type: "podcast"
    },
    //VIDEOS
    {
        name: "Ex Serv",
        logoMin: require("../assets/logos/medias/exServ.jpg"),
        type: "video"
    },
    {
        name: "Game Next Door",
        logoMin: require("../assets/logos/medias/gameNextDoor.png"),
        type: "video"
    },
    {
        name: "GK Live",
        logoMin: require("../assets/logos/medias/gkLive.png"),
        type: "video"
    },
    {
        name: "Osmosis",
        logoMin: require("../assets/logos/medias/osmosis.jpg"),
        type: "video"
    },
    {
        name: "Doc Geraud",
        logoMin: require("../assets/logos/medias/docGeraud.jpg"),
        type: "video"
    },
    {
        name: "Olbius",
        logoMin: require("../assets/logos/medias/olbius.jpg"),
        type: "video"
    },
    {
        name: "Canard PC",
        logoMin: require("../assets/logos/medias/canardPC.jpg"),
        type: "video"
    },
    {
        name: "un bot pourrait faire ça",
        logoMin: require("../assets/logos/medias/unBotPourraitFaireCa.png"),
        type: "video"
    },
    {
        name: "Lys Sombreciel",
        logoMin: require("../assets/logos/medias/lysSombreciel.jpg"),
        type: "video"
    },
    {
        name: "Ludology",
        logoMin: require("../assets/logos/medias/ludology.jpg"),
        type: "video"
    },
    {
        name: "Beyond Games",
        logoMin: require("../assets/logos/medias/beyondGames.jpg"),
        type: "video"
    },

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