require("babel-register")({
    presets: ["es2015", "react"]
});

const axios = require("axios");

const router = require("./sitemapRouter").default;
const Sitemap = require("react-router-sitemap").default;

async function generateSitemap() {
    try {
        // const games = await get(API_CONFIG.endpoints.GAME, {limit: 100000});
        const res = await axios({
            url: "https://gamer-juice-api.herokuapp.com/games",
            method: 'GET',
            params: new URLSearchParams({limit: 1000000}),
            headers: {
                'Accept': 'application/json',
                "X-Requested-With": "XMLHttpRequest"
            },
        });
        const games = res.data;

        const idMap = games.map((game) => {
            return {gameId: game._id};
        });

        const paramsConfig = {
            "/game/:gameId": idMap
        };
        console.log("sitemap generated");
        return (
            new Sitemap(router)
                .applyParams(paramsConfig)
                .build("https://desjeuxetdesmots.com")
                .save("./public/sitemap.xml")
        );
    } catch (e) {
        console.log(e)
    }
}

generateSitemap();