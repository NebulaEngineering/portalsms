const request = require('request');
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
const axios = require('axios').default;
const ERROR_MAP = {
    400: 'datos inválidos para el envío, clave o login errado.',
    401: 'error al insertar, por ejemplo problema de caracteres inválidos (se aceptan caracteres especiales: $%&( ), ; * - _) no se aceptan tildes ni otros caracteres.',
    402: 'Problema interno',
    404: 'No hay cupo',
    407: 'Error interno',
    408: 'Ip no inscrita'
};

/**
 * A function to send sms to the indicated phone numbers
 * @returns {Promise} A promise that will resolve sending a sms message
 */
exports.sendOneMessage = function (message, phoneNumbers) {
    return new Promise((resolve, reject) => {
        const urlWs = process.env.PORTALSMS_WS_URL_SMS;
        const smsLogin = process.env.PORTALSMS_LOGUIN;
        const smsPassword = process.env.PORTALSMS_PASSWORD;

        if (!message || message.trim().length == 0) {
            ConsoleLogger.e(`Missing or invalid parameters: Message=>`, message);
            reject('Empty message.');
            return;
        }
        if (!phoneNumbers || phoneNumbers.length == 0) {
            ConsoleLogger.e(`Missing or invalid parameters: phoneNumbers=>`, phoneNumbers);
            reject('Phone numbers have not been defined.');
            return;
        }
        const smsVsCellphones =
            phoneNumbers
                .filter(phoneNumber => phoneNumber)
                .map(phoneNumber => ({ "destino": String(phoneNumber), "mensaje": message }));
        request.post({
            url: urlWs, form: {
                login: smsLogin,
                clave: smsPassword,
                view: 'getEnvioSMS',
                json: JSON.stringify(smsVsCellphones)
            },
            json: true
        }, (err, resp, body) => {

            if (err) {
                ConsoleLogger.e(`Error failed sending sms:`, err);
                reject(err);
                return;

            }
            if (body.estado == null) {
                ConsoleLogger.e(`Failed sending sms got invalid response structure`);
                reject("ERROR INVALID STRUCTURE");
                return;
            }
            if (resp.statusCode !== 200) {
                ConsoleLogger.e(`failed sending sms: `, resp);
                reject(body);
                return;
            }
            const { estado, ids } = body;
            let response = null;
            if (body && estado == 'ok' && ids) {
                const phoneNumbersResponse = ids.split(',');
                response = phoneNumbersResponse
                    .filter(phone => phone.trim().length > 0)
                    .map((id, index) => {
                        const responseId = id.trim();
                        const phone = smsVsCellphones[index].destino;
                        const errorMsg = ERROR_MAP[responseId.trim()];
                        return {
                            phoneNumber: phone,
                            sendId: errorMsg ? null : responseId,
                            errorCode: errorMsg ? responseId : null,
                            errorMsg: errorMsg ? errorMsg : null
                        };
                    });
            } else {
                response = [{ sendId: String(estado), errorMsg: body }];
            }

            return resolve(response);
        })



    });
}
