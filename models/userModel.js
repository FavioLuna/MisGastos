const AWS = require("aws-sdk");
const {v4} = require ("uuid");
const { hashPassword } = require("../utils/bcrypt");

const dynamodb = new AWS.DynamoDB.DocumentClient();

class User {
    constructor(id, email, password, totalAmount, amounts, totalSpents, spents, createdAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.totalAmount = totalAmount;
        this.amounts = amounts;
        this.totalSpents = totalSpents;
        this.spents = spents;
        this.createdAt = createdAt;
    }

    static async createUser(email, pass){
        const createdAt = new Date().toLocaleString();
        const password = await hashPassword(pass);
        const id = v4()

        const newUser = new User(id, email, password, 0, [], 0, [], createdAt)
        
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
            item.createdAt
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
}

module.exports = { User};