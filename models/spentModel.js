const AWS = require("aws-sdk");
const {v4} = require ("uuid");
const {User} = require('../models/userModel');

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

        const result = await dynamodb.get({
            TableName: 'UsersTable2',
            Key: {
                id: userId
            }
        }).promise();

        if (!result.Item) {
            throw new Error("Wrong credentials")
        }

        const user = new User(
            result.Item.id,
            result.Item.email,
            result.Item.password,
            result.Item.totalAmount,
            result.Item.amounts,
            result.Item.totalSpents,
            result.Item.spents,
            result.Item.createdAt,
            result.Item.tokens
        )

        user.spents.push(newSpent);
        user.totalSpents += newSpent.amount;
        user.totalAmount -= newSpent.amount;

        await dynamodb.put({
            TableName: "UsersTable2",
            Item: user,
        }).promise()

        return newSpent
    }


}

module.exports = { Spent };