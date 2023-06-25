const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bot = require('./scripts/whatsappBot/bot')
const numberSchema = require('./models/number')
const fs = require('fs');
var QRCode = require('qrcode')

const stream = require('stream');
function getNumbers(){
  let rawdata = fs.readFileSync('./staticdata/numbers.json')
  let numbers = JSON.parse(rawdata)
  return numbers
}

// require settings data
const settings = require('./staticdata/settings.js')

// initial express js application
const app = express()

// standart express middleweare settings
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
	res.contentType('application/json')
	next()
})
app.use(cors())
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
// declare init program function
async function init (settings) {

  // connect to mongod

  // function of event on mongodb connection open
    app.listen(settings.PORT, '0.0.0.0', (err) => {
			if (err) return new Error(`error in starting server, error: ${err}`)
			else console.log(`server started on \nPORT: ${settings.PORT}\nURL: ${settings.serverUrl}`)
		})

    const router = require('express').Router()

    router.post("/postMailingByMongo", async (req, res) => {
      try{
        const message = req.body.message
        const category = req.body.category
//        const numbers = req.body.data
        const type = req.body.type
        const suppliers=req.body.suppliers

        console.log(message,type,category)
for (sup in suppliers){

if (suppliers[sup]["category"].includes(category) && suppliers[sup]["role"]==type){
await sleep(12000);
bot.sendMessage(`${suppliers[sup]["number"]}@c.us`, message)
console.log('send',suppliers[sup])
}
}
         // console.log(number)
         // if (numbers[number].category){
         //   if (numbers[number].category.includes(category)){
          //bot.sendMessage(`${number}@c.us`, message)
//console.log('sent 1')
//}
//}else{

        //const numbers = getNumbers()
        //console.log(numbers)
        //for (number in numbers){
         // console.log(number)
         // if (numbers[number].category){
         //   if (numbers[number].category.includes(category)){
          //bot.sendMessage(`${number}@c.us`, message)
//console.log('sent 1')
//}
//}else{
//bot.sendMessage(`${number}@c.us`, message)
//console.log('sent else')
//}        
//}
        res.sendStatus(200)
      }
      catch (err) {
        console.log("mailing error:", err)
        res.sendStatus(503)
      }
    })

    router.post("/postNumbers", async (req, res) => {
      try{
        const number = req.body.params.number.value
        const category = req.body.params.category.value
        console.log(number)
          const numbers = getNumbers()
          numbers[number] = {number: number, status: 1,category:category}
          fs.writeFileSync('./staticdata/numbers.json', JSON.stringify(numbers))
        res.sendStatus(200)
      }
      catch (err) {
        console.log("mailing error:", err)
        res.sendStatus(503)
      }
    })

    router.post("/deleteNumbers", async (req, res) => {
      try{
        const numbers = req.body
        if (numbers.length == 0){
          fs.writeFileSync('./staticdata/numbers.json', "{}")
        }
        else{
          for (number of numbers){
            number = number.replaceAll(" ", "").replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "")
            const numbers = getNumbers()
            delete numbers[number]
            fs.writeFileSync('./staticdata/numbers.json', JSON.stringify(numbers))
          }
        }
        res.sendStatus(200)
      }
      catch (err) {
        console.log("mailing error:", err)
        res.sendStatus(503)
      }
    })
    router.get("/init", async (req, res) => {
try {

        const qrCodeText = global.qrcode;
           const src = '/home/whatsapp_mailing/staticdata/qrcode.png';
            //   const stream = fs.createWriteStream(src);
              // const code = await QRCode.toFileStream(stream,global.qrcode);

           res.sendFile(src);
//        res.send("ds")
    } catch(err) {
console.log('err',err);
        res.json(err);
    }
    })
    router.post("/postMailing", (req, res) => {
        try{
            const numbers = req.body.numbers
            const message = req.body.message
            for (number of numbers){
              number = number.replaceAll(" ", "").replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "")
                try{
                  bot.sendMessage(`${number}@c.us`, message)
                }catch{
                  console.log("number error")
                }
            }
            res.sendStatus(200)
        }
        catch (err) {
            console.log("mailing error:", err)
            res.sendStatus(503)
        }
    })
    
    // whatsapp mailing http requests
    app.use('/wh/mailing', router)

}

init(settings)
