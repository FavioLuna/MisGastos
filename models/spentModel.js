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
            result.Item.totalIncomes,
            result.Item.incomes,
            result.Item.totalSpents,
            result.Item.spents,
            result.Item.createdAt,
            result.Item.tokens
        )

        user.spents.push(newSpent);
        user.totalSpents += newSpent.amount;
        user.totalIncomes -= newSpent.amount;

        await dynamodb.put({
            TableName: "UsersTable2",
            Item: user,
        }).promise()

        return newSpent
    }

    static async deleteSpent(idSpent, user){
        try {
            //revisar esto para optimizar
            /*user.spents.forEach(spent => {
                if (spent.id == idSpent) {
                    user.totalIncomes += spent.amount;
                    user.totalSpents -= spent.amount;
                }
            });
            user.spents = user.spents.filter(spent => {
                return spent.id !== idSpent;
            })*/
            const spentIndex = user.spents.findIndex(spent => spent.id === idSpent);

            if (spentIndex !== -1) {
                const spent = user.spents[spentIndex];
                user.totalIncomes += spent.amount;
                user.totalSpents -= spent.amount;
                user.spents.splice(spentIndex, 1);

                await dynamodb.put({
                    TableName: "UsersTable2",
                    Item: user,
                }).promise();

                return user
            } else {
                throw new Error("Spent not found")
            }
            
            
        } catch (error) {
            return error
        }
    }

}

module.exports = { Spent };