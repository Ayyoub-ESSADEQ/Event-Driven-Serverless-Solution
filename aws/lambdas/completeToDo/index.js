import awsSdk from 'aws-sdk';

const { DynamoDB } = awsSdk;
const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event) => {
    const tableName = 'Tasks';
    const taskId = event.pathParameters.taskId;
    const userId = event.requestContext.authorizer.claims['cognito:username'];
    const response = {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"
        },
    }

    const params = {
        TableName: tableName,
        Key: { taskId },
        UpdateExpression: 'set #finished = :finished',
        ConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#finished': 'finished',
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':finished': true,
            ':userId': userId
        },
        ReturnValues: 'ALL_NEW'
    };

    try {
        const data = await dynamodb.update(params).promise();
        response.statusCode = 200;
        response.body = JSON.stringify(data.Attributes);
        return response;

    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            response.statusCode = 400;
            response.body = JSON.stringify({ error: 'Item not found or userId does not match' });
            return response;
        }

        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message })
        return response;
    }
};
