exports.appConfig = {
    youtubeAPI: {
        key: "AIzaSyBtdNkKc0s6Fe93zVQeYCLhpS6tGo3HSD8"
    },
    IGDB_API : {
        url: "https://api-v3.igdb.com/",
        key: "e96d3dcb3da70046dfcfd9204e27ac26"
    },
    runtimeOpts: {
        timeoutSeconds: 540,
        memory: '1GB'
    },
    medias: {
        silenceOnJoue: {
            excludeStrings: ["Silence On Joue"],
            excludeRegex: [],
            ignoreEpisode: [],
            endOfParseStrings: [],
            parseProperty: "name"
        },
        cosyCorner: {
            excludeStrings: ['où il est entre autres question de', 'Le cosy corner numéro', 'cosy corner', 'le cosy corner', 'Un épisode où il est entre autres question de'],
            excludeRegex: [/\\[[^\\]]*\\]/],
            ignoreEpisode: ['Zone de Confort', '[HS]'],
            endOfParseStrings: ['Remerciements', 'Playlist'],
            parseProperty: "description"
        },
        gamekult: {
            excludeStrings: ["gamekult", "l'émission"],
            excludeRegex: [],
            ignoreEpisode: [],
            endOfParseStrings: ["by gamekult"],
            parseProperty: "name"
        },
        exServ: {
            excludeStrings: [],
            excludeRegex: [],
            ignoreEpisode: [],
            endOfParseStrings: [],
            parseProperty: "name"
        }
    }
}