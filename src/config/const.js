import PodcastsAdmin from "../pages/admin/PodcastsAdmin";

const PODCASTS = [
    {
        dataLabel: "cosyCorner",
        name: "Le Cosy Corner",
        author: "À L'aise Blaze",
        logo: require("../assets/logos/cosyCorner/cosyCornerFull.jpg"),
        logoMin: require("../assets/logos/cosyCorner/cosyCornerSmall.png")
    }
];


export const MEDIAS = [
    {
        name: "Podcasts",
        medias: PODCASTS,
        route: "/admin/podcasts",
        logo: require("../assets/logos/mediaTypes/podcasts.jpg"),
        component: PodcastsAdmin
    }
]