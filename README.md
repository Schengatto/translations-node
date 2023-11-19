# HOW TO USE THIS APPLICATION

This application provides a set of utility functions for weblate to:

- Generate xliff file: create a xliff file with the required translations from a csv file
- Generate csv file: create a csv file from a specific xliff file
- Convert cvs file to json: convert the translations.csv to translations.json
- Check missing translations: check if there are missing translations for a specific language

1. ensure to provide the translations.csv file inside the /input folder. This file must contain the following columns:

   - `id`: the values are used to fill the `id` attribute of the tags `trans-unit`. E.G. 354583a9f072faee6fad2e8e17038b89
   - `key`: the values are used to fill the `resname` attribute of the tags `trans-unit`. E.G.language.selectlanguage
   - `language`: the name of the target language of your translations. E.G. English.

2. At the root level of the project folder, run the command `npm ci` in order to dowload all the dependencies.

3. run the command `npm run start` and enjoy.
