import awsSdk from 'aws-sdk';

const { DynamoDB } = awsSdk;
const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event) => {
    const tableName = 'Tasks';
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
        FilterExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#userId': 'userId',
        },
        ExpressionAttributeValues: {
            ':userId': userId,
        },
    };

    try {
        const data = await dynamodb.scan(params).promise();
        response.statusCode = 200
        response.body = JSON.stringify(data.Items)
        return response;

    } catch (error) {
        response.statusCode = 500
        response.body = JSON.stringify({ error: error.message });
        return response;
    }
};
