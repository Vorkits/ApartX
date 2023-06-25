from tinydb import TinyDB, Query
import telebot
import requests
from telebot import types
bot = telebot.TeleBot("5720762606:AAHj6_vCftcCAxUhrKIy8WptCtkFuLlluRo", parse_mode=None)
user_data_id={}
def test(message):
    email=message.text
    t=requests.post('https://snaryaga.kz/webhook/1726d76f-fd3d-4824-84a6-3f9038402617',json={'email':email,'id':message.chat.id},headers={'Content-Type': 'application/json'}).text
    print(t)
    bot.send_message(message.chat.id,'Проверяю номер, минуту')
@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    msg=bot.send_message(message.chat.id, "Спасибо за регистрацию в zakup.kz, для получаения рассылок в Telegram, отправьте свой email ниже.")
    bot.register_next_step_handler(msg,test)



def write_desc(message):
    print(user_data_id[message.chat.id]['message_id'])
    knopki2 = types.InlineKeyboardMarkup()
    desc=message.text
    user_data_id[message.chat.id]['desc']=desc 
    bot.send_message(message.chat.id,'Ваша заявка отправлена, с уважением zakup.kz')
    t=requests.post('https://snaryaga.kz/webhook/0c657eb3-4e74-4557-9dc6-d2941c4caed4',json={'id':message.chat.id,'date':user_data_id[message.chat.id]['date'],'price':user_data_id[message.chat.id]['price'],'desc':user_data_id[message.chat.id]['desc'],'rowid':user_data_id[message.chat.id]['rowid']},headers={'Content-Type': 'application/json'})
    bot.edit_message_reply_markup(chat_id=message.chat.id,message_id=user_data_id[message.chat.id]['message_id'], reply_markup=knopki2)
def write_date(message):
    date=message.text
    user_data_id[message.chat.id]['date']=date
    mesg=bot.send_message(message.chat.id,'Введите описание поставки: указать бренд или страну изготовителя, условия, описание товара:')
    bot.register_next_step_handler(mesg,write_desc)
def write_price(message):
    price=message.text
    user_data_id[message.chat.id]['price']=price
    mesg=bot.send_message(message.chat.id,'Введите дату поставки:')
    bot.register_next_step_handler(mesg,write_date)
@bot.callback_query_handler(func=lambda c:True)
def inlin(c):
    if 'reply' in  c.data :
        print(c.message.message_id)
        rowid=c.data.replace('reply ','')
        user_data_id[c.message.chat.id]={"rowid":rowid,'price':'','desc':'','date':'','message_id':int(c.message.message_id)}
        mesg=bot.send_message(c.message.chat.id, 'Введите сумму за поставку с учетом доставки:')
        bot.register_next_step_handler(mesg,write_price)
bot.infinity_polling()
