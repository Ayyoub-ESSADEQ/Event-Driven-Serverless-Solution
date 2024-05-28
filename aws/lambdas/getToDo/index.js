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
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    }

    const params = {
        TableName: tableName,
        Key: { taskId },
        ConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        },
    };

    try {
        const data = await dynamodb.get(params).promise();
        if (data.Item) {
            response.statusCode = 200;
            response.body = JSON.stringify(data.Item);
            return response;
        }
        response.statusCode = 404;
        response.body = JSON.stringify({ error: 'Item not found' });

        return response;

    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message })

        return response;
    }
};
