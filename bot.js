const Discord = require('discord.js');

const client = new Discord.Client();

const ytdl = require('ytdl-core');

const request = require('request');

const fs = require('fs');

const getYoutubeID = require('get-youtube-id');

const fetchVideoInfo = require('youtube-info');


const yt_api_key = "AIzaSyDeoIH0u1e72AtfpwSKKOSy3IPp2UHzqi4";

const prefix = '1';

client.on('ready', function() {

    console.log(`Mal Team ${client.user.username}`);

});

/*

////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\

*/

var servers = [];

var queue = [];

var guilds = [];

var queueNames = [];

var isPlaying = false;

var dispatcher = null;

var voiceChannel = null;

var skipReq = 0;

var skippers = [];

var now_playing = [];

/*

\\\\\\\\\\\\\\\\\\\\\\\\V/////////////////////////

\\\\\\\\\\\\\\\\\\\\\\\\V/////////////////////////

\\\\\\\\\\\\\\\\\\\\\\\\V/////////////////////////By:Mahmoud-QuaStyle

\\\\\\\\\\\\\\\\\\\\\\\\V/////////////////////////

*/

client.on('ready', () => {});\\\\\\\\\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle

var download = function(uri, filename, callback) {\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
    request.head(uri, function(err, res, body) {\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle

        console.log('content-type:', res.headers['content-type']);\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
        console.log('content-length:', res.headers['content-length']);\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
    });\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle

};

\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
client.on('message', function(message) {

    const member = message.member;\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle

    const mess = message.content.toLowerCase();\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle

    const args = message.content.split(' ').slice(1).join(' ');\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle


    if (mess.startsWith(prefix + 'play')) {\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle

        if (!message.member.voiceChannel) return message.channel.send('**❌ You have to be in a voice channel to use this command.**');

        // if user is not insert the URL or song title
\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
        if (args.length == 0) {

            let play_info = new Discord.RichEmbed()\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle

                .setAuthor(client.user.username, client.user.avatarURL)

                .setFooter('' + message.author.tag)\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle

                .setDescription('**1play [Link or query]**')

            message.channel.sendEmbed(play_info)

            return;

        }

        if (queue.length > 0 || isPlaying) {

            getID(args, function(id) {

                add_to_queue(id);

                fetchVideoInfo(id, function(err, videoInfo) {

                    if (err) throw new Error(err);

                    let play_info = new Discord.RichEmbed()

                        .setAuthor(client.user.username, client.user.avatarURL)

                        .addField('Added To Queue', `**

${videoInfo.title}

**`)
\\\\\\\\\\\\\\\/////////////////////////By:Mahmoud-QuaStyle
                        .setColor("#a637f9")

                        .setFooter('' + message.author.tag)

                        .setThumbnail(videoInfo.thumbnailUrl)

                    message.channel.sendEmbed(play_info);

                    queueNames.push(videoInfo.title);

                    now_playing.push(videoInfo.title);


                });

            });

        }/////////////////////////By:Mahmoud-QuaStyle

        else {


            isPlaying = true;

            getID(args, function(id) {

                queue.push('placeholder');

                playMusic(id, message);

                fetchVideoInfo(id, function(err, videoInfo) {

                    if (err) throw new Error(err);

                    let play_info = new Discord.RichEmbed()

                        .setAuthor(client.user.username, client.user.avatarURL)

                        .addField('Searching 🔎', `**${videoInfo.title}
/////////////////////By:Mahmoud-QuaStyle
**`)

                      .setColor("RANDOM")

                        .addField(`بواسطه`, message.author.username)

                        .setThumbnail(videoInfo.thumbnailUrl)


                    // .setDescription('?')

                    message.channel.sendEmbed(play_info)

               message.channel.send(`

**Playing 🎶** **${videoInfo.title}**`)/////////////////////By:Mahmoud-QuaStyle

               client.user.setActivity(videoInfo.title, {type:'LISTENING'});

                });

            });

        }

    }/////////////////////By:Mahmoud-QuaStyle

    else if (mess.startsWith(prefix + 'skip')) {

        if (!message.member.voiceChannel) return message.channel.send('**❌ You have to be in a voice channel to use this command.**');

        message.channel.send('**⏩ Skipped 👍**').then(() => {

            skip_song(message);/////////////////////By:Mahmoud-QuaStyle

            var server = server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();

        });

    }
/////////////////////By:Mahmoud-QuaStyle
    else if (message.content.startsWith(prefix + 'volume')) {

        if (!message.member.voiceChannel) return message.channel.send('**❌ You have to be in a voice channel to use this command.**');

        // console.log(args)

        if (args > 100) return message.channel.send('**100-1**')

        if (args < 1) return message.channel.send('**100-1**')

        dispatcher.setVolume(1 * args / 50);

        message.channel.sendMessage(`**Volume: ** **${dispatcher.volume*50}%** `);

    }/////////////////////By:Mahmoud-QuaStyle

    else if (mess.startsWith(prefix + 'pause')) {/////////////////////By:Mahmoud-QuaStyle

        if (!message.member.voiceChannel) return message.channel.send('**❌ You have to be in a voice channel to use this command.**');

        message.channel.send('**Paused ⏸**').then(() => {

            dispatcher.pause();/////////////////////By:Mahmoud-QuaStyle

        });/////////////////////By:Mahmoud-QuaStyle

    }/////////////////////By:Mahmoud-QuaStyle

    else if (mess.startsWith(prefix + 'resume')) {/////////////////////By:Mahmoud-QuaStyle

        if (!message.member.voiceChannel) return message.channel.send('**❌ You have to be in a voice channel to use this command.**');

            message.channel.send('**⏯ Resuming 👍**').then(() => {

            dispatcher.resume();/////////////////////By:Mahmoud-QuaStyle

        });
/////////////////////By:Mahmoud-QuaStyle
    }
/////////////////////By:Mahmoud-QuaStyle
    else if (mess.startsWith(prefix + 'leave')) {/////////////////////By:Mahmoud-QuaStyle

        if (!message.member.voiceChannel) return message.channel.send('**❌ You have to be in a voice channel to use this command.**');

        message.channel.send('**📭 Successfully disconnected**');/////////////////////By:Mahmoud-QuaStyle

        var server = server = servers[message.guild.id];/////////////////////By:Mahmoud-QuaStyle

        if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();/////////////////////By:Mahmoud-QuaStyle

    }/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
    else if (mess.startsWith(prefix + 'join')) {/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
        if (!message.member.voiceChannel) return message.channel.send('**❌ You have to be in a voice channel to use this command.**');
/////////////////////By:Mahmoud-QuaStyle
        message.member.voiceChannel.join().then(message.channel.send('**👍 Joined**'));/////////////////////By:Mahmoud-QuaStyle

    }/////////////////////By:Mahmoud-QuaStyle

    else if (mess.startsWith(prefix + 'play')) {
/////////////////////By:Mahmoud-QuaStyle
        if (!message.member.voiceChannel) return message.channel.send('**❌ You have to be in a voice channel to use this command.**');
/////////////////////By:Mahmoud-QuaStyle
        if (isPlaying == false) return message.channel.send('**❌ The player is not paused**');
/////////////////////By:Mahmoud-QuaStyle
        let playing_now_info = new Discord.RichEmbed()
/////////////////////By:Mahmoud-QuaStyle
            .setAuthor(client.user.username, client.user.avatarURL)
/////////////////////By:Mahmoud-QuaStyle
            .addField('Searching 🔎', `**

${videoInfo.title}
/////////////////////By:Mahmoud-QuaStyle
**`)/////////////////////By:Mahmoud-QuaStyle
/////////////////////////////////////////By:Mahmoud-QuaStyle/By:Mahmoud-QuaStyle
            .setColor("RANDOM")/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
            .setFooter('Added To Queue: ' + message.author.tag)/////////////////////By:Mahmoud-QuaStyle

            .setThumbnail(videoInfo.thumbnailUrl)/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
        //.setDescription('?') 

        message.channel.sendEmbed(playing_now_info);/////////////////////By:Mahmoud-QuaStyle

    }/////////////////////By:Mahmoud-QuaStyle

});/////////////////////By:Mahmoud-QuaStyle


function skip_song(message) {/////////////////////By:Mahmoud-QuaStyle

    if (!message.member.voiceChannel) return message.channel.send('**❌ You have to be in a voice channel to use this command.**');

    dispatcher.end();/////////////////////By:Mahmoud-QuaStyle

}


function playMusic(id, message) {/////////////////////By:Mahmoud-QuaStyle

    voiceChannel = message.member.voiceChannel;/////////////////////By:Mahmoud-QuaStyle



    voiceChannel.join().then(function(connectoin) {/////////////////////By:Mahmoud-QuaStyle

        let stream = ytdl('https://www.youtube.com/watch?v=' + id, {/////////////////////By:Mahmoud-QuaStyle

            filter: 'audioonly'

        });

        skipReq = 0;

        skippers = [];


        dispatcher = connectoin.playStream(stream);/////////////////////By:Mahmoud-QuaStyle

        dispatcher.on('end', function() {/////////////////////By:Mahmoud-QuaStyle

            skipReq = 0;/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
            skippers = [];
/////////////////////By:Mahmoud-QuaStyle
            queue.shift();

            queueNames.shift();
/////////////////////By:Mahmoud-QuaStyle/////////////////////By:Mahmoud-QuaStyle
            if (queue.length === 0) {
/////////////////////By:Mahmoud-QuaStyle
                queue = [];/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
                queueNames = [];
/////////////////////By:Mahmoud-QuaStyle
                isPlaying = false;

            }

            else {/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
                setTimeout(function() {/////////////////////By:Mahmoud-QuaStyle

                    playMusic(queue[0], message);/////////////////////By:Mahmoud-QuaStyle

                }, 500);/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
            }/////////////////////By:Mahmoud-QuaStyle

        });/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
    });/////////////////////By:Mahmoud-QuaStyle

}/////////////////////By:Mahmoud-QuaStyle

/////////////////////By:Mahmoud-QuaStyle
function getID(str, cb) {/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-/////////////////////By:Mahmoud-QuaStyleQuaStyle
    if (isYoutube(str)) {/////////////////////By:Mahmoud-QuaStyle

        cb(getYoutubeID(str));/////////////////////By:Mahmoud-QuaStyle

    }/////////////////////By:Mahmoud-QuaStyle

    else {/////////////////////By:Mahmoud-QuaStyle

        search_video(str, function(id) {/////////////////////By:Mahmoud-QuaStyle

            cb(id);
/////////////////////By:Mahmoud-QuaStyle
        });/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
    }/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
}
/////////////////////By:Mahmoud-QuaStyle

function add_to_queue(strID) {/////////////////////By:Mahmoud-QuaStyle

    if (isYoutube(strID)) {

        queue.push(getYoutubeID(strID));/////////////////////By:Mahmoud-QuaStyle

    }

    else {/////////////////////By:Mahmoud-QuaStyle
/////////////////////By:Mahmoud-QuaStyle
        queue.push(strID);

    }

}


function search_video(query, cb) {

    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body) {

        var json = JSON.parse(body);/////////////////////By:Mahmoud-QuaStyle

        cb(json.items[0].id.videoId);/////////////////////By:Mahmoud-QuaStyle

    });

}



function isYoutube(str) {/////////////////////By:Mahmoud-QuaStyle

    return str.toLowerCase().indexOf('youtube.com') > -1;/////////////////////By:Mahmoud-QuaStyle

}


////////////////////By:Mahmoud-QuaStyle
////////////////////By:Mahmoud-QuaStyle
////////////////////By:Mahmoud-QuaStyle


////////////////////By:Mahmoud-QuaStyle









////////////////////By:Mahmoud-QuaStyle

////////////////////By:Mahmoud-QuaStyle

const developers = ["411137717884289024","another id","another another id"]////////////////////By:Mahmoud-QuaStyle

const adminprefix = '1';

client.on('message', message => {

    var argresult = message.content.split(` `).slice(1).join(' ');

      if (!developers.includes(message.author.id)) return;

      

  if (message.content.startsWith(adminprefix + 'playing')) {

    client.user.setGame(argresult);

          if(!message.channel.guild) return;

                            var msg = `${Date.now() - message.createdTimestamp}`

                            var api = `${Math.round(client.ping)}`

                            if (message.author.bot) return;

                        let embed = new Discord.RichEmbed()

                        .setAuthor(message.author.username,message.author.avatarURL)

                        .setColor('RANDOM')////////////////////By:Mahmoud-QuaStyle
////////////////////By:Mahmoud-QuaStyle////////////////////By:Mahmoud-QuaStyle
                 .addField("**PLAYING 🎮 **","** **")

         message.channel.send({embed:embed});

                        }

  

     if (message.content === (adminprefix + "leaveserver")) {

    message.guild.leave(); 

  } else 

  if (message.content.startsWith(adminprefix + 'watching')) {

  client.user.setActivity(argresult, {type:'WATCHING'});

         if(!message.channel.guild) return;

                            var msg = `${Date.now() - message.createdTimestamp}`

                            var api = `${Math.round(client.ping)}`

                            if (message.author.bot) return;

                        let embed = new Discord.RichEmbed()

                        .setAuthor(message.author.username,message.author.avatarURL)

                        .setColor('RANDOM')

                        .addField("**WATCHING 📹 **","** **")

         message.channel.send({embed:embed});

                        }

  

  if (message.content.startsWith(adminprefix + 'listening')) {

  client.user.setActivity(argresult , {type:'LISTENING'});

       if(!message.channel.guild) return;

                            var msg = `${Date.now() - message.createdTimestamp}`

                            var api = `${Math.round(client.ping)}`

                            if (message.author.bot) return;

                        let embed = new Discord.RichEmbed()

                        .setAuthor(message.author.username,message.author.avatarURL)

                        .setColor('RANDOM')

                        .addField("**LISTENING 🎼 **","** **")

         message.channel.send({embed:embed});

                        }

  

  if (message.content.startsWith(adminprefix + 'streaming')) {

    client.user.setGame(argresult, "https://www.twitch.tv/idk");

        if(!message.channel.guild) return;

                            var msg = `${Date.now() - message.createdTimestamp}`

                            var api = `${Math.round(client.ping)}`

                            if (message.author.bot) return;

                        let embed = new Discord.RichEmbed()

                        .setAuthor(message.author.username,message.author.avatarURL)

                        .setColor('RANDOM')

                        .addField("**STREAMING 👾 **","** **")

         message.channel.send({embed:embed});

                        }

  if (message.content.startsWith(adminprefix + 'setname')) {

  client.user.setUsername(argresult).then

      message.channel.send(`**Changing The Name To , ⚡ ****${argresult}** `)

} else

if (message.content.startsWith(adminprefix + 'setavatar')) {
////////////////////By:Mahmoud-QuaStyle
  client.user.setAvatar(argresult);
////////////////////By:Mahmoud-QuaStyle
    message.channel.send(`**Changing The Avatar To , ⚡ ****${argresult}** `);

}

});














client.on('message', message => {

    if (message.author.bot) return;

     if (message.content === (prefix + "help")) {

  let embed = new Discord.RichEmbed()

          .setAuthor(message.author.username, message.author.avatarURL)

           .setThumbnail(message.author.avatarURL)

                 .setTimestamp()

    .setDescription(`

	 ** اوامر الموسيقى 🎶 **

**${prefix}play** : لتشغيل الاغاني

**${prefix}skip** : لتخطي الاغنية

**${prefix}volume** : لتحديد مستوى الصوت

**${prefix}pause** : للأيقاف المؤقت

**${prefix}resume** : للأستئناف

**${prefix}join** : لكي ينضم البوت للروم الصوتي

**${prefix}leave** : لكي يخرج البوت من الروم الصوتي

`)

.setColor('RANDOM')

message.author.sendEmbed(embed)

}

});


client.on('message', msg => {

      if(!msg.channel.guild) return;

    if(msg.content.startsWith (prefix + 'help')) {

    msg.reply('`تم أرسال المساعدة في الخاص`');

  }

});












client.login(process.env.BOT_TOKEN);
