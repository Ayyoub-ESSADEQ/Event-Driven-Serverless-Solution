import awsSdk from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const { DynamoDB } = awsSdk;
const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event) => {
    const tableName = 'Tasks';
    const { title, description } = JSON.parse(event.body);


    const userId = event.requestContext.authorizer.claims['cognito:username'];
    const response = {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    }


    const taskId = uuidv4();

    const params = {
        TableName: tableName,
        Item: {
            taskId,
            title,
            description,
            userId,
            finished: false
        },
        ConditionExpression: 'attribute_not_exists(taskId)',
    };

    try {
        await dynamodb.put(params).promise();
        response.statusCode = 201;
        response.body = JSON.stringify({ taskId: taskId, body: event })
        return response;

    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            response.statusCode = 400;
            response.body = JSON.stringify({ error: 'Task with the same taskId already exists' });
            return response
        }

        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message })
        return response;
    }
};
