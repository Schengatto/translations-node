# HOW TO USE THIS APPLICATION

This application provides a set of utility functions for weblate to:

- Generate xliff file: create a xliff file with the required translations from a csv file
- Generate csv file: create a csv file from one or multiple xliff files
- Convert cvs file to json: convert the translations.csv to translations.json
- Check missing translations: check if there are missing translations for a specific language

1. ensure to provide the translations.csv file inside the /input folder. This file must contain the following columns:

   - `id`: the values are used to fill the `id` attribute of the tags `trans-unit`. E.G. 354583a9f072faee6fad2e8e17038b89
   - `key`: the values are used to fill the `resname` attribute of the tags `trans-unit`. E.G.language.selectlanguage
   - `language`: the name of the target language of your translations. E.G. English.

   Example of `translations.csv` content:

   ```csv
   id;key;French;Dutch;English;Portuguese;Swedish;Norwegian;Danish
   354583a9f072faee6fad2e8e17038b89;language.selectlanguage;Sélectionnez votre langue;Selecteer je taal;Select your language;Selecione o seu idioma;Välj språk;Velg språk;Vælg sprog
   bed6c2697ef1ab947f88ea8a1eaa5e63;landing.header.title;Notre catalogue de circuits;Onze catalogus met rondleidingen;Our Catalogue of Tours;Nosso catálogo de tours;Vår katalog med utflykter;Vår rundreisekatalog;Vores katalog med rundture
   ```

2. At the root level of the project folder, run the command `npm ci` in order to dowload all the dependencies.

3. run the command `npm run start` and enjoy.

## From multiple XLIFF files to CSV

This feature can be used to create a csv/excel file having all translations of a specific module and allow you to share it external teams (e.g. in order to ask for the transaltions of a new language)

Here the step to generate the big csv file:

1. Create a folder inside the input folder and name it `xliff-module`
2. Run `npm run start` or `npm start`
3. Choose the option `Convert multiple xliff to csv`
4. If your file are inside the folder `./input/xliff-module` then just press enter, otherwise you have to write the path of the xliff module directory that you want to convert to csv.
5. Open the file `translations.csv` in your root folder. Et voilà you have all your translations in a valid csv file that can be shared with external teams.
