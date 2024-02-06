const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { ddbcli, doccli } = require('./ddbconn');

module.exports.handler = async (event) => {
  // Otetaan vastaan poistettavan asiakkaan koodi urlista
  const ccode = event.pathParameters.ccode;
  // Määritellään mitä deletoidaan
  const params = {
    TableName: process.env.ddb_table,
    Key: {
      customercode: ccode,
    },
  };

  try {
    const data = await doccli.send(new DeleteCommand(params));
    console.log('Success, customer deleted', data);
    return {
      statusCode: 200,
      message: 'Deleted',
    };
  } catch (err) {
    console.log('Error', err);
  }
};
