const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { ddbcli, doccli } = require('./ddbconn');

module.exports.handler = async (event) => {
  const ccode = event.pathParameters.ccode;
  const rcode = event.pathParameters.rcode;
  // Määritellään mitä haetaan. Haetaan customerTablesta asiakaskoodia vastaava asiakas
  const params = {
    TableName: process.env.ddb_table,
    Key: {
      customercode: ccode,
    },
  };

  try {
    const data = await doccli.send(new GetCommand(params));

    const indexOfRental = data.Item.rentals
      .map((value) => value.rentalnumber)
      .indexOf(rcode);
    // console.log(data.Item);

    const inc = -1;
    // Upsert tehdään list_append()-metodilla
    const deleteParams = {
      TableName: process.env.ddb_table,
      Key: {
        customercode: ccode,
      },
      // päivityslause, jolla poistetaan rentals-listan alkio halutusta indexistä. Myös vuokrausten määrään "lisätään" -1
      UpdateExpression: `REMOVE rentals[${indexOfRental}] add numberofrentals :inc`,

      ExpressionAttributeValues: {
        ':inc': inc,
      },
      // paluuarvona voidaan vastaanottaa päivitetty rentals-lista
      ReturnValues: 'ALL_NEW',
    };

    try {
      const data = await doccli.send(new UpdateCommand(deleteParams));
      console.log('Success, rental deleted', data);
      return data.Item;
    } catch (err) {
      console.error(err);
    }

    // return indexOfRental;
    // return data.Item.rentals[indexOfRental];
    // return { ccode: ccode, rcode: rcode };
  } catch (err) {
    console.error(err);
  }
};
