# TensorFlow.js house pricing calculator

This is a simple TF.js app, that predicts house prices. The training data is .csv-data inside [housing_price_dataset.csv](https://github.com/TuikkaTommi/portfolio/blob/main/TensorFlow.js/house_pricing_calculator/housing_price_dataset.csv) file. The actual funtionality is inside [script.js](https://github.com/TuikkaTommi/portfolio/blob/main/TensorFlow.js/house_pricing_calculator/script.js) file.

The app processes the csv-data to tensors, normalizes them, creates a model and trains it. Then a sample is created and normalized, that is used to make a prediction with the created model. The prediction is un-normalized back to monetary values.
