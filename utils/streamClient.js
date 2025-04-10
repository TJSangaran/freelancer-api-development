const { StreamChat } = require("stream-chat");
const config = require("../config/keys");

class StreamClient {
    constructor() {
        // Stream API
        // Initialize a Server Client
        this.serverClient = StreamChat.getInstance(
            config.streamConfig.api_key,
            config.streamConfig.api_secret
        );
    }

    getToken(userId) {
        return this.serverClient.createToken(userId);
    }

    async createUser(userID, firstname, lastname) {
        const updateResponse = await this.serverClient.upsertUser({
            id: userID,
            role: "user",
            firstname: firstname,
            lastname: lastname
        });
        return updateResponse;
    }

    async syncUsers(users) {
        for (let user of users) {
            const updateResponse = await this.serverClient.upsertUser({
                id: user._id.toString(),
                role: "user",
                firstname: user.firstname,
                lastname: user.lastname
            });
        }
        console.log("Sync users completed")
    }
}

module.exports = StreamClient;
