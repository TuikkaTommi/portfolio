const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { ddbcli, doccli } = require('./ddbconn');

module.exports.handler = async (event) => {
  const ccode = event.pathParameters.ccode;
  // Määritellään mitä haetaan. Haetaan customerTablesta asiakaskoodia vastaava asiakas
  const params = {
    TableName: process.env.ddb_table,
    Key: {
      customercode: ccode,
    },
  };

  try {
    const data = await doccli.send(new GetCommand(params));
    // console.log(data.Item);
    return data.Item;
  } catch (err) {
    console.error(err);
  }
};
