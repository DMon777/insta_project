const axios = require('axios');
const qs = require('qs');

function sendMailToApi(message) {

    const data = {
        message : message
    }
    const url = 'https://api.wantpickup.ru/sendmail.php';
    axios.post( url, qs.stringify(data) );
}

module.exports = sendMailToApi;