const AWS = require("aws-sdk");
const {v4} = require ("uuid");
const {User} = require('../models/userModel');

const dynamodb = new AWS.DynamoDB.DocumentClient();

class Income {
    constructor(id, title, description, income, createdAt){
        this.id = id;
        this.title = title;
        this.description = description;
        this.income = income;
        this.createdAt = createdAt;
    }

    static async createIncome(userId, title, description, income){
        const createdAt = new Date().toLocaleString();
        const id = v4();

        const newIncome = new Income(id, title, description, income, createdAt);
    
        const result = await dynamodb.get({
            TableName: "UsersTable2",
            Key: {
                id: userId
            }
        }).promise();

        if (!result.Item) {
            throw new Error("Wrong credentials");
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
        );

        user.incomes.push(newIncome);
        user.totalIncomes += newIncome.income;

        await dynamodb.put({
            TableName: "UsersTable2",
            Item: user,
        }).promise();
        
        return newIncome;
    }
}

module.exports = { Income };