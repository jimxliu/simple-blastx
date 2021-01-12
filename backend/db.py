import boto3
from boto3.dynamodb.conditions import Key
import uuid, time, json

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

table = dynamodb.Table('submissions')


## Create item
uuid = str(uuid.uuid1())
timestamp = str(int(time.time() * 1000)) # Milliseconds
data = dict()
data['userId'] = 'ginkgo'
data['jobId'] = uuid
data['timestamp'] = timestamp
data['result'] = 'No Match'
data['query'] = 'TTTTTTTAAAACCCACACCACTTTTAAACCCATATAT'
response = table.put_item( Item=data )
print(response)

def get_submissions_by_user(userId: str) -> list:
    '''
    Get all submissions by user sorted by timestamp in a descending order
    '''
    response = table.query(
        KeyConditionExpression=Key('userId').eq(userId),
        ScanIndexForward=False
    )
    
    return response['Items']
