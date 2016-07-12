var SlackBot = require("slackbots"),
    request = require("request");

var bot = new SlackBot({
  token: process.env.SLACKBOT_TOKEN
});

var messageHandler = function(message){
  // Slack wraps urls in <>
  var messageUrls = message.text.match(/(?!<)(http.*?)(?=>)/gi) || [];

  messageUrls.forEach(function(url){
    // send to webtask, which will try to upload it to Imgur
    request({
      method: "GET",
      url: "https://webtask.it.auth0.com/api/run/wt-codyrushing-gmail_com-0/imgur-album-upload",
      qs: {
        webtask_no_cache: 1,
        imageUrl: url,
        imageDescription: "Original url: " + url
      },
    }, function(err, res, body){
      if (!err){
        // notify the general channel that the upload was successful
        bot.postMessageToChannel("general", body);
      }
    });
  });
};

bot.on("start", (err) =>{
  if (err) throw new Error("Could not connect to slack");
  console.log("Connected successfully :)");
  bot.on("message", function (msg) {
    // only accept messages which are not blank, and not from the bot
    if (msg.type === "message" && msg.username !== "bot" && msg.text) messageHandler(msg);
  });
});
