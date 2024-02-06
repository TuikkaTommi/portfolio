const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { ddbcli, doccli } = require('./ddbconn');

/* Scan-komento käy läpi eli skannaa koko DDB-taulun. Sitä voi käyttää
jos taulussa on vain vähän dataa, esim. alle 100 itemia. Jos taulussa on
paljon dataa, se on raskas ja kallis operaatio, jolloin kannattaa käyttää
sivuttamista eli paginaatiota. Skannauksen parametreissa voidaan antaa
filttereitä, joilla voidaan rajata mitä tietoja halutaan saada.
Jos annetaan vain taulun nimi, saadaan kaikki tiedot.
*/
module.exports.handler = async (event) => {
  const params = {
    // Attribuutit jotka haetaan
    ProjectionExpression:
      'customercode, customername, numberofrentals, email, rentals',

    TableName: process.env.ddb_table,
  };

  try {
    const data = await doccli.send(new ScanCommand(params));
    // Nyt kun käytetään documentclientia saadaan kannasta JS-dataa
    // console.log(data.Items);
    return data.Items;
  } catch (err) {
    console.error(err);
  }
};
