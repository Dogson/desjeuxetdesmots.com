import PodcastsAdmin from "../pages/admin/PodcastsAdmin";

const PODCASTS = [
    {
        dataLabel: "cosyCorner",
        name: "Le Cosy Corner",
        author: "À L'aise Blaze",
        logo: require("../assets/logos/cosyCorner/cosyCornerFull.jpg"),
        logoMin: require("../assets/logos/cosyCorner/cosyCornerSmall.png"),
        app: "spotify"
    },
    {
        dataLabel: "silenceOnJoue",
        name: "Silence On Joue",
        author: "Erwan Cario",
        logo: require("../assets/logos/silenceOnJoue/silenceOnJoueFull.jpg"),
        logoMin: require("../assets/logos/silenceOnJoue/silenceOnJoueMini.png"),
        app: "spotify"
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
        dataLabel: "podcasts"
    }
]