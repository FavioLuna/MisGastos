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

/*    static async getUsers(){
        const result = await dynamodb.scan({
            TableName: 'UsersTable2'
        }).promise()

        const users = result.Items.map(item => new User(
            item.id,
            item.amount,
            item.description,
            item.title,
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
                result.Item.amount,
                result.Item.description,
                result.Item.title,
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
    }*/
}

module.exports = { Spent };