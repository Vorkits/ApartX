from flask import Flask
import telebot
from flask import request
from telebot import types

app = Flask(__name__)
bot = telebot.TeleBot("5720762606:AAHj6_vCftcCAxUhrKIy8WptCtkFuLlluRo", parse_mode=None)

@app.route('/deny')
def deny():
    id=request.args.get('id')
    if id:
        bot.send_message(id,'К сожалению ваша почта не была найдена в базе данных, пожалуйста свяжитесь с администратором по номеру - +77073373318, а затем повторно нажмите - /start')
        return 'OK'

@app.route('/apply')
def apply():
    id=request.args.get('id')
    if id:
        bot.send_message(id,'Вы успешно прошли верификацию, теперь вам будут приходить уведомления от платформы zakup.kz')
        return 'OK'
@app.route('/mailing',methods=['POST'])
def mailig():
    request_data = request.get_json()
    rowid=request_data['rowid']
    button_bar = types.InlineKeyboardButton('Ответить на заявку', callback_data=f'reply {rowid}')
    keyboard = types.InlineKeyboardMarkup()
    keyboard.add(button_bar)
    for id in request_data['ids']:
        try:
            bot.send_message(id,request_data['message'], reply_markup=keyboard)
        except:
            pass
    return "OK"

@app.route('/notes',methods=['POST'])
def notes():
    request_data = request.get_json()
    for id in request_data['ids']:
        try:
            bot.send_message(id,request_data['message'])
        except:
            pass
    return "OK"

if __name__ == '__main__':
    app.run(port=5677,host='0.0.0.0')
