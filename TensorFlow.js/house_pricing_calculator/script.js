// Importataan tfjs-kirjasto
const tf = require('@tensorflow/tfjs');

// Määritetään datan sijainti
const datapath = 'file://housing_price_dataset.csv';

/* Apufunktio jolla tulostetaan konsoliin olioiden (obj) sisältämä data, jota alla  
   muunnetaan tensoreiksi. Sovelluksen toiminta ei tätä funktiota tarvitse, mutta 
   havainnollistamaisen kannalta tulostaminen on tärkeää. Kts. selaimen Developer 
   tools/Console. Parametrit: declaration - selite mitä tehdään, obj - olio, 
   iterations - montako olion sisältämää "data-alkiota" tulostetaan
*/
async function printobj(declaration, obj, iterations) {
  const it = await obj.iterator();
  console.log(declaration);
  for (let i = 0; i < iterations; i++) {
    const elem = await it.next();
    console.log(elem);
  }
  console.log('');
}

// Funktio, jolla muutetaan csv-data objektimuotoon
function csvToObj(datapath, label) {
  const objData = tf.data.csv(datapath, {
    // Tavoitteena on saada tulokseksi Price-sarakkeen tieto, eli asunnon hinta, joten siitä tehdään label.
    columnConfigs: { [label]: { isLabel: true } },
  });

  return objData;
}

// Funktio, jolla muutetaan objektit taulukkomuotoon, jotta niistä voidaan tehdä tensoreita
function objToArr(objData) {
  // muunnetaan oliot taulukkomuotoon mapin avulla
  const arrayData = objData.map(({ xs, ys }) => {
    // Muunnetaan tekstimuotoiset tiedot naapurustosta numeraalisiksi
    switch (xs.Neighborhood) {
      case 'Suburb':
        xs.Neighborhood = 2;
      case 'Urban':
        xs.Neighborhood = 1;
      case 'Rural':
        xs.Neighborhood = 0;
    }

    // palautetaan kaksi taulukkoa indekseissä xs ja ys.
    // xs on inputit ja ys on labelit
    return { xs: Object.values(xs), ys: Object.values(ys) };
  });

  return arrayData;
}

// funktio, jolla otetaan tensorit ulos oliosta ja laitetaan ne taulukkoon
async function createTensorArr(obj) {
  const it = await obj.iterator();
  const elem = await it.next();
  // palautetaan taulukko, jossa on tensorit
  return [elem.value.xs, elem.value.ys];
}

// Funktio, joka normalisoi ennustettavan datan.
function nlizeSampleTensor(tensor, min, max) {
  return tensor.sub(min).div(max.sub(min));
}

// Tensorin min-max normalisointi eli skaalaus välille 0-1
function nlizetensor(tensor) {
  const min = tensor.min(); // suurin arvo tensorissa
  const max = tensor.max(); // pienin arvo tensorissa

  result = tensor.sub(min).div(max.sub(min));
  // Palautetaan normalisoitu tensori, sekä min-max arvot, jotta niitä voidaan hyödyntää ennustettavan datan normalisoinnissa.
  return { result, min, max };
}

// Funktio tensorin epänormalisoimiseksi
function unNlize(tensor, labelMin, labelMax) {
  return tensor.mul(labelMax.sub(labelMin)).add(labelMin);
}

// Funktio, jolla luodaan malli
function createModel() {
  // Luodaan sekuentaalinen malli. Sekuentaalisessa mallissa edellisen kerroksen outputit ovat aina seuraava kerroksen inputteja.
  const model = tf.sequential();

  /* Lisätään verkkoon kerros, joka ottaa vastaan inputit. inputShape määrittää inputin muodon. 
  Units määrittää kuinka monta painokerrointa inputtia kohden on. */
  model.add(tf.layers.dense({ inputShape: [5], units: 40, useBias: true }));

  // Lisätään uusia kerroksia
  model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }));
  // model.add(tf.layers.dense({ units: 40, activation: 'sigmoid' }));
  // model.add(tf.layers.dense({ units: 30, activation: 'sigmoid' }));

  // Kerros, joka määrittää outputin. Units on 1, koska ulos halutaan saada yksi numero
  model.add(
    tf.layers.dense({ units: 1, useBias: true, activation: 'sigmoid' })
  );

  // Palautetaan malli
  return model;
}

/* Funktion trainModel() avulla harjoitetaan malli. */
async function trainModel(model, inputs, labels) {
  // Valmistellaan malli harjoitusta varten
  model.compile({
    // optimizer eli optimointialgoritmi päivittää mallia. (0.06) optimointifunktion perässä tarkoittaa mallin
    // learning ratea, eli sitä, kuinka voimakkaasti malli muuttaa painokertoimia arvioidun virhemarginaalin pohjalta.
    optimizer: tf.train.adam(0.06),
    // Loss-funktio kertoo mallille kuinka hyvin se toimii
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  // batchSize tarkoittaa sitä datan määrää, joka mallille syötetään per harjoituskierroa
  const batchSize = 32;
  // epochs määrittää kuinka monta kertaa datasetti käydään läpi harjoituksen aikana
  const epochs = 10;

  // Harjoitetaan malli harjoitusdatalla, callbackissa tulostetaan kierros eli epoch ja kierroksen loss-arvo
  await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log('Epoch: ' + epoch + ' Loss: ' + logs.loss);
      },
    },
  });

  // Palautetaan malli
  return model;
}

// Funktio, joka luo ennusteen testidatasta, hyödyntäen aiemmin harjoitettua mallia
function createPrediction(model, testdata) {
  const prediction = model.predict(testdata);
  return prediction;
}

async function run() {
  // Datan muuntaminen csv:stä objektiksi
  const objData = csvToObj(datapath, 'Price');

  // objData sisältää olioita avaimissa xs ja ys. Tulostetaan viisi näytettä:
  // printobj('Data oliomuodossa', objData, 5);

  // Datan muuntaminen objekteista taulukkomuotoon
  const arrData = objToArr(objData);

  // console.log(arrData);
  // printobj('Data taulukkomuodossa', arrData, 5);

  // arrData olion sisältämät taulukot muutetaan tensoreiksi
  const tensorObj = arrData.batch(5000);
  // printobj('Data tensorimuodossa', tensorObj, 1);

  const tensorArr = await createTensorArr(tensorObj);

  // Tulostetaan tensorin tiedot tensorflown print()-metodilla
  // console.log('Normalisoimattomat tensorit:');
  // tensorArr[0].print();
  // tensorArr[1].print();

  // Normalisoidaan input- ja label-tensorit. result-ominaisuudessa on normalisoitu tensori.
  // Min- ja max-ominaisuuksissa on pienin ja suurin arvo jatkokäyttöä varten.
  const nlizedx = nlizetensor(tensorArr[0]);
  const nlizedy = nlizetensor(tensorArr[1]);

  // Tulostetaan normalisoidut tensorit
  // console.log('Normalisoidut tensorit:');
  // nlizedx.result.print();
  // nlizedy.result.print();

  // Luodaan malli
  const model = createModel(nlizedx.result, nlizedy.result);
  // console.log(model);

  // Harjoitetaan malli normalisoiduilla tensoreilla
  const trainedModel = await trainModel(model, nlizedx.result, nlizedy.result);
  // console.log(trainedModel);

  // Luodaan muutama tensori, joille luodaan ennustus. Datasetin vastaavien asuntojen perusteella arvioitu oikea hinta kommentoituna.
  const sample = tf.tensor2d([2100, 4, 1, 0, 1969], [1, 5]); // ~215 000 dollaria
  const sample2 = tf.tensor2d([2700, 4, 3, 1, 1999], [1, 5]); // ~320 000 dollaria
  const sample3 = tf.tensor2d([2300, 3, 3, 0, 1978], [1, 5]); // ~270 000 dollaria
  const sample4 = tf.tensor2d([1700, 5, 2, 2, 2020], [1, 5]); // ~200 000 dollaria

  // Normalisoidaan testi-tensori hyödyntäen harjoitusdatan min-max -arvoja
  const nlizedSample = nlizeSampleTensor(sample4, nlizedx.min, nlizedx.max);
  // nlizedSample.print();

  // Tehdään ennustus
  const prediction = createPrediction(trainedModel, nlizedSample);
  // prediction.print();

  // console.log('Ennuste tensorimuodossa: ', prediction);
  // console.log('Ennuste taulukkona: ', await prediction.array());

  // Epänormalisoidaan ennuste takaisin alkuperäisen datan muotoon
  const unNlizedPred = unNlize(prediction, nlizedy.min, nlizedy.max);
  // unNlizedPred.print();

  // dataSync() antaa tensorin arvon
  result = await unNlizedPred.dataSync();
  // console.log(result[0]);

  // Logataan ennustus konsoliin
  console.log('Asunnon arvioitu hinta on', result[0].toFixed(2), 'dollaria');
}

run();
