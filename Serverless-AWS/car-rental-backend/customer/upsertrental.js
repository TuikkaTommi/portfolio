// grade-mapin lisäys eli upsert listaan
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { ddbcli, doccli } = require('./ddbconn');
module.exports.handler = async (event) => {
  const ccode = event.pathParameters.ccode;

  const body = JSON.parse(event.body);
  const inc = 1;

  // Upsert tehdään list_append()-metodilla
  const params = {
    TableName: process.env.ddb_table,
    Key: {
      customercode: ccode,
    },
    // päivityslause
    UpdateExpression:
      'set rentals = list_append(rentals, :vals) add numberofrentals :inc',
    // listaan upsertattava data, huomaa hakasulut olion ympärillä
    ExpressionAttributeValues: {
      ':vals': [body],
      ':inc': inc,
    },
    // paluuarvona voidaan vastaanottaa päivitetty rentals-lista
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const data = await doccli.send(new UpdateCommand(params));
    console.log('Success, rental added', data);
    return data.Item;
  } catch (err) {
    console.error(err);
  }
};
