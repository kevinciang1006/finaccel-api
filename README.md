# Finaccell Express backend

This is the backend using Express.js

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) to install.

Setup the backend

1. Create new database in localhost/phpmyadmin (ex: finaccel)
2. Go to config\config.json and fill in the database credentials

```bash
npm install
sequelize db:migrate
sequelize db:seed:all
```

## Usage

Start the backend

```bash
npm start
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)