"use latest";
var request = require("request");
const IMGUR_ALBUM_ID = "CLCcl";

module.exports = function (ctx, done) {
  return request({
    method: "POST",
    url: "https://api.imgur.com/3/image",
    form: {
      image: ctx.data.imageUrl,
      album: ctx.data.IMGUR_ALBUM_DELETEHASH,
      description: ctx.data.imageDescription
    },
    headers: {
      "Authorization": `Client-ID ${ctx.data.IMGUR_CLIENT_ID}`
    }
  }, function (err, res, body) {
    try {
      if (err) throw new Error(err)
      body = JSON.parse(body);
      if(body.success){
        done(err, `Image added to album: https://imgur.com/a/${IMGUR_ALBUM_ID}`);
      }
    } catch(error) {
      done(error);
    }
  });
}
