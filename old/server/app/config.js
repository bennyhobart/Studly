module.exports = {
    development: {
        sessionkey: "express.sid",
        sessionsecret: "hello world",
        app: {
            name: "Studly"
        }
    },
    production: {
        sessionkey: "StudlyKey",
        sessionsecret: "StudlySecret",
        app: {
            name: "Studly"
        }
    }
}