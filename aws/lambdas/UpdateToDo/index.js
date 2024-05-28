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

    const ExpressionAttributeNames = {
        '#userId': 'userId'
    };

    const ExpressionAttributeValues = {
        ':userId': userId
    };

    const props = [];

    for (const property in Object.keys(JSON.parse(event.body))) {
        const propertyName = property.toString();
        ExpressionAttributeNames[`#${propertyName}`] = propertyName;
        ExpressionAttributeValues[`:${propertyName}`] = property;
        props.push(`#${propertyName} = :${propertyName}`);
    }

    const UpdateExpression = `set ${props.join(', ')}`

    const params = {
        TableName: tableName,
        Key: { taskId },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ConditionExpression: '#userId = :userId',
        ReturnValues: 'ALL_NEW'
    };

    try {
        const data = await dynamodb.update(params).promise();
        response.statusCode = 200;
        response.body = JSON.stringify(data.Attributes);
        return response;
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
        return response;
    }
};
