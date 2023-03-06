'use strict';

const app = require('./express/server');

let port = 4000;

app.listen(port, () => console.log('Local app listening on port '+port+'!'));
