const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { ddbcli, doccli } = require('./ddbconn');

/* Tässä rekisterinumerolla haku on toteutettu hakemalla ensin kaikki asiakkaat, ja sen jälkeen
näistä filtteröidään halutut henkilöt. Olisiko tälle parempi tapa jollain ddb:n ominaisuudella? */
module.exports.handler = async (event) => {
  // Otetaan urlista haluttu rekisterinumero vastaan
  const licenseNumber = event.pathParameters.licenseNumber;
  const params = {
    // Attribuutit jotka haetaan
    ProjectionExpression:
      'customercode, customername, numberofrentals, email, rentals',

    TableName: process.env.ddb_table,
  };

  try {
    const data = await doccli.send(new ScanCommand(params));

    // Luodaan uusi taulukko, johon filtteröidyt henkilöt voidaan lisätä
    let filtered = [];
    // Käydään asiakkaat läpi, ja jos henkilön vuokrauksissa on annettu rekisterinumero, lisätään henkilö taulukkoon
    data.Items.forEach((item) => {
      // Objekti, johon kerätään asiakkaan tunniste, sekä hänen hakua vastaavat vuokraukset
      let customerWithRentals = {
        customercode: item.customercode,
        rentals: [],
      };

      // Käydään läpi asiakkaan vuokraukset. Jos vuokrauksen rekisterinumero vastaa hakuehtoa,
      // lisätään se objektiin
      item.rentals.forEach((rental) => {
        if (rental.license_number === licenseNumber) {
          customerWithRentals.rentals.push(rental);
        }
      });

      // Jos asiakasobjektissa on vuokrauksia, lisätään objekti taulukkoon
      if (customerWithRentals.rentals.length > 0) {
        filtered.push(customerWithRentals);
      }
    });

    // Palautetaan filtteröity taulukko
    return filtered;
  } catch (err) {
    console.error(err);
  }
};
