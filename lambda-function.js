// AWS Lambda function code

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event, context) => {
    const bucketName = 'newbuckettraffic';
    const fileName = 's3://<newbuckettraffic>/live-speeds/latest/<Z7_quadkey>.csv';

    try {
        const params = { Bucket: bucketName, Key: fileName };
        const response = await s3.getObject(params).promise();
        const liveTrafficData = response.Body.toString('utf-8');

        // Process liveTrafficData and return it or integrate it with your application

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Live traffic data fetched successfully' })
        };
    } catch (error) {
        console.error('Error fetching live traffic data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching live traffic data' })
        };
    }
};
