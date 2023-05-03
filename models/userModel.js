const AWS = require("aws-sdk");
const {v4} = require ("uuid");
const { hashPassword } = require("../utils/bcrypt");
const { comparePassword } = require("../utils/bcrypt");
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const dynamodb = new AWS.DynamoDB.DocumentClient();

class User {
    constructor(id, email, password, totalAmount, amounts, totalSpents, spents, createdAt, tokens) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.totalAmount = totalAmount;
        this.amounts = amounts;
        this.totalSpents = totalSpents;
        this.spents = spents;
        this.createdAt = createdAt;
        this.tokens = tokens;
    }

    static async createUser(email, pass){
        const createdAt = new Date().toLocaleString();
        const password = await hashPassword(pass);
        const id = v4()

        const newUser = new User(id, email, password, 0, [], 0, [], createdAt, [])
        
        await dynamodb.put({
            TableName: "UsersTable2",
            Item: newUser,
        }).promise()

        return newUser
    }

    static async getUsers(){
        const result = await dynamodb.scan({
            TableName: 'UsersTable2'
        }).promise()

        const users = result.Items.map(item => new User(
            item.id,
            item.email,
            item.password,
            item.totalAmount,
            item.amounts,
            item.totalSpents,
            item.spents,
            item.createdAt,
            item.tokens
          ));
      
          return users;
    }

    static async getUserById(id){
        
        const result = await dynamodb.get({
            TableName: 'UsersTable2',
            Key: {
                id
            }
        }).promise()

        if (!result.Item) {
            return null
        } else {
            return new User(
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
        }
    }

    static async deleteUser(id){

        const result = await dynamodb.delete({
            TableName: 'UsersTable2',
            Key: {
                id
            },
            //Devuelve los atributos del elemento eliminado
            ReturnValues: 'ALL_OLD'
        }).promise()

        //Si el usuario no es encontrado en la tabla
        if (!result.Attributes) {
            return null
        } else {
            return true;
        }
    }

    static async checkEmailExists(email){
        const params = {
            TableName: 'UsersTable2',
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email' : email
            }
        };

        const result = await dynamodb.scan(params).promise();
        return result.Items.length > 0;
    }

    static async checkUser(email, password){
        const params = {
            TableName: 'UsersTable2',
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email' : email
            }
        };

        const result = await dynamodb.scan(params).promise();
        if (!result) {
            return null
        }

        //Scan devuelve un arreglo de resultados
        const user = new User(
            result.Items[0].id,
            result.Items[0].email,
            result.Items[0].password,
            result.Items[0].totalAmount,
            result.Items[0].amounts,
            result.Items[0].totalSpents,
            result.Items[0].spents,
            result.Items[0].createdAt,
            result.Items[0].tokens
        );

        const isMatch = comparePassword(password, user.password)
        if (!isMatch) {
            return null
        }

        return user;
    }

    static async generateToken(user){
        const token = jwt.sign({id : user.id}, config.JWTSecret, {expiresIn: '86400s'});
        user.tokens.push(token);
        await dynamodb.put({
            TableName: "UsersTable2",
            Item: user,
        }).promise()
        return token;
    }
}

module.exports = { User };