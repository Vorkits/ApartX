const axios = require('axios')
var QRCode = require('qrcode')
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs=require('fs');
function clientInit(){
    const client = new Client({
//        authStrategy: new LocalAuth({dataPath: './.wwebjs_auth/session'}),
        puppeteer: {
//	handleSIGINT: false,

            executablePath: '/usr/bin/chromium-browser',
            ignoreDefaultArgs: ['--disable-extensions'],
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          }
    });
let sent=false
client.on('qr', async (qr) => {
        console.log('QR RECEIVED', qr)
            const src = '/home/whatsapp_mailing/staticdata/qrcode.png';
            const stream = fs.createWriteStream(src);
            const code = await QRCode.toFileStream(stream,qr);
if (sent==false){
axios.get('https://api.telegram.org/bot957547691:AAGQDgpJC_Ie4pp8qzFaKX1kwIo2tops7S0/sendMessage?chat_id=541382484&text=%D0%9D%D0%B5%D0%BE%D0%B1%D1%85%D0%BE%D0%B4%D0%B8%D0%BC%D0%BE%20%D1%81%D0%BA%D0%B0%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20QR https://ralae.com/file/qrcode.png')
axios.get('https://api.telegram.org/bot957547691:AAGQDgpJC_Ie4pp8qzFaKX1kwIo2tops7S0/sendMessage?chat_id=399973852&text=%D0%9D%D0%B5%D0%BE%D0%B1%D1%85%D0%BE%D0%B4%D0%B8%D0%BC%D0%BE%20%D1%81%D0%BA%D0%B0%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20QR https://ralae.com/file/qrcode.png&parse_mode=markdown')
sent=true
}        
global.qrcode = qr
       
    });

    client.on('ready', () => {
     sent=false    
    console.log('Client is ready!');
    });

    client.on('disconnect', () => {
        console.log('disconnecting');
        clientInit()
    });

    client.initialize();
    return client
}

module.exports = clientInit()
