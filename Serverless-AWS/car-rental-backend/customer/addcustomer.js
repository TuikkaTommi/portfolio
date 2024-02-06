// Lisäys käyttäen documentclientia
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { ddbcli, doccli } = require('./ddbconn');

/* Lisätään asiakas. Tietotyyppien ei tarvitse olla mukana, koska
   documentclient huolehtii niistä.

   Huomaa, että käytämme name-attribuutin 
   sijasta customername-attribuuttia, koska name on varattu sana DDB:ssä.
*/
module.exports.handler = async (event) => {
  // Parsitaan pyynnön body objektiksi
  const body = JSON.parse(event.body);

  // Asetetaan bodyssa tulleet tiedot parametreiksi
  const params = {
    TableName: process.env.ddb_table,
    Item: {
      customercode: body.customercode,
      customername: body.customername,
      email: body.email,
      numberofrentals: body.numberofrentals,
      rentals: body.rentals,
    },
  };

  try {
    // Tehdään tietokantaoperaatio
    const data = await doccli.send(new PutCommand(params));
    console.log(data);
    return {
      statusCode: 201,
      body: JSON.stringify(body),
    };
  } catch (err) {
    // Virheenkäsittely
    console.error(err);
  }
};
