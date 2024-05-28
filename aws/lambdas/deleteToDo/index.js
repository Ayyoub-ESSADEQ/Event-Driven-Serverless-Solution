import awsSdk from 'aws-sdk';

const { DynamoDB } = awsSdk;
const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event) => {
    const tableName = 'Tasks';
    const userId = event.requestContext.authorizer.claims['cognito:username'];
    const taskId = event.pathParameters.taskId;
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
        ReturnValues: 'ALL_OLD' // Return the item attributes before deletion
    };

    try {
        const data = await dynamodb.delete(params).promise();
        if (data.Attributes) {
            response.statusCode = 200;
            response.body = JSON.stringify({ message: 'Item deleted successfully', deletedItem: data.Attributes });
            return response;
        }

        response.statusCode = 404;
        response.body = JSON.stringify({ error: 'Item not found' });
        return response;

    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
        return response;
    }
};
