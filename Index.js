const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = "!";
const YTDL = require("ytdl-core");
const Cleverbot = require("cleverbot-node");
const clbot = new Cleverbot;
clbot.configure({botapi: "CC6gwvlc0ctSlHmHv9UCGqxPIxg"});

var replies = [
  "Yes",
  "No",
  "Highly unlikely",
  "Maybe :wink:",
  "I do not know :neutral_face:",
  "Hmm ask again later :thinking:",
  "Definitely :smile:"
];

var servers = {};

var badwords = ['fuck','ass','frick','heck','damn','darn','shit','cunt','fag','hell','dick','sex','pusst','gay','tit','furries','furry','scalies','fag','poop','dildo','penis'];

bot.on('message', async message => {

    // ctrl+c to close
    // node . to start

    if(!message.content.startsWith(prefix)) return;    

//prevents bot from responding to itself    
    if(message.author.bot) return;

//play function
    function play(connection, message){
      var server = servers[message.guild.id];

      server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

      server.queue.shift();

      server.dispatcher.on("end",function(){
        if(server.queue[0]) play(connection, message);
        else connection.disconnect();
      });
    }

//Random number function    
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      }

    var args = message.content.substring(prefix.length).split(" ");
    var say = [];
    for(x=1;x<args.length;x++){
      say.push(args[x]);
    }

//command sequence    
    switch(args[0].toLowerCase()){
      case "ping":
          const m = await message.channel.send("Ping?");
          m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
          break;
      case "askbot":
          if (args[1])
            message.reply(replies[Math.floor(Math.random()*replies.length)]);
          else
            message.reply("No query detected");
          break;
      case "thicc":
          message.channel.send("https://www.youtube.com/watch?v=arnWU1sWqKw");
          break;
      case "badword":
          var check = 0;
          for(i=0;i<badwords.length;i++){
            if (args[1].includes(badwords[i])){
              message.reply('```SORRY SIR THIS IS A CHRISTIAN SERVER SO NO SWEARING.``` https://i.imgur.com/jSxJWBG.jpg')
              check++;
              break;
            }
          }
          if(check==0){
            message.reply("That word is allowed in this ENGLISH SPEAKING christian server")
          }
          break;
      case "say":
          const sayMessage = say.join(" ");
          message.delete();
          message.channel.send(sayMessage);
          break;
      case "rate":
          var rating = Math.floor(Math.random()*11);
          message.channel.send("I give that a " +rating);
          break;
      case "play":
          if(!args[1]){
            message.channel.send("Please provide a link");
            return;
          }

          if(!message.member.voiceChannel){
            message.channel.send("You must be in a voice channel");
            return;
          }

          if(!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
          }

          var server = servers[message.guild.id];

          server.queue.push(args[1]);

          if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
            play(connection, message);
          })
          break;
      case "skip":
          var server = servers[message.guild.id];
          
          if(server.dispatcher) server.dispatcher.end();

          break;
      case "stop":
          var server = servers[message.guild.id];

          if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();

          break;
      case "info":
          message.reply("Available commands: ping, thicc, badword, askbot, talkbot, rate, roll. Available music commands: play, skip, stop");
          break;
      case "roll":
          if(!args[1]){
              message.channel.send("I cant roll a no sided die!");
              return;
          }
          var sides = parseInt(args[1],10);
          var roll = Math.floor(Math.random()*sides)+1;
          message.channel.send("You rolled a " +roll);
          break;
      case "talkbot":
          clbot.write(message.content, (response) => {
            //message.channel.startTyping();
            setTimeout(() => {
              message.channel.send(response.output).catch(console.error);
              //message.channel.stopTyping();
            }, Math.random() * (1 - 3) + 1 * 1000);
          });
          break;
      default:
          message.channel.send("Invalid Command");
    }

});

bot.login(process.env.BOT_TOKEN);
