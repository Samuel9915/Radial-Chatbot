"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('hello world', process.env.BOT_TOKEN);
let bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    console.log('started');
});
bot.on('text', (ctx) => {
    console.log('I received a text message');
    console.log(ctx.update.message);
    let msg = ctx.update.message.text;
    ctx.reply(`You said ${msg}`);
});
bot.on('location', (ctx) => {
    console.log(ctx.update.message);
    ctx.reply(`I know where you live, haha`);
});
bot.on('photo', (ctx) => {
    console.log(ctx.update.message);
});
bot.on('document', (ctx) => {
    console.log(ctx.update.message);
});
bot.on('contact', (ctx) => {
    console.log(ctx.update.message);
});
bot.on('audio', (ctx) => {
    console.log(ctx.update.message);
});
bot.on('video', (ctx) => {
    console.log(ctx.update.message);
});
bot.launch();
