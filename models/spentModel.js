const AWS = require("aws-sdk");
const {v4} = require ("uuid");

const dynamodb = new AWS.DynamoDB.DocumentClient();

class Spent {
    constructor(id, title, description, amount, category, createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.createdAt = createdAt;
    }

    static async createSpent(userId, title, description, amount, category){
        const createdAt = new Date().toLocaleString();
        const id = v4()

        const newSpent = new Spent(id, title, description, amount, category, createdAt)

        const user = await dynamodb.get({
            TableName: 'UsersTable2',
            Key: {
                id: userId
            }
        }).promise();

        user.spents.push(newSpent);

        await dynamodb.put({
            TableName: "UsersTable2",
            Item: user,
        }).promise()

        return newSpent
    }


}

module.exports = { Spent };