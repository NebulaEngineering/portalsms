const request = require('request');
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
 
 function sendOneMessage (message, phoneNumbers){
    return new Promise((resolve, reject) => {
        const urlWs = process.env.PORTALSMS_WS_URL_SMS || 'https://www.portalsms.co/wsSMS/wsNewServiceRew.php';
        const smsLoguin = process.env.PORTALSMS_LOGUIN;
        const smsPassword = process.env.PORTALSMS_PASSWORD;    

        if(!message || message.trim().length == 0){
            ConsoleLogger.e(`Missing or invalid parameters: Message=>`, message);
            reject('Empty message.');
            return;
        }

        if(!phoneNumbers || phoneNumbers.length == 0){
            ConsoleLogger.e(`Missing or invalid parameters: phoneNumbers=>`, phoneNumbers);
            reject('Phone numbers have not been defined.');
            return;
        }
    
        const smsVsCellphones =  
        phoneNumbers
        .filter(phoneNumber => phoneNumber)
        .map(phoneNumber => ({destino: String(phoneNumber), mensaje: message}));
    
        request.post({url: urlWs, form: {
            login: smsLoguin,
            clave: smsPassword,
            view: 'getEnvioSMS',
            json: smsVsCellphones
        }}, (err, resp, body) => {
            if (err) {
                ConsoleLogger.e(`Error failed sending sms: `, err);
                reject(err);
                return;
            }
            if (resp.statusCode !== 200) {
                ConsoleLogger.e(`failed sending sms: `, resp);
                reject(body);
                return;
            }
            ConsoleLogger.i(`sms response: `, body);

            const {estado, ids} = JSON.parse(body);
            let response = null;            
            if(body && estado== 'ok' && ids) {
                const phoneNumbersResponse = ids.split(',');
                response = phoneNumbersResponse.map((id, index) => {
                    const responseId = id.trim();
                    const phone = phoneNumbers[index];
                    const errorMsg = ERROR_MAP[responseId.trim()];
                    return {
                        phoneNumber: phone,
                        sendId: errorMsg ? null: responseId,
                        errorCode: errorMsg ? responseId: null,
                        errorMsg: errorMsg? errorMsg: null
                    };
                });
            }else{
                response = [{sendId: String(estado)}];
            }
      
            return resolve(response);
        })
    });
}

async function executePromise() {
    try {
        const result = await sendOneMessage('test', [0432423]);  
        console.log('result => ', result);  
    } catch (error) {
        console.error('Error =>>>>>>>',error);
    }
}

executePromise();




