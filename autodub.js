var autoDub = {
  started: false,
  mode: "classic",
  version: "00.49.2",
  whatsNew: "Minor improvments and fixes for Firefox users.",
  firstMessage: "Hey there! AutoDub upvotes at a random time during the song. There's a countdown timer hidden in the 'AUTODUB' tab above the video box.",
  lastLoaded: null,
  roomCheck: null,
  altDancers: false,
  songtimer: null,
  nm: false,
  eveTalk: false,
  songInfo: {},
  queueThanks: true,
  pmPlus: false,
  nmImage: "https://thompsn.com/autodub/adlogo.svg",
  firstTalk: false,
  hideAvatars: false,
  dvm: true,
  users: {},
  joinLeaves: false,
  userid: null,
  toolTip: null,
  lastSong: null,
  desktopNotifications: true,
  shootDucks: true,
  discoballDancers: true,
};

autoDub.versionMessage = function() {
  if (autoDub.lastLoaded == autoDub.version) {
    var msg = "<li style=\"font-weight:700; color:cyan; text-transform:none; font-size:14px;\" class=\"system\">[AutoDub] v" + autoDub.version + " is running.</li>";
  } else if (!autoDub.lastLoaded) {
    var newStuff = "<span style=\"font-weight:700; color:cyan;\">[AutoDub] Welcome to AutoDub v" + autoDub.version + "</span><br/>";
    autoDub.lastLoaded = autoDub.version;
    autoDub.storage.save();
    newStuff += autoDub.firstMessage;
    var msg = "<li style=\"color:#eee; font-weight:400;text-transform:none; font-size:14px;\" class=\"system\">" + newStuff + "</li>";
  } else if (autoDub.whatsNew !== "") {
    var newStuff = "<span style=\"font-weight:700; color:cyan;\">[AutoDub] New in v" + autoDub.version + "</span><br/>";
    autoDub.lastLoaded = autoDub.version;
    autoDub.storage.save();
    newStuff += autoDub.whatsNew;
    var msg = "<li style=\"color:#eee; font-weight:400;text-transform:none; font-size:14px;\" class=\"system\">" + newStuff + "</li>";
  } else {
    autoDub.lastLoaded = autoDub.version;
    autoDub.storage.save();
    var msg = "<li style=\"font-weight:700; color:cyan; text-transform:none; font-size:14px;\" class=\"system\">[AutoDub] v" + autoDub.version + " is running.</li>";
  }
  $(".chat-main").append(msg);
};

autoDub.newSong = function(data) {
  autoDub.mode = "timer";
  console.log(data);
  if (data.song.songid == autoDub.lastSong && autoDub.mode == "timer") return;
  autoDub.lastSong = data.song.songid;
  var songName = data.songInfo.name;
  if (songName.match(/arnold/i) && songName.match(/luke/i) && songName.match(/million/i)) {
    autoDub.idmode.arnold = true;
  } else {
    autoDub.idmode.arnold = false;
  }
  var duration = data.songInfo.songLength;
  var length = Math.floor(duration);
  var whatever = (Math.random() * 4) + 1;
  var thetimer = Math.floor(length / whatever);
  if (autoDub.songtimer != null) {
    clearTimeout(autoDub.songtimer);
    autoDub.songtimer = null;
    $("#autoDubTimer").countdown("destroy");
  }
  console.log(thetimer / 1000);
  var thetimer2 = Math.floor(thetimer / 1000);
  $("#autoDubTimer").countdown({
    until: +thetimer2,
    compact: true,
    description: "",
    format: "MS"
  });
  var foo = songName.split(" - ");
  var artist = foo[0];
  var title = foo[1];
  autoDub.songInfo = {
    artist: artist,
    title: title
  };
  autoDub.songtimer = setTimeout(function() {
    autoDub.songtimer = null;
    $("#autoDubTimer").countdown("destroy");
    $("#autoDubTimer").text("voted");
    $(".dubup").click();
    console.log("voted.");
  }, thetimer);
  if (autoDub.lastfm.timer != null) {
    clearTimeout(autoDub.lastfm.timer);
    autoDub.lastfm.timer = null;
  }
  //last.fm stuff
  if (autoDub.lastfm.sk) {
    autoDub.lastfm.duration = Math.floor(length / 1000);
    autoDub.lastfm.songStart = Math.floor((new Date()).getTime() / 1000);
    autoDub.lastfm.timer = setTimeout(function() {
      autoDub.lastfm.timer = null;
      autoDub.lastfm.scrobble();
    }, length - 3000);
    autoDub.lastfm.nowPlaying();
  }
};

autoDub.newChat = function(data) {
  var id = data.chatid;
  var uid = data.user._id;
  var name = data.user.username;
  var msg = data.message;
  if (autoDub.shootDucks == true) {
    ducktimematch = /Quack quack../i;
    deadduckmatch = /(?:^|\s)(.*?) nice\!(.*?)have a (.*?)(?:^|\s)discocheque reward\./i;
    if (Notification) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      } else {
        if (uid == "560164dd2e803803000fffb6" && msg.match(ducktimematch)) {
          var ducknotification = new Notification('Quack quack...', {
            icon: 'https://i.imgur.com/1huAkzf.png',
            body: "・゜ ​ ゜・。。・゜゜\_ö<",
          });
          ducknotification.onclick = function() {
            Dubtrack.room.chat._messageInputEl.val("!shootduck");
            Dubtrack.room.chat.sendMessage();
          };
        } else if (uid == "560164dd2e803803000fffb6" && msg.match(deadduckmatch)) {
          var deadduckinfo = deadduckmatch.exec(msg);
          var bodycopy = deadduckinfo[1] + " +" + deadduckinfo[3] + " DCs. Yay!";
          var duckdeadnotification = new Notification('THE DUCKY LOST.', {
            icon: 'https://i.imgur.com/1huAkzf.png',
            body: bodycopy,
          });
        } else if (uid == "560164dd2e803803000fffb6" && msg.match(/DUCK FLEW AWAY\!/)) {
          var duckdeadnotification = new Notification('DUCK FLEW AWAY!', {
            icon: 'https://i.imgur.com/1huAkzf.png',
            body: "wah wah waaaah",
          });
        }
      }
    }
  }
  if (autoDub.desktopNotifications == true) {
    var yourStupidName = '@' + $('.user-info span').text();
    if (Notification) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      } else {
        if (msg.match(yourStupidName, 'i') || msg.match(/\@everyone/)) {
          var notification = new Notification(name, {
            icon: 'https://api.dubtrack.fm/user/' + uid + '/image',
            body: msg,
          });
        }
      }
    }
  }

  if (autoDub.idmode.userid && autoDub.idmode.arnold) {
    setTimeout(function() {
      $(".chat-id-" + id).find(".cursor-pointer").attr("src", "https://i.imgur.com/1AME7v3.png");
    }, 1500);
  }
};

autoDub.chatSpam = {
  joinLeave: function(id, name, type) {
    var color = "#b6ffc0";
    var msg = name + " has joined the room";
    if (type == "leave") {
      color = "#ffa1a1";
      msg = name + " left the room";
    }
    $(".chat-main").append("<li style=\"color:" + color + ";\">" + msg + ".</li>");
    Dubtrack.room.chat.scollBottomChat();
  },
  dv: function(name) {
    $(".chat-main").append("<li style=\"color:magenta;\">" + name + " downvoted this song.</li>");
    Dubtrack.room.chat.scollBottomChat();
  }
};

autoDub.closePM = function(id) {
  $("#sneakText" + id).unbind("keypress");

  $("#sneakybox" + id).remove();

};
autoDub.makeConvo = function(userid, coolName) {
  if ($(".pmbox" + coolName).length) return;
  var nicedata = 'usersid%5B%5D=' + userid;


  $.ajax({
    url: 'https://api.dubtrack.fm/message/',
    type: 'POST',
    data: nicedata,
    crossDomain: true,
    success: function(response) {
      message_id = response.data._id

      $.ajax({
        url: 'https://api.dubtrack.fm/message/' + message_id,
        type: 'GET',
        crossDomain: true,
        success: function(data) {

          console.log(data);
          if (!$("#sneakybox" + message_id).length) {


            //CREATE THE PM BOX
            $('#sneakyPM').append('<div id="sneakybox' + message_id + '" class="sneakyPMWindow pmbox' + coolName + '"><div class="sneakyTop">' + coolName + ' <div class="sneakyClose" onclick="autoDub.closePM(\'' + message_id + '\')">x</div></div><div id="sneakTexty' + message_id + '" class="sneakyPmtxt"></div><input id="sneakText' + message_id + '" class="sneakypmPut" type="text"></div>');
            $('#sneakText' + message_id).keypress(function(e) {
              var key = e.which;
              if (key == 13) // the enter key code
              {
                var textValue = $(this).attr('id');
                var message_id1 = textValue.substring(9, textValue.length);

                var stuff = $('#sneakText' + message_id1).val();
                console.log(message_id1);
                console.log(stuff);
                if (stuff != "") {
                  var dat = {
                    "created": 1450294100941,
                    "message": stuff,
                    "userid": "56015d872e803803000ffde6",
                    "messageid": "",
                    "_message": {

                    },
                    "_user": {
                      "username": "ned_stark_reality",
                      "status": 1,
                      "roleid": 1,
                      "dubs": 0,
                      "created": 1442930054513,
                      "lastLogin": 0,
                      "userInfo": {
                        "_id": "56015d872e803803000ffde7",
                        "locale": "en_US",
                        "userid": "56015d872e803803000ffde6",
                        "__v": 0
                      },
                      "_force_updated": 1448741219759,
                      "_id": "56015d872e803803000ffde6",
                      "__v": 0
                    }
                  };


                  $.ajax({
                    url: 'https://api.dubtrack.fm/message/' + message_id1,
                    type: 'POST',
                    data: dat,
                    crossDomain: true,
                  });
                  $('#sneakText' + message_id1).val('');

                }
              }
            });


            for (var i = 0; i < data.data.length; i++) {
              var nice = data.data[i];

              var msg0 = data.data[i].message;
              var msg1 = Dubtrack.helpers.text.convertHtmltoTags(msg0);
              var user1 = data.data[i]._user.username;
              $('#sneakTexty' + message_id).prepend('<div class="sneakyMsg"><strong>' + user1 + ':</strong> ' + msg1 + '</div>');

            }
            emojify.run(document.getElementById('sneakTexty' + message_id));

            $("#sneakTexty" + message_id).scrollTop($("#sneakTexty" + message_id)[0].scrollHeight);
          }


        },
        error: function(xhr, textStatus, errorThrown) {
          console.log('ajax pm failed :( ');
        }
      });

    },
    error: function(xhr, textStatus, errorThrown) {
      console.log(xhr);
    }
  });

};

autoDub.newPM = function(event) {
  if (autoDub.pmPlus) {
    var user_id = event.userid;
    //console.log(event);

    var message_id = event.messageid;

    $.ajax({
      url: 'https://api.dubtrack.fm/message/' + message_id,
      type: 'GET',
      crossDomain: true,
      success: function(data) {
        var msg = data.data[0].message;
        var user = data.data[0]._user.username;
        console.log(data);
        $.ajax({
          url: 'https://api.dubtrack.fm/message/' + message_id + '/read',
          type: 'POST',
          crossDomain: true,
          success: function(data2) {
            console.log(data2);

            if (!$("#sneakybox" + message_id).length) {

              //CREATE THE PM BOX
              $('#sneakyPM').append('<div id="sneakybox' + message_id + '" class="sneakyPMWindow pmbox' + user + '"><div class="sneakyTop"><span class=\"psons\" id=\"psons' + message_id + '\"></span> <div class="sneakyClose" onclick="autoDub.closePM(\'' + message_id + '\')">x</div></div><div id="sneakTexty' + message_id + '" class="sneakyPmtxt"></div><input id="sneakText' + message_id + '" class="sneakypmPut" type="text"></div>');
              if (data2.data.usersid.length > 2) {
                var notyou = data2.data.usersid.length - 1;
                $("#psons" + message_id).text("Group (" + notyou + ")");
              }
              for (var ok = 0; ok < data2.data.usersid.length; ok++) {
                if (data2.data.usersid[ok] !== Dubtrack.session.id) {
                  $.ajax({
                    url: 'https://api.dubtrack.fm/user/' + data2.data.usersid[ok],
                    type: 'GET',
                    crossDomain: true,
                    success: function(data3) {
                      if (data2.data.usersid.length > 2) {
                        var carto = "psons" + message_id;
                        var elementTitle = document.getElementById(carto).title;
                        document.getElementById(carto).title = elementTitle + data3.data.username + "\n";
                      } else {
                        $("#psons" + message_id).append(data3.data.username + " ");
                      }
                    }
                  });
                }
              }
              $('#sneakText' + message_id).keypress(function(e) {

                var key = e.which;
                if (key == 13) // the enter key code
                {
                  var textValue = $(this).attr('id');
                  var message_id1 = textValue.substring(9, textValue.length);


                  console.log(e);
                  var stuff = $('#sneakText' + message_id1).val();
                  if (stuff != "") {
                    var dat = {
                      "created": 1450294100941,
                      "message": stuff,
                      "userid": "56015d872e803803000ffde6",
                      "messageid": "",
                      "_message": {

                      },
                      "_user": {
                        "username": "ned_stark_reality",
                        "status": 1,
                        "roleid": 1,
                        "dubs": 0,
                        "created": 1442930054513,
                        "lastLogin": 0,
                        "userInfo": {
                          "_id": "56015d872e803803000ffde7",
                          "locale": "en_US",
                          "userid": "56015d872e803803000ffde6",
                          "__v": 0
                        },
                        "_force_updated": 1448741219759,
                        "_id": "56015d872e803803000ffde6",
                        "__v": 0
                      }
                    };


                    $.ajax({
                      url: 'https://api.dubtrack.fm/message/' + message_id1,
                      type: 'POST',
                      data: dat,
                      crossDomain: true,
                    });
                    $('#sneakText' + message_id1).val('');

                  }
                }
              });
              for (var i = 0; i < data.data.length; i++) {
                var nice = data.data[i];

                var msg0 = data.data[i].message;
                var msg1 = Dubtrack.helpers.text.convertHtmltoTags(msg0);
                var user1 = data.data[i]._user.username;
                $('#sneakTexty' + message_id).prepend('<div class="sneakyMsg"><strong>' + user1 + ':</strong> ' + msg1 + '</div>');

              }
              emojify.run(document.getElementById('sneakTexty' + message_id));

              $("#sneakTexty" + message_id).scrollTop($("#sneakTexty" + message_id)[0].scrollHeight);


            } else {
              var newChat = "";
              for (var i = data.data.length - 1; i >= 0; i--) {
                var nice = data.data[i];
                var msg0 = data.data[i].message;
                var msg1 = Dubtrack.helpers.text.convertHtmltoTags(msg0);
                var user1 = data.data[i]._user.username;
                newChat += '<div class="sneakyMsg"><strong>' + user1 + ':</strong> ' + msg1 + '</div>';

              }
              $("#sneakTexty" + message_id).html(newChat);
              emojify.run(document.getElementById('sneakTexty' + message_id));

              $("#sneakTexty" + message_id).scrollTop($("#sneakTexty" + message_id)[0].scrollHeight);


            }



          },
          error: function(xhr, textStatus, errorThrown) {
            console.log('ajax pm failed :( ');
          }
        });

      }
    });
  }

};
autoDub.init = function() {
  console.log("enter init");
  var pattern = /[?&]token=/;
  var pattern2 = /[?&]rohn=/;
  var URL = location.search;

  if (pattern.test(URL) && !autoDub.lastfm.sk) {
    var queries = {};
    $.each(document.location.search.substr(1).split('&'), function(c, q) {
      var i = q.split('=');
      queries[i[0].toString()] = i[1].toString();
    });
    //token time
    var params = {
      api_key: autoDub.lastfm.key,
      token: queries.token,
      method: "auth.getSession"
    };

    var sig = autoDub.lastfm.getApiSignature(params);
    params.api_sig = sig;

    var request_url = 'https://ws.audioscrobbler.com/2.0/?' + serialize(params) + "&format=json";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', request_url, true);
    xhr.onload = autoDub.lastfm.newSession(xhr);
    xhr.onerror = autoDub.lastfm._onAjaxError;

    xhr.send();
  }

  autoDub.started = true;
  var script = document.createElement('script');
  script.id = 'aptimer';
  script.type = 'text/javascript';
  script.src = 'https://autodub.firebaseapp.com/jquery.countdown.min.js';
  document.body.appendChild(script);
  Dubtrack.Events.bind("realtime:room_playlist-update", autoDub.newSong);
  Dubtrack.Events.bind("realtime:user-leave", autoDub.userLeave);
  Dubtrack.Events.bind("realtime:user-join", autoDub.userJoin);
  Dubtrack.Events.bind("realtime:room_playlist-dub", autoDub.newVote);
  Dubtrack.Events.bind("realtime:chat-message", autoDub.newChat);
  Dubtrack.Events.bind("realtime:new-message", autoDub.newPM);

  console.log("events binded");

  // $(".dubup").click();

  console.log("autodub v" + autoDub.version + " is a go!");
  $("<style>span#adubEmojiButton:hover { -webkit-filter: grayscale(0); filter: none; }#chatDTEmojis::-webkit-scrollbar-track {} #chatDTEmojis::-webkit-scrollbar-thumb { background-color: #ffffff17; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; } #chatDTEmojis::-webkit-scrollbar { width: 10px; } .sneakyMsg a {color: #00f;}.adbsettings a{display: block;padding: 8px 0;padding: .5rem 0;border-bottom: 1px solid #878c8e;color:#878c8e;zoom: 1;} div#chatDTEmojis { display:none; width: 100%; position: relative; height: 200px; background-color: #0a0a0a; margin-top: -260px; overflow-y: scroll; } #chat .pusher-chat-widget-input #chat-txt-message { padding-right: 6.25rem !important; } #adubEmojiButton { background: url(https://www.dubtrack.fm/assets/emoji/apple/sunglasses.png); height: 20px; width: 20px; display: inline-block; margin-top: 1px; filter: gray; -webkit-filter: grayscale(1); filter: grayscale(1); background-size: cover; vertical-align: top; } .autodubmoji { width: 20px; height: 20px; display: inline-block; background-size:cover; cursor: pointer; color:transparent; overflow:hidden; } #autodubEmojiSearch{ width:100%; font-size:14px; margin-bottom: 10px; border-bottom: 1px solid #ccc; font-family:helvetica,arial,sans-serif; } input#autodubEmojiSearch {} #adubEmojis h2 { font-size: 12px; font-weight: 700; text-align: center; margin-bottom: 10px; padding-top: 10px; } div#adubEmojis { padding: 10px; }</style>").appendTo("head");
  $("<div style=\"padding-bottom: 56.25%; display:none; position: relative; z-index: 5;\" id=\"noumBoard\"><div id=\"noumcon\" style=\"height: 100%; width: 100%; position: absolute; top: 0; left: 0; overflow-y: scroll; padding: 0 16px 0 0; padding: 0 1rem 0 0;\"><div style=\"font-size:35px;font-weight:700; padding-bottom:15px; text-align:center;\">AutoDub v" + autoDub.version + "</div><div style=\"font-size: 1.1rem; font-weight: 700; text-align: center; text-transform: uppercase;\">General Settings</div><div class=\"adbsettings\" id=\"adbsettings\"></div></div></div>").insertAfter("#room-info-display");

  $(".player_header").append("<span style=\"width: 40px; background-image: url(https://i.imgur.com/0WML9BT.png);color: rgba(0,0,0,0);background-position: center center;background-repeat: no-repeat;\" id=\"buttonThingThanks2\" onclick=\"autoDub.noumBoard()\">_</span>");


  $(".displayVideo-el").click(function() {
    $("#noumBoard").css("display", "none");

  });
  $(".room-info-display").click(function() {
    $("#noumBoard").css("display", "none");
  });

  $(".display-mods-controls").click(function() {
    $("#noumBoard").css("display", "none");
  });
  autoDub.storage.restore();
  console.log("exit init");

};

autoDub.noumBoard = function() {
  $(".player_header").find(".active").removeClass("active");
  $("#buttonThingThanks2").addClass("active");
  $("#room-info-display").css("display", "none");
  $("#mods-controllers").css("display", "none");
  $(".player_container").css("display", "none");
  $("#noumBoard").css("display", "block");
};

autoDub.lastfm = {
  sk: false, //for last.fm user tt_discotheque
  key: "d8fdf22c67610b61629af90605c31f40",
  songStart: null,
  duration: null,
  timer: null,
  newSession: function(xhr) {

    return function() {
      console.log("your last.fm session key has been SET!");
      jsonResponse = JSON.parse(xhr.responseText);
      autoDub.lastfm.sk = jsonResponse.session.key;
      localStorage["adLastfmSession"] = autoDub.lastfm.sk;
      $("#lfmsetting").html("<span id=\"lfmsetting\"><a id=\"lfmsetting\" href=\"#\" onclick=\"autoDub.lfmClick()\" class=\"autodub-jllink\">Scrobble: <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDublfm\"> Connected to last.fm. Click to disconnect.</span></a></span>")
    };
  },
  scrobble: function() {
    var artist = autoDub.songInfo.artist;
    var track = autoDub.songInfo.title;

    var params = {
      artist: artist,
      track: track,
      timestamp: autoDub.lastfm.songStart,
      api_key: autoDub.lastfm.key,
      sk: autoDub.lastfm.sk,
      method: "track.scrobble"
    };

    var sig = autoDub.lastfm.getApiSignature(params);
    params.api_sig = sig;

    var request_url = 'https://ws.audioscrobbler.com/2.0/?' + serialize(params);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', request_url, true);
    xhr.onload = console.log("scrobbled");
    xhr.onerror = autoDub.lastfm._onAjaxError;
    xhr.send();

  },
  love: function() {
    var artist = autoDub.songInfo.artist;
    var track = autoDub.songInfo.title;

    var params = {
      artist: artist,
      track: track,
      api_key: autoDub.lastfm.key,
      sk: autoDub.lastfm.sk,
      method: "track.love"
    };

    var sig = autoDub.lastfm.getApiSignature(params);
    params.api_sig = sig;

    var request_url = 'https://ws.audioscrobbler.com/2.0/?' + serialize(params);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', request_url, true);
    xhr.onload = console.log("loved");
    xhr.onerror = autoDub.lastfm._onAjaxError;
    xhr.send();

  },
  _onAjaxError: function(xhr, status, error) {
    console.log(xhr);
    console.log(status);
    console.log(error);
  },
  nowPlaying: function() {
    var artist = autoDub.songInfo.artist;
    var track = autoDub.songInfo.title;

    var params = {
      artist: artist,
      track: track,
      duration: autoDub.lastfm.duration,
      api_key: autoDub.lastfm.key,
      sk: autoDub.lastfm.sk,
      method: "track.updateNowPlaying"
    };

    var sig = autoDub.lastfm.getApiSignature(params);
    params.api_sig = sig;

    var request_url = 'https://ws.audioscrobbler.com/2.0/?' + serialize(params);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', request_url, true);
    xhr.onload = console.log("nowplayd");
    xhr.onerror = autoDub.lastfm._onAjaxError;

    xhr.send();

  },
  getApiSignature: function(params) {
    var i, key, keys, max, paramString;

    keys = [];
    paramString = "";

    for (key in params) {
      if (params.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    keys.sort();

    for (i = 0, max = keys.length; i < max; i += 1) {
      key = keys[i];
      paramString += key + params[key];
    }

    return calcMD5(paramString + "b633ba4468e89c9a2a4293029bb51176");
  }
};

autoDub.userJoin = function(data) {
  var id = data.user._id;
  var name = data.user.username;
  if (!autoDub.users[id]) {
    autoDub.users[id] = true;
    if (autoDub.joinLeaves) autoDub.chatSpam.joinLeave(id, name, "join");
  }
};

autoDub.userLeave = function(data) {
  var id = data.user._id;
  var name = data.user.username;
  autoDub.users[id] = false;
  if (autoDub.joinLeaves) autoDub.chatSpam.joinLeave(id, name, "leave");
};

autoDub.idmode = {
  discoball: {
    create: function() {
      if (autoDub.discoballDancers) {
        var discoballdisplay = 'block';
        var dancersheight = '130px';
      } else {
        var discoballdisplay = 'none';
        var dancersheight = '0';
      }
      $(".right_section").prepend("<div id=\"discoball\" style=\"pointer-events: none; background: transparent url(https://i.imgur.com/Bdn4yrg.gif) no-repeat center bottom; display: " + discoballdisplay + "; width: 100%; height:300px;position: absolute;left: 5;z-index: 11;margin-top: -377px;\"></div>");
      if (!autoDub.altDancers) {
        $(".player_sharing").append("<div style=\"width:93%; display:none; pointer-events: none; position:absolute; height:" + dancersheight + "; z-index:120; margin-top:-180px;overflow:hidden;\" id=\"dancers\"><div class=\"dncr\" style=\"float:left; background: transparent url(https://i.imgur.com/IieFNhZ.gif); width:59px; height:130px;\"></div><div class=\"dncr\" style=\"float:right; background: transparent url(https://i.imgur.com/IieFNhZ.gif); width:59px; height:130px;\"></div><div style=\"clear:both;\"></div></div>");
      } else {
        $(".player_sharing").append("<div style=\"width:93%; display:none; pointer-events: none; position:absolute; height:" + dancersheight + "; z-index:120; margin-top:-180px;overflow:hidden;\" id=\"dancers\"><div class=\"dncr\" style=\"float:left; background: transparent url(https://i.imgur.com/aeOoQTZ.gif); width:88px; height:130px;\"></div><div class=\"dncr\" style=\"float:right; background: transparent url(https://i.imgur.com/aeOoQTZ.gif); width:88px; height:130px;\"></div><div style=\"clear:both;\"></div></div>");
      }
    },
    up: function() {
      $("#discoball").animate({
        'margin-top': '-377px'
      }, 2000);
    },
    down: function() {
      $("#discoball").animate({
        'margin-top': '-90px'
      }, 5000);
    }
  },
  fb: null,
  arnold: false,
  onValueChange: null,
  onWordChange: null,
  onDiscoballChange: null,
  onDanChange: null,
  onShirt: null,
  onRuler: null,
  theBank: null,
  shirt: null,
  theRoomShit: null,
  userid: null,
  init: function() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    autoDub.idmode.getName();
    var firstVal = $(".currentSong").text();
    $(".currentSong").html("<input type=\"text\" style=\"margin-top:-10px; font-style:normal; padding:0; font-weight:700;\" value=\"" + firstVal + "\" id=\"newtagbox\">");
    $("#newtagbox").bind("keyup", function(e) {
      if (e.which == 13) {
        var newtag = $("#newtagbox").val();
        Dubtrack.room.chat._messageInputEl.val("!fixtags " + newtag);
        Dubtrack.room.chat.sendMessage();
      }
    });
  },
  getUserId: function(username) {
    $.ajax({
      dataType: "json",
      type: "GET",
      url: "https://api.dubtrack.fm/user/" + username,
      success: function(things) {
        var data = things.data;
        var userid = data.userInfo.userid;
        autoDub.idmode.userid = userid;
        autoDub.idmode.startFirebase();
      }
    });
  },
  startFirebase: function() {
    $.getScript("https://cdn.firebase.com/js/client/2.4.2/firebase.js", autoDub.idmode.initFirebase);
  },
  initFirebase: function() {
    autoDub.idmode.fb = new Firebase("https://discocheques.firebaseio.com");
    autoDub.idmode.theBank = autoDub.idmode.fb.child("bank/" + autoDub.idmode.userid);
    autoDub.idmode.theRoomShit = autoDub.idmode.fb.child("roomshit");
    autoDub.idmode.shirt = autoDub.idmode.fb.child("shirt");
    autoDub.idmode.ruler = autoDub.idmode.fb.child("ruler");

    autoDub.idmode.ballChange = autoDub.idmode.fb.child("ballchange");
    autoDub.idmode.danChange = autoDub.idmode.fb.child("danchange");
    autoDub.idmode.eveWords = autoDub.idmode.fb.child("evetalk");
    autoDub.idmode.onWordChange = autoDub.idmode.eveWords.on("value", function(snapshot) {
      autoDub.idmode.eveTalkr(snapshot);
    });
    autoDub.idmode.onShirt = autoDub.idmode.shirt.on("value", function(snapshot) {
      autoDub.idmode.shirtChange(snapshot);
    });
    autoDub.idmode.onRuler = autoDub.idmode.ruler.on("value", function(snapshot) {
      autoDub.idmode.rulerChange(snapshot);
    });
    autoDub.idmode.onBallChange = autoDub.idmode.ballChange.on("value", function(snapshot) {
      autoDub.idmode.okBallChange(snapshot);
    });
    autoDub.idmode.onDanChange = autoDub.idmode.danChange.on("value", function(snapshot) {
      autoDub.idmode.okDanChange(snapshot);
    });
    autoDub.idmode.onValueChange = autoDub.idmode.theBank.on("value", function(snapshot) {
      autoDub.idmode.balchange(snapshot);
    });
    autoDub.idmode.onDiscoballChange = autoDub.idmode.theRoomShit.on("value", function(snapshot) {
      autoDub.idmode.roomShitChange(snapshot);
    });
    var et = "off";
    var altD = "off";
    var ducksOpt = "off";
    var discoballdancersOpt = "off";
    if (autoDub.altDancers) altD = "on";
    if (autoDub.eveTalk) et = "on";
    if (autoDub.shootDucks) ducksOpt = "on";
    if (autoDub.discoballDancers) discoballdancersOpt = "on"
    $("#noumcon").append("<div style=\"font-size: 1.1rem; margin-top:30px; font-weight: 700; text-align: center; text-transform: uppercase;\">Indie Discotheque Settings</div><div class=\"adbsettings\" id=\"idsettings\"></div>");
    $("#idsettings").append("<a href=\"#\" onclick=\"autoDub.etToggle()\" class=\"autodub-etlink\">Eve Talk <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubet\">" + et + "</span>");
    $("#idsettings").append("<a href=\"#\" onclick=\"autoDub.discoballdancersToggle()\" class=\"autodub-discoballdancerslink\">Discoball/Dancers <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubdiscoballdancers\">" + discoballdancersOpt + "</span>");
    $("#idsettings").append("<a id=\"altdopt\" href=\"#\" onclick=\"autoDub.altDToggle()\" class=\"autodub-altDlink\">Alt Dancer <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubaltd\">" + altD + "</span>");
    $("#idsettings").append("<a href=\"#\" onclick=\"autoDub.ducksToggle()\" class=\"autodub-duckslink\">Duck Notifications <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubducks\">" + ducksOpt + "</span>");


  },
  eveTalkr: function(snapshot) {
    var data = snapshot.val();
    if (!autoDub.firstTalk) {
      autoDub.firstTalk = true;
    } else {
      if (data) {
        if (autoDub.eveTalk) {
          console.log(data.msg);
          responsiveVoice.speak(data.msg);
        }
      }
    }
  },
  shirtChange: function(snapshot) {
    var data = snapshot.val();
    var firstVal = data.artist + " - " + data.title;
    autoDub.songInfo.artist = data.artist;
    autoDub.songInfo.title = data.title;
    $(".currentSong").html("<input type=\"text\" style=\"margin-top:-10px; font-style:normal; padding:0; font-weight:700;\" id=\"newtagbox\">");
    $("#newtagbox").val(firstVal);
    $("#newtagbox").bind("keyup", function(e) {
      if (e.which == 13) {
        var newtag = $("#newtagbox").val();
        Dubtrack.room.chat._messageInputEl.val("!fixtags " + newtag);
        Dubtrack.room.chat.sendMessage();
      }
    });
  },
  rulerChange: function(snapshot) {
    var data = snapshot.val();
    if (data.status){
      var theidr = data.id;
      $("#rulerstyle").html(".user-"+theidr+" .username { background: url(https://i.imgur.com/KdW4gcu.png?1) no-repeat; padding-left: 20px;} .userid-"+theidr+" .username{background: url(https://i.imgur.com/UcuO9vm.png?1) no-repeat;padding-left: 30px !important;}");
    } else {
      $("#rulerstyle").html("");
    }
  },
  roomShitChange: function(snapshot) {
    var data = snapshot.val();
    if (data.discoball) {
      autoDub.idmode.discoball.down();
    } else {
      autoDub.idmode.discoball.up();
    }
    if (typeof data.dancers != "undefined") {

      var currentDancers = $("#dancers").is(":visible");
      if (data.dancers != currentDancers) {
        $("#dancers").slideToggle("slow", function() {
          //dancers toggled
        });
      }
    }
  },
  balchange: function(snapshot) {
    var data = snapshot.val();
    if (data) {
      var bal = data.bal;
    } else {
      var bal = 0;
    }

    $("#discobal").text("Balance: " + bal + " discocheques");
  },
  okBallChange: function(snapshot) {
    var data = snapshot.val();
    if (data) {
      $("#discoball").css("backgroundImage", "url('" + data + "')");
    } else {
      $("#discoball").css("backgroundImage", "url('https://i.imgur.com/Bdn4yrg.gif')");
    }
  },
  okDanChange: function(snapshot) {
    var data = snapshot.val();
    if (data.url) {
      $(".dncr").css("width", data.width);
      $(".dncr").css("background-image", "url(" + data.url + ")");
      $("#altdopt").css("display", "none");
    } else {
      $("#altdopt").css("display", "block");
      if (!autoDub.altDancers) {
        $(".dncr").css("width", "59px");
        $(".dncr").css("background-image", "url(https://i.imgur.com/IieFNhZ.gif)");

      } else {
        $(".dncr").css("width", "88px");
        $(".dncr").css("background-image", "url(https://i.imgur.com/aeOoQTZ.gif)");
      }
    }
  },
  getName: function() {
    var username = $(".user-info").first().text();
    if (username == "") {
      setTimeout(function() {
        autoDub.idmode.getName();
      }, 3000);
    } else {
      autoDub.idmode.getUserId(username);
    }
  }
};

autoDub.ui = {
  init: function(mode, jl, dv, qt, pm, ha, nm1) {
    if (pm) {
      $('html').append('<style id="rulerstyle"></style><style>.psons{white-space:nowrap; overflow-x:hidden; width:150px; display: inline-block;} #usrsneak li{border-bottom:1px solid #eee; cursor: pointer; padding:4px;}#usrbottom{background-color:#fff; display:none;height:400px;overflow-y:scroll; overflow-x:hidden;}#usrtop{padding: 7px;-webkit-border-top-left-radius: .3rem; -webkit-border-top-right-radius: .3rem; -moz-border-radius-topleft: .3rem; -moz-border-radius-topright: .3rem; border-top-left-radius: .3rem; border-top-right-radius: .3rem;background-color: rgba(0,0,0,.8);color: #fff;}#sneakyPMList{vertical-align: bottom;display: inline-block; width: 100px; margin-left: 10px;}.sneakyClose{cursor:pointer;float:right;}#Scontainer{font-family:helvetica, arial, san-serif;font-size:12px;background-color:#000; background-color:#fff; max-width:900px; margin-left:auto; margin-right:auto; min-height:100%;}.sneakyTop{-webkit-border-top-left-radius: .3rem; -webkit-border-top-right-radius: .3rem; -moz-border-radius-topleft: .3rem; -moz-border-radius-topright: .3rem; border-top-left-radius: .3rem; border-top-right-radius: .3rem;padding:7px;background-color:rgba(0,0,0,.8);color:#fff}div#sneakyPM{z-index:9000;position:fixed;bottom:56px;font: 1rem/1.5 Open Sans,sans-serif; font-size:13px;}.sneakyPMWindow{display:inline-block; width:200px;margin-left:10px;} .sneakypmPut{font: 1rem/1.5 Open Sans,sans-serif; font-size:13px;width:100%;border-top:1px solid #ccc;background-color:#fff;color:#000!important}.sneakyMsg{padding:5px;} .sneakyMsg:nth-child(even) { background-color: #eee; }.sneakyPmtxt{background-color:#fff;height:200px;overflow-y:scroll; overflow-x:hidden;} </style><div id="sneakyPM"><div id="sneakyPMList"><div id="usrtop">Send a PM <div onclick="autoDub.ui.pmMenu()" id="snklist" class="sneakyClose">+</div></div><div id="usrbottom"><ul id="usrsneak"></ul></div></div></div>');
    }

    var themode = autoDub.mode;
    if (mode) themode = mode;
    autoDub.roomCheck = setInterval(function() {
      if (window.location.href.match(/\/join\//)) {
        autoDub.versionMessage();
        clearInterval(autoDub.roomCheck);
        autoDub.roomCheck = null;
      }
    }, 2000);
    if (qt) {
      $('#browser').one("DOMSubtreeModified", function() {
        $(window).unbind('click.browser');
        $("#browser").css("width", "50%");
      });
    }
    if (ha) {
      $("head").append("<style id='hideAvatars'>.image_row{display:none;} .activity-row{padding-left: 0 !important;} li.imgEl{ display: none !important;} li.infoContainer{padding:0 !important;}}</style>");
    }
    var jlm = "off";
    if (jl) {
      jlm = "on";
    } else if (autoDub.joinLeaves) {
      jlm = "on";
    }
    var dvm = "off";
    if (dv) {
      dvm = "on";
    } else if (autoDub.dvm) {
      dvm = "on";
    }
    var qtm = "off";
    if (qt) {
      qtm = "on";
    } else if (autoDub.queueThanks) {
      qtm = "on";
    }
    var hideav = "off";
    if (ha) {
      hideav = "on";
    } else if (autoDub.hideAvatars) {
      hideav = "on";
    }
    var pmp = "off";
    if (pm) {
      pmp = "on";
    } else if (autoDub.pmPlus) {
      pmp = "on";
    }

    var nm = "off";
    if (nm1) {
      nm = "on";
    } else if (autoDub.nm) {
      nm = "on";
    }

    var desktopNotificationStatus = 'off';
    if (autoDub.desktopNotifications == true) {
      desktopNotificationStatus = 'on';
    } else {
      desktopNotificationStatus = 'off';
    }

    var emojiPicker = "<div id=\"chatDTEmojis\"><input type=\"text\" placeholder=\"Search for an Emoji\" id=\"autodubEmojiSearch\"><div id=\"adubEmojis\">    <h2>People</h2><span id=\"adubE_1\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bowtie.png);\" data-alternative-name=\"classy, bow, face, formal, fashion, suit, magic, circus\">bowtie</span><span id=\"adubE_2\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/smile.png);\" data-alternative-name=\"happy, cheerful, face, joy, funny, haha, laugh, like\">smile</span><span id=\"adubE_4\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/laughing.png);\" data-alternative-name=\"lol, funny, happy, joy, satisfied, haha, face, glad\">laughing</span><span id=\"adubE_5\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/blush.png);\" data-alternative-name=\"face, smile, happy, flushed, crush, embarrassed, shy, joy\">blush</span><span id=\"adubE_6\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/smiley.png);\" data-alternative-name=\"funny, face, happy, joy, haha\">smiley</span><span id=\"adubE_7\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/relaxed.png);\" data-alternative-name=\"face, blush, massage, happiness\">relaxed</span><span id=\"adubE_8\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/smirk.png);\" data-alternative-name=\"face, smile, mean, prank, smug, sarcasm\">smirk</span><span id=\"adubE_9\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heart_eyes.png);\" data-alternative-name=\"heart, love, face, like, affection, valentines, infatuation, crush\">heart_eyes</span><span id=\"adubE_10\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/kissing_heart.png);\" data-alternative-name=\"heart, kiss, face, love, like, affection, valentines, infatuation\">kissing_heart</span><span id=\"adubE_11\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/kissing_closed_eyes.png);\" data-alternative-name=\"face, love, like, affection, valentines, infatuation\">kissing_closed_eyes</span><span id=\"adubE_12\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/flushed.png);\" data-alternative-name=\"flustered, embarassed, face, blush, shy, flattered\">flushed</span><span id=\"adubE_13\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/relieved.png);\" data-alternative-name=\"face, relaxed, phew, massage, happiness\">relieved</span><span id=\"adubE_14\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/satisfied.png);\" data-alternative-name=\"contented\">satisfied</span><span id=\"adubE_15\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/grin.png);\" data-alternative-name=\"happy, smile, face, joy\">grin</span><span id=\"adubE_16\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wink.png);\" data-alternative-name=\"flirt, face, happy, mischievous, secret\">wink</span><span id=\"adubE_17\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/stuck_out_tongue_winking_eye.png);\" data-alternative-name=\"face, prank, childish, playful, mischievous, smile\">stuck_out_tongue_winking_eye</span><span id=\"adubE_18\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/stuck_out_tongue_closed_eyes.png);\" data-alternative-name=\"face, prank, playful, mischievous, smile\">stuck_out_tongue_closed_eyes</span><span id=\"adubE_19\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/grinning.png);\" data-alternative-name=\"smiling, face, smile, happy, joy\">grinning</span><span id=\"adubE_20\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/kissing.png);\" data-alternative-name=\"love, like, face, 3, valentines, infatuation\">kissing</span><span id=\"adubE_21\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/kissing_smiling_eyes.png);\" data-alternative-name=\"smooch, face, affection, valentines, infatuation\">kissing_smiling_eyes</span><span id=\"adubE_22\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/stuck_out_tongue.png);\" data-alternative-name=\"face, prank, childish, playful, mischievous, smile\">stuck_out_tongue</span><span id=\"adubE_23\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sleeping.png);\" data-alternative-name=\"asleep, face, tired, sleepy, night, zzz\">sleeping</span><span id=\"adubE_24\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/worried.png);\" data-alternative-name=\"frustrated, scared, face, concern, nervous\">worried</span><span id=\"adubE_25\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/frowning.png);\" data-alternative-name=\"face, aw, what\">frowning</span><span id=\"adubE_26\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/anguished.png);\" data-alternative-name=\"face, stunned, nervous\">anguished</span><span id=\"adubE_27\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/open_mouth.png);\" data-alternative-name=\"face, surprise, impressed, wow\">open_mouth</span><span id=\"adubE_28\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/grimacing.png);\" data-alternative-name=\"face, grimace, teeth\">grimacing</span><span id=\"adubE_29\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/confused.png);\" data-alternative-name=\"baffled, puzzled, face, indifference, huh, weird, hmmm\">confused</span><span id=\"adubE_30\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hushed.png);\" data-alternative-name=\"face, woo, shh,conceal,hide\">hushed</span><span id=\"adubE_31\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/expressionless.png);\" data-alternative-name=\"deadpan, face, indifferent, -_-, meh\">expressionless</span><span id=\"adubE_32\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/unamused.png);\" data-alternative-name=\"sarcasm, indifference, bored, straight face, serious\">unamused</span><span id=\"adubE_33\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sweat_smile.png);\" data-alternative-name=\"happy, relief, face, hot, laugh\">sweat_smile</span><span id=\"adubE_34\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sweat.png);\" data-alternative-name=\"worried, stressed, face, hot, sad, tired, exercise\">sweat</span><span id=\"adubE_35\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/disappointed_relieved.png);\" data-alternative-name=\"face, phew, sweat, nervous\">disappointed_relieved</span><span id=\"adubE_36\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/weary.png);\" data-alternative-name=\"tired, face, sleepy, sad, frustrated, upset\">weary</span><span id=\"adubE_37\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pensive.png);\" data-alternative-name=\"face, sad, depressed, okay, upset\">pensive</span><span id=\"adubE_38\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/disappointed.png);\" data-alternative-name=\"sad, lonely, face, upset, depressed\">disappointed</span><span id=\"adubE_39\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/confounded.png);\" data-alternative-name=\"face, confused, sick, unwell, oops\">confounded</span><span id=\"adubE_40\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fearful.png);\" data-alternative-name=\"scared, afraid, nervous, scared, face, terrified, oops, huh\">fearful</span><span id=\"adubE_41\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cold_sweat.png);\" data-alternative-name=\"scared, frightened, nervous, scared, face\">cold_sweat</span><span id=\"adubE_42\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/persevere.png);\" data-alternative-name=\"face, sick, no, upset, oops\">persevere</span><span id=\"adubE_43\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cry.png);\" data-alternative-name=\"sad, unhappy, tear, face, tears, depressed, upset\">cry</span><span id=\"adubE_44\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sob.png);\" data-alternative-name=\"sad, unhappy, face, cry, tears, upset, depressed\">sob</span><span id=\"adubE_45\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/joy.png);\" data-alternative-name=\"happy, happytears, face, cry, tears, weep, haha\">joy</span><span id=\"adubE_46\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/astonished.png);\" data-alternative-name=\"face, xox, surprised, poisoned\">astonished</span><span id=\"adubE_47\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/scream.png);\" data-alternative-name=\"halloween, scary, scared, terrified, face, munch, omg\">scream</span><span id=\"adubE_48\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/neckbeard.png);\" data-alternative-name=\"nerd, geek, nerdy, face, custom_\">neckbeard</span><span id=\"adubE_49\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tired_face.png);\" data-alternative-name=\"sick, whine, upset, frustrated\">tired_face</span><span id=\"adubE_50\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/angry.png);\" data-alternative-name=\"mad, face, annoyed, frustrated\">angry</span><span id=\"adubE_51\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rage.png);\" data-alternative-name=\"furious, angry, mad, hate, despise\">rage</span><span id=\"adubE_52\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/triumph.png);\" data-alternative-name=\"face, gas, phew, proud, pride\">triumph</span><span id=\"adubE_53\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sleepy.png);\" data-alternative-name=\"tired, zzz, face, rest, nap\">sleepy</span><span id=\"adubE_54\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/yum.png);\" data-alternative-name=\"delicious, happy, joy, tongue, smile, face, silly, yummy\">yum</span><span id=\"adubE_55\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mask.png);\" data-alternative-name=\"face, sick, ill, disease\">mask</span><span id=\"adubE_56\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sunglasses.png);\" data-alternative-name=\"shades, face, cool, smile, summer, beach\">sunglasses</span><span id=\"adubE_57\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dizzy_face.png);\" data-alternative-name=\"ko, spent, unconscious, xox\">dizzy_face</span><span id=\"adubE_58\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/imp.png);\" data-alternative-name=\"devil, angry, horns\">imp</span><span id=\"adubE_59\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/smiling_imp.png);\" data-alternative-name=\"devil, horns\">smiling_imp</span><span id=\"adubE_60\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/neutral_face.png);\" data-alternative-name=\"indifference, meh\">neutral_face</span><span id=\"adubE_61\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/no_mouth.png);\" data-alternative-name=\"face, hellokitty,silent\">no_mouth</span><span id=\"adubE_62\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/innocent.png);\" data-alternative-name=\"angel, face, heaven, halo\">innocent</span><span id=\"adubE_63\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/alien.png);\" data-alternative-name=\"extraterrestrial, UFO, paul, weird, outer_space\">alien</span><span id=\"adubE_64\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/yellow_heart.png);\" data-alternative-name=\"heart, love, like, affection, valentines\">yellow_heart</span><span id=\"adubE_65\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/blue_heart.png);\" data-alternative-name=\"heart, love, like, affection, valentines\">blue_heart</span><span id=\"adubE_66\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/purple_heart.png);\" data-alternative-name=\"heart, love, like, affection, valentines\">purple_heart</span><span id=\"adubE_67\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heart.png);\" data-alternative-name=\"heart, love, like, valentines\">heart</span><span id=\"adubE_68\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/green_heart.png);\" data-alternative-name=\"heart, love, like, affection, valentines\">green_heart</span><span id=\"adubE_69\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/broken_heart.png);\" data-alternative-name=\"heart, heartbreak, sad, sorry, break\">broken_heart</span><span id=\"adubE_70\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heartbeat.png);\" data-alternative-name=\"heart, love, like, affection, valentines, pink\">heartbeat</span><span id=\"adubE_71\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heartpulse.png);\" data-alternative-name=\"heart, like, love, affection, valentines, pink\">heartpulse</span><span id=\"adubE_72\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/two_hearts.png);\" data-alternative-name=\"heart, love, like, affection, valentines\">two_hearts</span><span id=\"adubE_73\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/revolving_hearts.png);\" data-alternative-name=\"heart, love, like, affection, valentines\">revolving_hearts</span><span id=\"adubE_74\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cupid.png);\" data-alternative-name=\"love, like, heart, affection, valentines\">cupid</span><span id=\"adubE_75\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sparkling_heart.png);\" data-alternative-name=\"heart, love, like, affection, valentines\">sparkling_heart</span><span id=\"adubE_76\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sparkles.png);\" data-alternative-name=\"stars, shine, shiny, cool, awesome, good, magic\">sparkles</span><span id=\"adubE_77\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/star.png);\" data-alternative-name=\"night, yellow\">star</span><span id=\"adubE_78\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/star2.png);\" data-alternative-name=\"night, sparkle, awesome, good, magic\">star2</span><span id=\"adubE_79\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dizzy.png);\" data-alternative-name=\"star, sparkle, shoot, magic\">dizzy</span><span id=\"adubE_80\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/boom.png);\" data-alternative-name=\"explosion, bomb, explode, collision, blown\">boom</span><span id=\"adubE_81\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/collision.png);\" data-alternative-name=\"accident,fight,boom\">collision</span><span id=\"adubE_82\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/anger.png);\" data-alternative-name=\"angry, mad\">anger</span><span id=\"adubE_83\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/exclamation.png);\" data-alternative-name=\"heavy_exclamation_mark, danger, surprise, punctuation, wow, warning\">exclamation</span><span id=\"adubE_84\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/question.png);\" data-alternative-name=\"doubt, confused\">question</span><span id=\"adubE_85\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/grey_exclamation.png);\" data-alternative-name=\"surprise, punctuation, gray, wow, warning\">grey_exclamation</span><span id=\"adubE_86\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/grey_question.png);\" data-alternative-name=\"doubts, gray, huh\">grey_question</span><span id=\"adubE_87\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/zzz.png);\" data-alternative-name=\"sleep, bored, sleepy, tired\">zzz</span><span id=\"adubE_88\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dash.png);\" data-alternative-name=\"wind, air, fast, shoo, fart, smoke, puff\">dash</span><span id=\"adubE_89\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sweat_drops.png);\" data-alternative-name=\"water, drip, oops\">sweat_drops</span><span id=\"adubE_90\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/notes.png);\" data-alternative-name=\"music, score\">notes</span><span id=\"adubE_91\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/musical_note.png);\" data-alternative-name=\"music, score, tone, sound\">musical_note</span><span id=\"adubE_92\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fire.png);\" data-alternative-name=\"hot, cook, flame\">fire</span><span id=\"adubE_93\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hankey.png);\" data-alternative-name=\"poop, shitface, fail, turd\">hankey</span><span id=\"adubE_94\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/poop.png);\" data-alternative-name=\"shit, turd\">poop</span><span id=\"adubE_95\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/shit.png);\" data-alternative-name=\"poop\">shit</span><span id=\"adubE_96\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/plus1.png);\" data-alternative-name=\"thumbsup, yes, awesome, good, agree, accept, cool, hand, like\">+1</span><span id=\"adubE_97\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/thumbsup.png);\" data-alternative-name=\"like\">thumbsup</span><span id=\"adubE_98\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/-1.png);\" data-alternative-name=\"thumbsdown, no, dislike, hand\">-1</span><span id=\"adubE_99\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/thumbsdown.png);\" data-alternative-name=\"dislike\">thumbsdown</span><span id=\"adubE_100\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ok_hand.png);\" data-alternative-name=\"fingers, limbs, perfect\">ok_hand</span><span id=\"adubE_101\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/punch.png);\" data-alternative-name=\"pound\">punch</span><span id=\"adubE_102\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/facepunch.png);\" data-alternative-name=\"angry, violence, fist, hit, attack, hand\">facepunch</span><span id=\"adubE_103\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fist.png);\" data-alternative-name=\"fingers, hand, grasp\">fist</span><span id=\"adubE_104\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/v.png);\" data-alternative-name=\"peace, deuces, fingers, ohyeah, hand, victory, two\">v</span><span id=\"adubE_105\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wave.png);\" data-alternative-name=\"hi, hello, bye, hands, gesture, goodbye, solong, farewell, palm\">wave</span><span id=\"adubE_106\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hand.png);\" data-alternative-name=\"stop, fingers, highfive, palm, ban, raised_hand\">hand</span><span id=\"adubE_107\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/raised_hand.png);\" data-alternative-name=\"stop\">raised_hand</span><span id=\"adubE_108\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/open_hands.png);\" data-alternative-name=\"fingers, butterfly\">open_hands</span><span id=\"adubE_109\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/point_up.png);\" data-alternative-name=\"hand, fingers, direction\">point_up</span><span id=\"adubE_110\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/point_down.png);\" data-alternative-name=\"fingers, hand, direction\">point_down</span><span id=\"adubE_111\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/point_left.png);\" data-alternative-name=\"direction, fingers, hand\">point_left</span><span id=\"adubE_112\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/point_right.png);\" data-alternative-name=\"fingers, hand, direction\">point_right</span><span id=\"adubE_113\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/raised_hands.png);\" data-alternative-name=\"gesture, hooray, yea, celebration\">raised_hands</span><span id=\"adubE_114\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pray.png);\" data-alternative-name=\"please, hope, wish, namaste, highfive\">pray</span><span id=\"adubE_115\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/point_up_2.png);\" data-alternative-name=\"fingers, hand, direction\">point_up_2</span><span id=\"adubE_116\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clap.png);\" data-alternative-name=\"hands, praise, applause, congrats, yay\">clap</span><span id=\"adubE_117\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/muscle.png);\" data-alternative-name=\"arm, flex, hand, summer, strong\">muscle</span><span id=\"adubE_118\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/metal.png);\" data-alternative-name=\"fingers, rocknroll, concert, band, custom_\">metal</span><span id=\"adubE_119\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fu.png);\" data-alternative-name=\"fuck, finger, dislike, thumbsdown, disapprove, no, custom_\">fu</span><span id=\"adubE_120\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/runner.png);\" data-alternative-name=\"sport, man, walking, exercise, race, running\">runner</span><span id=\"adubE_121\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/running.png);\" data-alternative-name=\"sport\">running</span><span id=\"adubE_122\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/couple.png);\" data-alternative-name=\"pair, people, human, love, date, dating, like, affection, valentines, marriage\">couple</span><span id=\"adubE_123\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/family.png);\" data-alternative-name=\"home, parents, child, mom, dad, father, mother, people, human\">family</span><span id=\"adubE_124\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/two_men_holding_hands.png);\" data-alternative-name=\"gay, pair, couple, love, like, bromance, friendship, people, human\">two_men_holding_hands</span><span id=\"adubE_125\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/two_women_holding_hands.png);\" data-alternative-name=\"gay, pair, friendship, couple, love, like, female, people, human, lesbian\">two_women_holding_hands</span><span id=\"adubE_126\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dancer.png);\" data-alternative-name=\"party, female, girl, woman, fun\">dancer</span><span id=\"adubE_127\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dancers.png);\" data-alternative-name=\"party, female, bunny, women, girls\">dancers</span><span id=\"adubE_128\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ok_woman.png);\" data-alternative-name=\"women, girl, female, pink, human\">ok_woman</span><span id=\"adubE_129\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/no_good.png);\" data-alternative-name=\"female, girl, woman, nope\">no_good</span><span id=\"adubE_130\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/information_desk_person.png);\" data-alternative-name=\"female, girl, woman, human\">information_desk_person</span><span id=\"adubE_131\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/raising_hand.png);\" data-alternative-name=\"female, girl, woman\">raising_hand</span><span id=\"adubE_132\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bride_with_veil.png);\" data-alternative-name=\"couple, marriage, wedding\">bride_with_veil</span><span id=\"adubE_133\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/person_with_pouting_face.png);\" data-alternative-name=\"female, girl, woman\">person_with_pouting_face</span><span id=\"adubE_134\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/person_frowning.png);\" data-alternative-name=\"female, girl, woman, sad, depressed, discouraged, unhappy\">person_frowning</span><span id=\"adubE_135\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bow.png);\" data-alternative-name=\"man, male, boy\">bow</span><span id=\"adubE_136\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/couplekiss.png);\" data-alternative-name=\"pair, valentines, love, like, dating, marriage\">couplekiss</span><span id=\"adubE_137\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/couple_with_heart.png);\" data-alternative-name=\"heart, pair, love, like, affection, human, dating, valentines, marriage\">couple_with_heart</span><span id=\"adubE_138\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/massage.png);\" data-alternative-name=\"female, girl, woman, head\">massage</span><span id=\"adubE_139\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/haircut.png);\" data-alternative-name=\"female, girl, woman\">haircut</span><span id=\"adubE_140\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/nail_care.png);\" data-alternative-name=\"manicure, beauty, finger, fashion\">nail_care</span><span id=\"adubE_141\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/boy.png);\" data-alternative-name=\"man, male, guy, teenager\">boy</span><span id=\"adubE_142\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/girl.png);\" data-alternative-name=\"female, woman, teenager\">girl</span><span id=\"adubE_143\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/woman.png);\" data-alternative-name=\"female, girls, lady\">woman</span><span id=\"adubE_144\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/man.png);\" data-alternative-name=\"guy, mustache, father, dad, classy, sir, moustache\">man</span><span id=\"adubE_145\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/baby.png);\" data-alternative-name=\"infant, child, boy, girl, toddler\">baby</span><span id=\"adubE_146\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/older_woman.png);\" data-alternative-name=\"grandma, granny, female, women, girl, lady\">older_woman</span><span id=\"adubE_147\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/older_man.png);\" data-alternative-name=\"grandpa, grandad, human, male, men\">older_man</span><span id=\"adubE_148\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/person_with_blond_hair.png);\" data-alternative-name=\"man, male, boy, blonde, guy\">person_with_blond_hair</span><span id=\"adubE_149\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/man_with_gua_pi_mao.png);\" data-alternative-name=\"male, boy\">man_with_gua_pi_mao</span><span id=\"adubE_150\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/man_with_turban.png);\" data-alternative-name=\"male, indian, hinduism, arabs\">man_with_turban</span><span id=\"adubE_151\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/construction_worker.png);\" data-alternative-name=\"male, human, wip, guy, build\">construction_worker</span><span id=\"adubE_152\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cop.png);\" data-alternative-name=\"police, policeman, man, law, legal, enforcement, arrest, 911\">cop</span><span id=\"adubE_153\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/angel.png);\" data-alternative-name=\"heaven, wings, halo\">angel</span><span id=\"adubE_154\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/princess.png);\" data-alternative-name=\"girl, woman, female, blond, crown, royal, queen\">princess</span><span id=\"adubE_155\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/smiley_cat.png);\" data-alternative-name=\"animal, happy, cats\">smiley_cat</span><span id=\"adubE_156\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/smile_cat.png);\" data-alternative-name=\"animal, happy, cats\">smile_cat</span><span id=\"adubE_157\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heart_eyes_cat.png);\" data-alternative-name=\"heart, animal, love, like, affection, cats, valentines\">heart_eyes_cat</span><span id=\"adubE_158\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/kissing_cat.png);\" data-alternative-name=\"animal, love, cats\">kissing_cat</span><span id=\"adubE_159\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/smirk_cat.png);\" data-alternative-name=\"animal, cats\">smirk_cat</span><span id=\"adubE_160\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/scream_cat.png);\" data-alternative-name=\"animal, cats, munch, scared\">scream_cat</span><span id=\"adubE_161\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/crying_cat_face.png);\" data-alternative-name=\"animal, sad, tears, weep, cats, upset\">crying_cat_face</span><span id=\"adubE_162\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/joy_cat.png);\" data-alternative-name=\"animal, happy, cats, haha, tears\">joy_cat</span><span id=\"adubE_163\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pouting_cat.png);\" data-alternative-name=\"animal, sad, unhappy, angry, cats\">pouting_cat</span><span id=\"adubE_164\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/japanese_ogre.png);\" data-alternative-name=\"namahage, monster, red, mask, halloween, scary, creepy, devil, demon\">japanese_ogre</span><span id=\"adubE_165\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/japanese_goblin.png);\" data-alternative-name=\"tengu, red, evil, mask, monster, scary, creepy\">japanese_goblin</span><span id=\"adubE_166\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/see_no_evil.png);\" data-alternative-name=\"monkey, animal, nature, haha\">see_no_evil</span><span id=\"adubE_167\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hear_no_evil.png);\" data-alternative-name=\"animal, monkey, nature\">hear_no_evil</span><span id=\"adubE_168\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/speak_no_evil.png);\" data-alternative-name=\"monkey, animal, nature, omg\">speak_no_evil</span><span id=\"adubE_169\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/guardsman.png);\" data-alternative-name=\"uk, gb, british, male, guy, royal\">guardsman</span><span id=\"adubE_170\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/skull.png);\" data-alternative-name=\"scary, halloween, dead, skeleton, creepy\">skull</span><span id=\"adubE_171\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/feet.png);\" data-alternative-name=\"animal, tracking, footprints, dog, cat, pet, paw_prints\">feet</span><span id=\"adubE_172\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/lips.png);\" data-alternative-name=\"mouth, kiss\">lips</span><span id=\"adubE_173\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/kiss.png);\" data-alternative-name=\"face, lips, love, like, affection, valentines\">kiss</span><span id=\"adubE_174\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/droplet.png);\" data-alternative-name=\"water, drip, faucet, spring\">droplet</span><span id=\"adubE_175\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ear.png);\" data-alternative-name=\"face, hear, sound, listen\">ear</span><span id=\"adubE_176\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/eyes.png);\" data-alternative-name=\"eye-rolling, look, watch, stalk, peek, see\">eyes</span><span id=\"adubE_177\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/nose.png);\" data-alternative-name=\"smell, sniff\">nose</span><span id=\"adubE_178\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tongue.png);\" data-alternative-name=\"mouth, playful\">tongue</span><span id=\"adubE_179\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/love_letter.png);\" data-alternative-name=\"email, like, affection, envelope, valentines\">love_letter</span><span id=\"adubE_180\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bust_in_silhouette.png);\" data-alternative-name=\"user, person, human\">bust_in_silhouette</span><span id=\"adubE_181\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/busts_in_silhouette.png);\" data-alternative-name=\"user, person, human, group, team\">busts_in_silhouette</span><span id=\"adubE_182\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/speech_balloon.png);\" data-alternative-name=\"bubble, words, message, talk, chatting\">speech_balloon</span><span id=\"adubE_183\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/thought_balloon.png);\" data-alternative-name=\"bubble, cloud, speech, thinking\">thought_balloon</span><span id=\"adubE_184\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/feelsgood.png);\" data-alternative-name=\"doom, oldschool\">feelsgood</span><span id=\"adubE_185\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/finnadie.png);\" data-alternative-name=\"doom, oldschool\">finnadie</span><span id=\"adubE_186\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/goberserk.png);\" data-alternative-name=\"doom, rage, bloody, hurt\">goberserk</span><span id=\"adubE_187\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/godmode.png);\" data-alternative-name=\"doom, oldschool\">godmode</span><span id=\"adubE_188\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hurtrealbad.png);\" data-alternative-name=\"mad, injured, doom, oldschool, custom_\">hurtrealbad</span><span id=\"adubE_189\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rage1.png);\" data-alternative-name=\"angry, mad, hate, despise\">rage1</span><span id=\"adubE_190\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rage2.png);\" data-alternative-name=\"angry, mad, hate, despise\">rage2</span><span id=\"adubE_191\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rage3.png);\" data-alternative-name=\"angry, mad, hate, despise\">rage3</span><span id=\"adubE_192\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rage4.png);\" data-alternative-name=\"angry, mad, hate, despise\">rage4</span><span id=\"adubE_193\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/suspect.png);\" data-alternative-name=\"mad, custom_\">suspect</span><span id=\"adubE_194\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/trollface.png);\" data-alternative-name=\"internet, meme, custom_\">trollface</span>    <h2>Nature</h2><span id=\"adubE_195\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sunny.png);\" data-alternative-name=\"weather, sun, nature, brightness, summer, beach, spring\">sunny</span><span id=\"adubE_196\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/umbrella.png);\" data-alternative-name=\"water, rain, rainy, weather, spring\">umbrella</span><span id=\"adubE_197\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cloud.png);\" data-alternative-name=\"weather, sky\">cloud</span><span id=\"adubE_198\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/snowflake.png);\" data-alternative-name=\"winter, season, cold, weather, christmas, xmas\">snowflake</span><span id=\"adubE_199\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/snowman.png);\" data-alternative-name=\"winter, season, cold, weather, christmas, xmas, frozen\">snowman</span><span id=\"adubE_200\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/zap.png);\" data-alternative-name=\"weather, lightning, thunder, lightning bolt, fast\">zap</span><span id=\"adubE_201\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cyclone.png);\" data-alternative-name=\"weather, swirl, blue, cloud\">cyclone</span><span id=\"adubE_202\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/foggy.png);\" data-alternative-name=\"weather, fog, photo, mountain\">foggy</span><span id=\"adubE_203\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ocean.png);\" data-alternative-name=\"waves, sea, water, wave, nature, tsunami, disaster\">ocean</span><span id=\"adubE_204\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cat.png);\" data-alternative-name=\"animal, meow, nature, pet\">cat</span><span id=\"adubE_205\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dog.png);\" data-alternative-name=\"animal, friend, nature, woof, puppy, pet, faithful\">dog</span><span id=\"adubE_206\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mouse.png);\" data-alternative-name=\"animal, nature, cheese\">mouse</span><span id=\"adubE_207\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hamster.png);\" data-alternative-name=\"animal, nature\">hamster</span><span id=\"adubE_208\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rabbit.png);\" data-alternative-name=\"animal, nature, pet, spring, magic\">rabbit</span><span id=\"adubE_209\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wolf.png);\" data-alternative-name=\"animal,dog, animal, nature, wild, audrey, lulu, audrey and lulu\">wolf</span><span id=\"adubE_210\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/frog.png);\" data-alternative-name=\"animal, nature, croak\">frog</span><span id=\"adubE_211\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tiger.png);\" data-alternative-name=\"animal, cat, danger, wild, nature, roar\">tiger</span><span id=\"adubE_212\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/koala.png);\" data-alternative-name=\"animal, nature\">koala</span><span id=\"adubE_213\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bear.png);\" data-alternative-name=\"animal, nature, wild\">bear</span><span id=\"adubE_214\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pig.png);\" data-alternative-name=\"animal, oink, nature\">pig</span><span id=\"adubE_215\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pig_nose.png);\" data-alternative-name=\"animal, oink\">pig_nose</span><span id=\"adubE_216\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cow.png);\" data-alternative-name=\"animal, beef, ox, nature, moo, milk\">cow</span><span id=\"adubE_217\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/boar.png);\" data-alternative-name=\"animal, nature\">boar</span><span id=\"adubE_218\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/monkey_face.png);\" data-alternative-name=\"animal, nature, circus, ape\">monkey_face</span><span id=\"adubE_219\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/monkey.png);\" data-alternative-name=\"animal, nature, banana, circus, ape\">monkey</span><span id=\"adubE_220\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/horse.png);\" data-alternative-name=\"animal, brown, nature, unicorn\">horse</span><span id=\"adubE_221\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/racehorse.png);\" data-alternative-name=\"animal, gamble, luck\">racehorse</span><span id=\"adubE_222\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/camel.png);\" data-alternative-name=\"animal, nature, hot, desert, hump\">camel</span><span id=\"adubE_223\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sheep.png);\" data-alternative-name=\"animal, nature, wool, shipit\">sheep</span><span id=\"adubE_224\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/elephant.png);\" data-alternative-name=\"animal, nature, nose, thailand, circus\">elephant</span><span id=\"adubE_225\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/panda_face.png);\" data-alternative-name=\"animal, nature\">panda_face</span><span id=\"adubE_226\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/snake.png);\" data-alternative-name=\"animal,serpent, animal, evil, nature, hiss\">snake</span><span id=\"adubE_227\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bird.png);\" data-alternative-name=\"animal, nature, fly, tweet, spring\">bird</span><span id=\"adubE_228\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/baby_chick.png);\" data-alternative-name=\"animal, bird, chicken\">baby_chick</span><span id=\"adubE_229\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hatched_chick.png);\" data-alternative-name=\"animal, bird, chicken, baby\">hatched_chick</span><span id=\"adubE_230\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hatching_chick.png);\" data-alternative-name=\"animal, bird,egg, chicken, egg, born, baby, bird\">hatching_chick</span><span id=\"adubE_231\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/chicken.png);\" data-alternative-name=\"animal, bird, cluck, nature\">chicken</span><span id=\"adubE_232\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/penguin.png);\" data-alternative-name=\"animal, bird, nature\">penguin</span><span id=\"adubE_233\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/turtle.png);\" data-alternative-name=\"animal, tortoise, slow, nature\">turtle</span><span id=\"adubE_234\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bug.png);\" data-alternative-name=\"animal, insect, nature, worm\">bug</span><span id=\"adubE_235\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/honeybee.png);\" data-alternative-name=\"animal\">honeybee</span><span id=\"adubE_236\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ant.png);\" data-alternative-name=\"animal, insect, nature, bug\">ant</span><span id=\"adubE_237\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/beetle.png);\" data-alternative-name=\"animal, insect, nature, bug\">beetle</span><span id=\"adubE_238\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/snail.png);\" data-alternative-name=\"animal, slow, shell\">snail</span><span id=\"adubE_239\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/octopus.png);\" data-alternative-name=\"animal, creature, ocean, sea, nature, beach\">octopus</span><span id=\"adubE_240\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tropical_fish.png);\" data-alternative-name=\"animal, swim, ocean, beach, nemo\">tropical_fish</span><span id=\"adubE_241\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fish.png);\" data-alternative-name=\"animal, food, nature\">fish</span><span id=\"adubE_242\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/whale.png);\" data-alternative-name=\"animal, nature, sea, ocean\">whale</span><span id=\"adubE_243\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/whale2.png);\" data-alternative-name=\"animal, nature, sea, ocean\">whale2</span><span id=\"adubE_244\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dolphin.png);\" data-alternative-name=\"animal, nature, fish, sea, ocean, flipper, fins, beach\">dolphin</span><span id=\"adubE_245\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cow2.png);\" data-alternative-name=\"animal, beef, ox, nature, moo, milk\">cow2</span><span id=\"adubE_246\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ram.png);\" data-alternative-name=\"animal, sheep, nature\">ram</span><span id=\"adubE_247\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rat.png);\" data-alternative-name=\"animal, mouse, rodent\">rat</span><span id=\"adubE_248\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/water_buffalo.png);\" data-alternative-name=\"animal, nature, ox, cow\">water_buffalo</span><span id=\"adubE_249\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tiger2.png);\" data-alternative-name=\"animal, nature, roar\">tiger2</span><span id=\"adubE_250\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rabbit2.png);\" data-alternative-name=\"animal, bunny, nature, pet, magic, spring\">rabbit2</span><span id=\"adubE_251\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dragon.png);\" data-alternative-name=\"animal, myth, nature, chinese, green\">dragon</span><span id=\"adubE_252\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/goat.png);\" data-alternative-name=\"animal, nature\">goat</span><span id=\"adubE_253\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rooster.png);\" data-alternative-name=\"animal, chicken, nature\">rooster</span><span id=\"adubE_254\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dog2.png);\" data-alternative-name=\"animal, nature, friend, doge, pet, faithful\">dog2</span><span id=\"adubE_255\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pig2.png);\" data-alternative-name=\"animal, nature\">pig2</span><span id=\"adubE_256\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mouse2.png);\" data-alternative-name=\"animal, nature, rodent\">mouse2</span><span id=\"adubE_257\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ox.png);\" data-alternative-name=\"animal, cow, beef\">ox</span><span id=\"adubE_258\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dragon_face.png);\" data-alternative-name=\"animal, myth, nature, chinese, green\">dragon_face</span><span id=\"adubE_259\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/blowfish.png);\" data-alternative-name=\"animal, nature, food, sea, ocean\">blowfish</span><span id=\"adubE_260\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/crocodile.png);\" data-alternative-name=\"animal, alligator, nature, reptile\">crocodile</span><span id=\"adubE_261\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dromedary_camel.png);\" data-alternative-name=\"animal, hot, desert, hump\">dromedary_camel</span><span id=\"adubE_262\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/leopard.png);\" data-alternative-name=\"animal, nature\">leopard</span><span id=\"adubE_263\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cat2.png);\" data-alternative-name=\"animal, kitty, kitten, meow, pet, cats\">cat2</span><span id=\"adubE_264\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/poodle.png);\" data-alternative-name=\"animal, dog, 101, nature, pet\">poodle</span><span id=\"adubE_265\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/paw_prints.png);\" data-alternative-name=\"animal\">paw_prints</span><span id=\"adubE_266\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bouquet.png);\" data-alternative-name=\"flowers, nature, spring\">bouquet</span><span id=\"adubE_267\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cherry_blossom.png);\" data-alternative-name=\"floral, nature, plant, spring, flower\">cherry_blossom</span><span id=\"adubE_268\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tulip.png);\" data-alternative-name=\"floral, flowers, plant, nature, summer, spring\">tulip</span><span id=\"adubE_269\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/four_leaf_clover.png);\" data-alternative-name=\"vegetable, plant, nature, lucky\">four_leaf_clover</span><span id=\"adubE_270\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rose.png);\" data-alternative-name=\"floral, flowers, valentines, love, spring\">rose</span><span id=\"adubE_271\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sunflower.png);\" data-alternative-name=\"floral, nature, plant, fall\">sunflower</span><span id=\"adubE_272\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hibiscus.png);\" data-alternative-name=\"floral, plant, vegetable, flowers, beach\">hibiscus</span><span id=\"adubE_273\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/maple_leaf.png);\" data-alternative-name=\"nature, plant, vegetable, canada, fall\">maple_leaf</span><span id=\"adubE_274\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/leaves.png);\" data-alternative-name=\"nature, plant, tree, vegetable, grass, lawn, spring\">leaves</span><span id=\"adubE_275\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fallen_leaf.png);\" data-alternative-name=\"nature, plant, vegetable, leaves\">fallen_leaf</span><span id=\"adubE_276\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/herb.png);\" data-alternative-name=\"vegetable, plant, medicine, weed, grass, lawn\">herb</span><span id=\"adubE_277\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mushroom.png);\" data-alternative-name=\"plant, vegetable\">mushroom</span><span id=\"adubE_278\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cactus.png);\" data-alternative-name=\"vegetable, plant, nature\">cactus</span><span id=\"adubE_279\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/palm_tree.png);\" data-alternative-name=\"plant, vegetable, nature, summer, beach\">palm_tree</span><span id=\"adubE_280\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/evergreen_tree.png);\" data-alternative-name=\"plant, nature\">evergreen_tree</span><span id=\"adubE_281\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/deciduous_tree.png);\" data-alternative-name=\"plant, nature\">deciduous_tree</span><span id=\"adubE_282\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/chestnut.png);\" data-alternative-name=\"food, squirrel\">chestnut</span><span id=\"adubE_283\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/seedling.png);\" data-alternative-name=\"plant, nature, grass, lawn, spring\">seedling</span><span id=\"adubE_284\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/blossom.png);\" data-alternative-name=\"nature, flowers, yellow\">blossom</span><span id=\"adubE_285\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ear_of_rice.png);\" data-alternative-name=\"nature, plant\">ear_of_rice</span><span id=\"adubE_286\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/shell.png);\" data-alternative-name=\"nature, sea, beach\">shell</span><span id=\"adubE_287\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/globe_with_meridians.png);\" data-alternative-name=\"earth, international, world, internet, interweb, i18n\">globe_with_meridians</span><span id=\"adubE_288\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sun_with_face.png);\" data-alternative-name=\"nature, morning, sky\">sun_with_face</span><span id=\"adubE_289\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/full_moon_with_face.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep\">full_moon_with_face</span><span id=\"adubE_290\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/new_moon_with_face.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep\">new_moon_with_face</span><span id=\"adubE_291\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/new_moon.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep\">new_moon</span><span id=\"adubE_292\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/waxing_crescent_moon.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep\">waxing_crescent_moon</span><span id=\"adubE_293\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/first_quarter_moon.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep\">first_quarter_moon</span><span id=\"adubE_294\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/waxing_gibbous_moon.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep, waxing_gibbous_moon\">waxing_gibbous_moon</span><span id=\"adubE_295\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/full_moon.png);\" data-alternative-name=\"nature, yellow, twilight, planet, space, night, evening, sleep\">full_moon</span><span id=\"adubE_296\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/waning_gibbous_moon.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep, waxing_gibbous_moon\">waning_gibbous_moon</span><span id=\"adubE_297\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/last_quarter_moon.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep\">last_quarter_moon</span><span id=\"adubE_298\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/waning_crescent_moon.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep\">waning_crescent_moon</span><span id=\"adubE_299\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/last_quarter_moon_with_face.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep\">last_quarter_moon_with_face</span><span id=\"adubE_300\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/first_quarter_moon_with_face.png);\" data-alternative-name=\"nature, twilight, planet, space, night, evening, sleep\">first_quarter_moon_with_face</span><span id=\"adubE_301\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/crescent_moon.png);\" data-alternative-name=\"night, sleep, sky, evening, magic\">crescent_moon</span><span id=\"adubE_302\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/earth_africa.png);\" data-alternative-name=\"europe, emea, globe, world, international\">earth_africa</span><span id=\"adubE_303\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/earth_americas.png);\" data-alternative-name=\"globe, world, USA, international\">earth_americas</span><span id=\"adubE_304\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/earth_asia.png);\" data-alternative-name=\"globe, world, east, international\">earth_asia</span><span id=\"adubE_305\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/volcano.png);\" data-alternative-name=\"photo, nature, disaster\">volcano</span><span id=\"adubE_306\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/milky_way.png);\" data-alternative-name=\"photo, space, stars\">milky_way</span><span id=\"adubE_307\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/partly_sunny.png);\" data-alternative-name=\"weather, nature, cloudy, morning, fall, spring\">partly_sunny</span><span id=\"adubE_308\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/octocat.png);\" data-alternative-name=\"github, animal, octopus, custom_\">octocat</span><span id=\"adubE_309\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/squirrel.png);\" data-alternative-name=\"animal\">squirrel</span>    <h2>Objects</h2><span id=\"adubE_310\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bamboo.png);\" data-alternative-name=\"plant, nature, vegetable, panda\">bamboo</span><span id=\"adubE_311\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/gift_heart.png);\" data-alternative-name=\"heart, love, valentines\">gift_heart</span><span id=\"adubE_312\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dolls.png);\" data-alternative-name=\"japanese, toy, kimono\">dolls</span><span id=\"adubE_313\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/school_satchel.png);\" data-alternative-name=\"student, education, bag\">school_satchel</span><span id=\"adubE_314\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mortar_board.png);\" data-alternative-name=\"edu, university, school, college, degree, graduation, cap, hat, legal, learn, education\">mortar_board</span><span id=\"adubE_315\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/flags.png);\" data-alternative-name=\"fish, japanese, koinobori, carp, banner\">flags</span><span id=\"adubE_316\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fireworks.png);\" data-alternative-name=\"photo, festival, carnival, congratulations\">fireworks</span><span id=\"adubE_317\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sparkler.png);\" data-alternative-name=\"stars, night, shine\">sparkler</span><span id=\"adubE_318\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wind_chime.png);\" data-alternative-name=\"nature, ding, spring, bell\">wind_chime</span><span id=\"adubE_319\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rice_scene.png);\" data-alternative-name=\"photo, japan, asia, tsukimi\">rice_scene</span><span id=\"adubE_320\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/jack_o_lantern.png);\" data-alternative-name=\"halloween, light, pumpkin, creepy, fall\">jack_o_lantern</span><span id=\"adubE_321\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ghost.png);\" data-alternative-name=\"boom, halloween, spooky, scary\">ghost</span><span id=\"adubE_322\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/santa.png);\" data-alternative-name=\"christmas, festival, man, male, xmas, father christmas\">santa</span><span id=\"adubE_323\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/christmas_tree.png);\" data-alternative-name=\"festival, vacation, december, xmas, celebration\">christmas_tree</span><span id=\"adubE_324\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/gift.png);\" data-alternative-name=\"present, birthday, christmas, xmas\">gift</span><span id=\"adubE_325\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bell.png);\" data-alternative-name=\"sound, notification, christmas, xmas, chime\">bell</span><span id=\"adubE_326\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/no_bell.png);\" data-alternative-name=\"sound, volume, mute, quiet, silent\">no_bell</span><span id=\"adubE_327\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tanabata_tree.png);\" data-alternative-name=\"plant, nature, branch, summer\">tanabata_tree</span><span id=\"adubE_328\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tada.png);\" data-alternative-name=\"party, contulations, birthday, magic, circus\">tada</span><span id=\"adubE_329\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/confetti_ball.png);\" data-alternative-name=\"celebration, festival, party, birthday, circus\">confetti_ball</span><span id=\"adubE_330\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/balloon.png);\" data-alternative-name=\"party, celebration, birthday, circus\">balloon</span><span id=\"adubE_331\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/crystal_ball.png);\" data-alternative-name=\"disco, party, magic, circus, fortune_teller\">crystal_ball</span><span id=\"adubE_332\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cd.png);\" data-alternative-name=\"technology, dvd, disk, disc, 90s\">cd</span><span id=\"adubE_333\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dvd.png);\" data-alternative-name=\"cd, disk, disc\">dvd</span><span id=\"adubE_334\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/floppy_disk.png);\" data-alternative-name=\"oldschool, technology, save, 90s, 80s\">floppy_disk</span><span id=\"adubE_335\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/camera.png);\" data-alternative-name=\"gadgets, photo\">camera</span><span id=\"adubE_336\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/video_camera.png);\" data-alternative-name=\"film, record\">video_camera</span><span id=\"adubE_337\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/movie_camera.png);\" data-alternative-name=\"film, record\">movie_camera</span><span id=\"adubE_338\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/computer.png);\" data-alternative-name=\"tech, laptop, screen, display, monitor\">computer</span><span id=\"adubE_339\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tv.png);\" data-alternative-name=\"television, technology, program, oldschool, show\">tv</span><span id=\"adubE_340\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/iphone.png);\" data-alternative-name=\"technology, apple, gadgets, dial\">iphone</span><span id=\"adubE_341\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/phone.png);\" data-alternative-name=\"technology, communication, dial, telephone\">phone</span><span id=\"adubE_342\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/telephone.png);\" data-alternative-name=\"calling\">telephone</span><span id=\"adubE_343\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/telephone_receiver.png);\" data-alternative-name=\"technology, communication, dial\">telephone_receiver</span><span id=\"adubE_344\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pager.png);\" data-alternative-name=\"bbcall, oldschool, 90s\">pager</span><span id=\"adubE_345\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fax.png);\" data-alternative-name=\"communication, technology\">fax</span><span id=\"adubE_346\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/minidisc.png);\" data-alternative-name=\"technology, record, data, disk, 90s\">minidisc</span><span id=\"adubE_347\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/vhs.png);\" data-alternative-name=\"record, video, oldschool, 90s, 80s\">vhs</span><span id=\"adubE_348\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sound.png);\" data-alternative-name=\"loud, noise, volume, speaker, broadcast\">sound</span><span id=\"adubE_349\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/speaker.png);\" data-alternative-name=\"sound, volume, silence, broadcast\">speaker</span><span id=\"adubE_350\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mute.png);\" data-alternative-name=\"sound, volume, silence, quiet\">mute</span><span id=\"adubE_351\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/loudspeaker.png);\" data-alternative-name=\"volume, sound\">loudspeaker</span><span id=\"adubE_352\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mega.png);\" data-alternative-name=\"sound, speaker, volume\">mega</span><span id=\"adubE_353\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hourglass.png);\" data-alternative-name=\"time, clock, oldschool, limit, exam, quiz, test\">hourglass</span><span id=\"adubE_354\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hourglass_flowing_sand.png);\" data-alternative-name=\"oldschool, time, countdown\">hourglass_flowing_sand</span><span id=\"adubE_355\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/alarm_clock.png);\" data-alternative-name=\"time, wake\">alarm_clock</span><span id=\"adubE_356\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/watch.png);\" data-alternative-name=\"clock, time, accessories\">watch</span><span id=\"adubE_357\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/radio.png);\" data-alternative-name=\"communication, music, podcast, program\">radio</span><span id=\"adubE_358\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/satellite.png);\" data-alternative-name=\"communication, future, radio, space\">satellite</span><span id=\"adubE_359\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/loop.png);\" data-alternative-name=\"tape, cassette\">loop</span><span id=\"adubE_360\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mag.png);\" data-alternative-name=\"magnifying, glass, search, zoom, find, detective\">mag</span><span id=\"adubE_361\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mag_right.png);\" data-alternative-name=\"magnifying, glass, search, zoom, find, detective\">mag_right</span><span id=\"adubE_362\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/unlock.png);\" data-alternative-name=\"privacy, security\">unlock</span><span id=\"adubE_363\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/lock.png);\" data-alternative-name=\"security, password, padlock\">lock</span><span id=\"adubE_364\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/lock_with_ink_pen.png);\" data-alternative-name=\"security, secret\">lock_with_ink_pen</span><span id=\"adubE_365\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/closed_lock_with_key.png);\" data-alternative-name=\"security, privacy\">closed_lock_with_key</span><span id=\"adubE_366\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/key.png);\" data-alternative-name=\"lock, door, password\">key</span><span id=\"adubE_367\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bulb.png);\" data-alternative-name=\"light, electricity, idea\">bulb</span><span id=\"adubE_368\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/flashlight.png);\" data-alternative-name=\"dark, camping, sight, night\">flashlight</span><span id=\"adubE_369\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/high_brightness.png);\" data-alternative-name=\"sun, light\">high_brightness</span><span id=\"adubE_370\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/low_brightness.png);\" data-alternative-name=\"sun, afternoon, warm, summer\">low_brightness</span><span id=\"adubE_371\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/electric_plug.png);\" data-alternative-name=\"charger, power\">electric_plug</span><span id=\"adubE_372\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/battery.png);\" data-alternative-name=\"power, energy, sustain\">battery</span><span id=\"adubE_373\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/calling.png);\" data-alternative-name=\"iphone, incoming\">calling</span><span id=\"adubE_374\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/email.png);\" data-alternative-name=\"envelope, letter, postal, inbox, communication\">email</span><span id=\"adubE_375\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mailbox.png);\" data-alternative-name=\"email, inbox, communication\">mailbox</span><span id=\"adubE_376\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/postbox.png);\" data-alternative-name=\"email, letter, envelope\">postbox</span><span id=\"adubE_377\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bath.png);\" data-alternative-name=\"clean, shower, bathroom\">bath</span><span id=\"adubE_378\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bathtub.png);\" data-alternative-name=\"clean, shower, bathroom\">bathtub</span><span id=\"adubE_379\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/shower.png);\" data-alternative-name=\"water, clean, bathroom\">shower</span><span id=\"adubE_380\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/toilet.png);\" data-alternative-name=\"restroom, wc, washroom, bathroom, potty\">toilet</span><span id=\"adubE_381\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wrench.png);\" data-alternative-name=\"tools, diy, ikea, fix, maintainer\">wrench</span><span id=\"adubE_382\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/nut_and_bolt.png);\" data-alternative-name=\"tools, handy, fix\">nut_and_bolt</span><span id=\"adubE_383\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hammer.png);\" data-alternative-name=\"tools, verdict, judge, done, law, legal, ruling, gavel\">hammer</span><span id=\"adubE_384\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/seat.png);\" data-alternative-name=\"sit, airplane, transport, bus, flight, fly\">seat</span><span id=\"adubE_385\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/moneybag.png);\" data-alternative-name=\"dollar, payment, coins, sale\">moneybag</span><span id=\"adubE_386\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/yen.png);\" data-alternative-name=\"bill cash currency money, money, sales, japanese, dollar, currency\">yen</span><span id=\"adubE_387\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dollar.png);\" data-alternative-name=\"bill cash currency money, money, sales, bill, currency\">dollar</span><span id=\"adubE_388\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pound.png);\" data-alternative-name=\"bill cash currency money, british, sterling, money, sales, bills, uk, england, currency\">pound</span><span id=\"adubE_389\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/euro.png);\" data-alternative-name=\"bill cash currency money, money, sales, dollar, currency\">euro</span><span id=\"adubE_390\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/credit_card.png);\" data-alternative-name=\"money, sales, dollar, bill, payment, shopping\">credit_card</span><span id=\"adubE_391\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/money_with_wings.png);\" data-alternative-name=\"money, dollar, bills, payment, sale\">money_with_wings</span><span id=\"adubE_392\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/e-mail.png);\" data-alternative-name=\"mail, send, communication, inbox, email\">e-mail</span><span id=\"adubE_393\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/inbox_tray.png);\" data-alternative-name=\"email, documents\">inbox_tray</span><span id=\"adubE_394\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/outbox_tray.png);\" data-alternative-name=\"inbox, email\">outbox_tray</span><span id=\"adubE_395\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/envelope.png);\" data-alternative-name=\"message\">envelope</span><span id=\"adubE_396\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/incoming_envelope.png);\" data-alternative-name=\"email, inbox\">incoming_envelope</span><span id=\"adubE_397\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/postal_horn.png);\" data-alternative-name=\"instrument, music\">postal_horn</span><span id=\"adubE_398\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mailbox_closed.png);\" data-alternative-name=\"email, communication, inbox\">mailbox_closed</span><span id=\"adubE_399\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mailbox_with_mail.png);\" data-alternative-name=\"email, inbox, communication\">mailbox_with_mail</span><span id=\"adubE_400\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mailbox_with_no_mail.png);\" data-alternative-name=\"email, inbox\">mailbox_with_no_mail</span><span id=\"adubE_401\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/package.png);\" data-alternative-name=\"box, mail, gift, cardboard, moving\">package</span><span id=\"adubE_402\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/door.png);\" data-alternative-name=\"house, entry, exit\">door</span><span id=\"adubE_403\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/smoking.png);\" data-alternative-name=\"smoke, kills, tobacco, cigarette, joint\">smoking</span><span id=\"adubE_404\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bomb.png);\" data-alternative-name=\"boom, explode, explosion, terrorism\">bomb</span><span id=\"adubE_405\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/gun.png);\" data-alternative-name=\"violence, weapon, pistol, revolver\">gun</span><span id=\"adubE_406\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hocho.png);\" data-alternative-name=\"knife, blade, cutlery, kitchen, weapon\">hocho</span><span id=\"adubE_407\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pill.png);\" data-alternative-name=\"health, medicine, doctor, pharmacy, drug\">pill</span><span id=\"adubE_408\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/syringe.png);\" data-alternative-name=\"health, hospital, drugs, blood, medicine, needle, doctor, nurse\">syringe</span><span id=\"adubE_409\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/page_facing_up.png);\" data-alternative-name=\"documents, office, paper, information\">page_facing_up</span><span id=\"adubE_410\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/page_with_curl.png);\" data-alternative-name=\"documents, office, paper\">page_with_curl</span><span id=\"adubE_411\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bookmark_tabs.png);\" data-alternative-name=\"favorite, save, order, tidy\">bookmark_tabs</span><span id=\"adubE_412\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bar_chart.png);\" data-alternative-name=\"graph, presentation, stats\">bar_chart</span><span id=\"adubE_413\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/chart_with_upwards_trend.png);\" data-alternative-name=\"graph, presenetation, stats, recovery, business, economics, money, sales, good, success\">chart_with_upwards_trend</span><span id=\"adubE_414\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/chart_with_downwards_trend.png);\" data-alternative-name=\"graph, presentation, stats, recession, business, economics, money, sales, bad, failure\">chart_with_downwards_trend</span><span id=\"adubE_415\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/scroll.png);\" data-alternative-name=\"documents, ancient, history, paper\">scroll</span><span id=\"adubE_416\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clipboard.png);\" data-alternative-name=\"stationery, documents\">clipboard</span><span id=\"adubE_417\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/calendar.png);\" data-alternative-name=\"schedule, date, planning\">calendar</span><span id=\"adubE_418\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/date.png);\" data-alternative-name=\"calendar, schedule\">date</span><span id=\"adubE_419\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/card_index.png);\" data-alternative-name=\"business, stationery\">card_index</span><span id=\"adubE_420\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/file_folder.png);\" data-alternative-name=\"documents, business, office\">file_folder</span><span id=\"adubE_421\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/open_file_folder.png);\" data-alternative-name=\"documents, load\">open_file_folder</span><span id=\"adubE_422\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/scissors.png);\" data-alternative-name=\"stationery, cut\">scissors</span><span id=\"adubE_423\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pushpin.png);\" data-alternative-name=\"stationery, mark, here\">pushpin</span><span id=\"adubE_424\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/paperclip.png);\" data-alternative-name=\"documents, stationery\">paperclip</span><span id=\"adubE_425\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/black_nib.png);\" data-alternative-name=\"pen, stationery, writing, write\">black_nib</span><span id=\"adubE_426\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pencil2.png);\" data-alternative-name=\"stationery, write, paper, writing, school, study\">pencil2</span><span id=\"adubE_427\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/straight_ruler.png);\" data-alternative-name=\"stationery, calculate, length, math, school, drawing, architect, sketch\">straight_ruler</span><span id=\"adubE_428\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/triangular_ruler.png);\" data-alternative-name=\"stationery, math, architect, sketch\">triangular_ruler</span><span id=\"adubE_429\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/closed_book.png);\" data-alternative-name=\"read, library, knowledge, textbook, learn\">closed_book</span><span id=\"adubE_430\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/green_book.png);\" data-alternative-name=\"read, library, knowledge, study\">green_book</span><span id=\"adubE_431\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/blue_book.png);\" data-alternative-name=\"read, library, knowledge, learn, study\">blue_book</span><span id=\"adubE_432\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/orange_book.png);\" data-alternative-name=\"read, library, knowledge, textbook, study\">orange_book</span><span id=\"adubE_433\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/notebook.png);\" data-alternative-name=\"stationery, record, notes, paper, study\">notebook</span><span id=\"adubE_434\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/notebook_with_decorative_cover.png);\" data-alternative-name=\"classroom, notes, record, paper, study\">notebook_with_decorative_cover</span><span id=\"adubE_435\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ledger.png);\" data-alternative-name=\"notes, paper\">ledger</span><span id=\"adubE_436\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/books.png);\" data-alternative-name=\"literature, library, study\">books</span><span id=\"adubE_437\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bookmark.png);\" data-alternative-name=\"favorite, label, save\">bookmark</span><span id=\"adubE_438\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/name_badge.png);\" data-alternative-name=\"fire, forbid\">name_badge</span><span id=\"adubE_439\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/microscope.png);\" data-alternative-name=\"laboratory, experiment, zoomin, science, study\">microscope</span><span id=\"adubE_440\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/telescope.png);\" data-alternative-name=\"stars, space, zoom\">telescope</span><span id=\"adubE_441\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/newspaper.png);\" data-alternative-name=\"press, headline\">newspaper</span><span id=\"adubE_442\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/football.png);\" data-alternative-name=\"sport, sports, balls, NFL\">football</span><span id=\"adubE_443\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/basketball.png);\" data-alternative-name=\"sport, sports, balls, NBA\">basketball</span><span id=\"adubE_444\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/soccer.png);\" data-alternative-name=\"sport, sports, balls, football, fifa\">soccer</span><span id=\"adubE_445\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/baseball.png);\" data-alternative-name=\"sport, sports, balls, MLB\">baseball</span><span id=\"adubE_446\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tennis.png);\" data-alternative-name=\"sport, sports, balls, green\">tennis</span><span id=\"adubE_447\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/8ball.png);\" data-alternative-name=\"magic_ball, pool, hobby, game, luck, magic\">8ball</span><span id=\"adubE_448\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rugby_football.png);\" data-alternative-name=\"sport, sports, team\">rugby_football</span><span id=\"adubE_449\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bowling.png);\" data-alternative-name=\"sport, sports, fun, play\">bowling</span><span id=\"adubE_450\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/golf.png);\" data-alternative-name=\"sport, sports, business, flag, hole, summer\">golf</span><span id=\"adubE_451\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mountain_bicyclist.png);\" data-alternative-name=\"sport, vehicle, transportation, sports, human, race, bike\">mountain_bicyclist</span><span id=\"adubE_452\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bicyclist.png);\" data-alternative-name=\"sport, vehicle, sports, bike, exercise, hipster\">bicyclist</span><span id=\"adubE_453\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/horse_racing.png);\" data-alternative-name=\"sport, animal, betting, competition, gambling, luck\">horse_racing</span><span id=\"adubE_454\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/snowboarder.png);\" data-alternative-name=\"sport, sports, winter\">snowboarder</span><span id=\"adubE_455\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/swimmer.png);\" data-alternative-name=\"sport, sports, exercise, human, athlete, water, summer\">swimmer</span><span id=\"adubE_456\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/surfer.png);\" data-alternative-name=\"sport, sports, ocean, sea, summer, beach\">surfer</span><span id=\"adubE_457\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ski.png);\" data-alternative-name=\"sport, sports, winter, cold, snow\">ski</span><span id=\"adubE_458\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/spades.png);\" data-alternative-name=\"cards, suit, poker, suits, magic\">spades</span><span id=\"adubE_459\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hearts.png);\" data-alternative-name=\"heart, cards, suit, poker, magic, suits\">hearts</span><span id=\"adubE_460\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clubs.png);\" data-alternative-name=\"cards, suit, poker, magic, suits\">clubs</span><span id=\"adubE_461\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/diamonds.png);\" data-alternative-name=\"cards, suit, poker, magic, suits\">diamonds</span><span id=\"adubE_462\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/gem.png);\" data-alternative-name=\"jewelery, blue, ruby, diamond, jewelry\">gem</span><span id=\"adubE_463\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ring.png);\" data-alternative-name=\"jewelery, wedding, propose, marriage, valentines, diamond, fashion, jewelry, gem\">ring</span><span id=\"adubE_464\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/trophy.png);\" data-alternative-name=\"win, award, contest, place, ftw, ceremony\">trophy</span><span id=\"adubE_465\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/musical_score.png);\" data-alternative-name=\"treble, clef\">musical_score</span><span id=\"adubE_466\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/musical_keyboard.png);\" data-alternative-name=\"piano, instrument\">musical_keyboard</span><span id=\"adubE_467\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/violin.png);\" data-alternative-name=\"music, instrument, orchestra, symphony\">violin</span><span id=\"adubE_468\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/space_invader.png);\" data-alternative-name=\"game, arcade, play\">space_invader</span><span id=\"adubE_469\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/video_game.png);\" data-alternative-name=\"controller, play, console, PS4\">video_game</span><span id=\"adubE_470\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/black_joker.png);\" data-alternative-name=\"poker, cards, game, play, magic\">black_joker</span><span id=\"adubE_471\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/flower_playing_cards.png);\" data-alternative-name=\"floral, game, sunset, red\">flower_playing_cards</span><span id=\"adubE_472\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/game_die.png);\" data-alternative-name=\"dice, random, tabbletop, play, luck\">game_die</span><span id=\"adubE_473\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dart.png);\" data-alternative-name=\"game, play, bar\">dart</span><span id=\"adubE_474\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mahjong.png);\" data-alternative-name=\"game, play, chinese, kanji\">mahjong</span><span id=\"adubE_475\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clapper.png);\" data-alternative-name=\"movie, film, record\">clapper</span><span id=\"adubE_476\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/memo.png);\" data-alternative-name=\"write, documents, stationery, pencil, paper, writing, legal, exam, quiz, test, study\">memo</span><span id=\"adubE_477\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pencil.png);\" data-alternative-name=\"write\">pencil</span><span id=\"adubE_478\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/book.png);\" data-alternative-name=\"open_book, read, library, knowledge, literature, learn, study\">book</span><span id=\"adubE_479\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/art.png);\" data-alternative-name=\"design, paint, draw\">art</span><span id=\"adubE_480\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/microphone.png);\" data-alternative-name=\"sound, music, PA\">microphone</span><span id=\"adubE_481\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/headphones.png);\" data-alternative-name=\"music, score, gadgets\">headphones</span><span id=\"adubE_482\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/trumpet.png);\" data-alternative-name=\"music, brass\">trumpet</span><span id=\"adubE_483\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/saxophone.png);\" data-alternative-name=\"music, instrument, jazz, blues\">saxophone</span><span id=\"adubE_484\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/guitar.png);\" data-alternative-name=\"music, instrument\">guitar</span><span id=\"adubE_485\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/shoe.png);\" data-alternative-name=\"fashion\">shoe</span><span id=\"adubE_486\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sandal.png);\" data-alternative-name=\"shoes, fashion, flip flops\">sandal</span><span id=\"adubE_487\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/high_heel.png);\" data-alternative-name=\"fashion, shoes, female, pumps, stiletto\">high_heel</span><span id=\"adubE_488\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/lipstick.png);\" data-alternative-name=\"female, girl, fashion, woman\">lipstick</span><span id=\"adubE_489\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/boot.png);\" data-alternative-name=\"shoes, fashion\">boot</span><span id=\"adubE_490\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/shirt.png);\" data-alternative-name=\"fashion, cloth,formal\">shirt</span><span id=\"adubE_491\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tshirt.png);\" data-alternative-name=\"fashion, cloth, casual,tee\">tshirt</span><span id=\"adubE_492\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/necktie.png);\" data-alternative-name=\"shirt, suitup, formal, fashion, cloth, business\">necktie</span><span id=\"adubE_493\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/womans_clothes.png);\" data-alternative-name=\"fashion, shopping, female\">womans_clothes</span><span id=\"adubE_494\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dress.png);\" data-alternative-name=\"clothes, fashion, shopping\">dress</span><span id=\"adubE_495\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/running_shirt_with_sash.png);\" data-alternative-name=\"play, pageant\">running_shirt_with_sash</span><span id=\"adubE_496\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/jeans.png);\" data-alternative-name=\"fashion, shopping\">jeans</span><span id=\"adubE_497\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/kimono.png);\" data-alternative-name=\"dress, fashion, women, female, japanese\">kimono</span><span id=\"adubE_498\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bikini.png);\" data-alternative-name=\"swimming, female, woman, girl, fashion, beach, summer\">bikini</span><span id=\"adubE_499\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ribbon.png);\" data-alternative-name=\"decoration, pink, girl, bowtie\">ribbon</span><span id=\"adubE_500\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tophat.png);\" data-alternative-name=\"magic, gentleman, classy, circus\">tophat</span><span id=\"adubE_501\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/crown.png);\" data-alternative-name=\"king, kod, leader, royalty, lord\">crown</span><span id=\"adubE_502\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/womans_hat.png);\" data-alternative-name=\"fashion, accessories, female, lady, spring\">womans_hat</span><span id=\"adubE_503\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mans_shoe.png);\" data-alternative-name=\"fashion, male\">mans_shoe</span><span id=\"adubE_504\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/closed_umbrella.png);\" data-alternative-name=\"weather, rain, drizzle\">closed_umbrella</span><span id=\"adubE_505\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/briefcase.png);\" data-alternative-name=\"business, documents, work, law, legal\">briefcase</span><span id=\"adubE_506\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/handbag.png);\" data-alternative-name=\"fashion, accessory, accessories, shopping\">handbag</span><span id=\"adubE_507\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pouch.png);\" data-alternative-name=\"bag, accessories, shopping\">pouch</span><span id=\"adubE_508\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/purse.png);\" data-alternative-name=\"pocketbook, fashion, accessories, money, sales, shopping\">purse</span><span id=\"adubE_509\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/eyeglasses.png);\" data-alternative-name=\"fashion, accessories, eyesight, nerd, dork, geek\">eyeglasses</span><span id=\"adubE_510\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fishing_pole_and_fish.png);\" data-alternative-name=\"food, hobby, summer\">fishing_pole_and_fish</span><span id=\"adubE_511\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/coffee.png);\" data-alternative-name=\"drink, beverage, cafe, espresso\">coffee</span><span id=\"adubE_512\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tea.png);\" data-alternative-name=\"drink, bowl, breakfast, green, british\">tea</span><span id=\"adubE_513\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sake.png);\" data-alternative-name=\"drink alcohol, wine, drink, drunk, beverage, japanese, alcohol, booze\">sake</span><span id=\"adubE_514\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/baby_bottle.png);\" data-alternative-name=\"food, container, milk\">baby_bottle</span><span id=\"adubE_515\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/beer.png);\" data-alternative-name=\"drink alcohol, relax, beverage, drink, drunk, party, pub, summer, alcohol, booze\">beer</span><span id=\"adubE_516\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/beers.png);\" data-alternative-name=\"drink alcohol, relax, beverage, drink, drunk, party, pub, summer, alcohol, booze\">beers</span><span id=\"adubE_517\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cocktail.png);\" data-alternative-name=\"drink alcohol, drink, drunk, alcohol, beverage, booze\">cocktail</span><span id=\"adubE_518\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tropical_drink.png);\" data-alternative-name=\"beverage, cocktail, summer, beach, alcohol, booze\">tropical_drink</span><span id=\"adubE_519\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wine_glass.png);\" data-alternative-name=\"drink alcohol, drink, beverage, drunk, alcohol, booze\">wine_glass</span><span id=\"adubE_520\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fork_and_knife.png);\" data-alternative-name=\"cutlery, kitchen\">fork_and_knife</span><span id=\"adubE_521\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pizza.png);\" data-alternative-name=\"food, italian dairy, party\">pizza</span><span id=\"adubE_522\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hamburger.png);\" data-alternative-name=\"food, american meat, meat, fast food, beef, cheeseburger, mcdonalds, burger king\">hamburger</span><span id=\"adubE_523\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fries.png);\" data-alternative-name=\"food, american, chips, snack, fast food\">fries</span><span id=\"adubE_524\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/poultry_leg.png);\" data-alternative-name=\"food, meat, drumstick, bird, chicken, turkey\">poultry_leg</span><span id=\"adubE_525\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/meat_on_bone.png);\" data-alternative-name=\"food, meat, good, drumstick\">meat_on_bone</span><span id=\"adubE_526\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/spaghetti.png);\" data-alternative-name=\"food, italian noodles, italian, noodle\">spaghetti</span><span id=\"adubE_527\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/curry.png);\" data-alternative-name=\"food, indian, spicy, hot\">curry</span><span id=\"adubE_528\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fried_shrimp.png);\" data-alternative-name=\"food, seafood, animal, appetizer, summer\">fried_shrimp</span><span id=\"adubE_529\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bento.png);\" data-alternative-name=\"food, japanese, box\">bento</span><span id=\"adubE_530\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sushi.png);\" data-alternative-name=\"food, japanese, fish, rice\">sushi</span><span id=\"adubE_531\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fish_cake.png);\" data-alternative-name=\"food, japanese seafood, naruto, japan, sea, beach\">fish_cake</span><span id=\"adubE_532\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rice_ball.png);\" data-alternative-name=\"food, japanese\">rice_ball</span><span id=\"adubE_533\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rice_cracker.png);\" data-alternative-name=\"food, japanese\">rice_cracker</span><span id=\"adubE_534\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rice.png);\" data-alternative-name=\"food, china, asian\">rice</span><span id=\"adubE_535\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ramen.png);\" data-alternative-name=\"food noodles, food, japanese, noodle, chipsticks\">ramen</span><span id=\"adubE_536\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/stew.png);\" data-alternative-name=\"food, meat, soup\">stew</span><span id=\"adubE_537\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/oden.png);\" data-alternative-name=\"food, japanese\">oden</span><span id=\"adubE_538\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/dango.png);\" data-alternative-name=\"food, japanese, barbecue, meat\">dango</span><span id=\"adubE_539\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/egg.png);\" data-alternative-name=\"food,, food, breakfast, kitchen\">egg</span><span id=\"adubE_540\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bread.png);\" data-alternative-name=\"food,, food, wheat, breakfast, toast\">bread</span><span id=\"adubE_541\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/doughnut.png);\" data-alternative-name=\"food, dessert, snack, sweet, donut\">doughnut</span><span id=\"adubE_542\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/custard.png);\" data-alternative-name=\"food, dessert\">custard</span><span id=\"adubE_543\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/icecream.png);\" data-alternative-name=\"food, dessert, hot, summer\">icecream</span><span id=\"adubE_544\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ice_cream.png);\" data-alternative-name=\"food, dessert, hot\">ice_cream</span><span id=\"adubE_545\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/shaved_ice.png);\" data-alternative-name=\"food, dessert, hot, summer\">shaved_ice</span><span id=\"adubE_546\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/birthday.png);\" data-alternative-name=\"party, cake, celebration\">birthday</span><span id=\"adubE_547\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cake.png);\" data-alternative-name=\"food, dessert\">cake</span><span id=\"adubE_548\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cookie.png);\" data-alternative-name=\"food, dessert, snack, oreo, chocolate, sweet\">cookie</span><span id=\"adubE_549\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/chocolate_bar.png);\" data-alternative-name=\"food, dessert, snack, sweet\">chocolate_bar</span><span id=\"adubE_550\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/candy.png);\" data-alternative-name=\"food, dessert, snack, sweet\">candy</span><span id=\"adubE_551\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/lollipop.png);\" data-alternative-name=\"food, dessert, snack, candy, sweet\">lollipop</span><span id=\"adubE_552\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/honey_pot.png);\" data-alternative-name=\"food, dessert, bees, sweet, kitchen\">honey_pot</span><span id=\"adubE_553\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/apple.png);\" data-alternative-name=\"food, fruit, mac, school\">apple</span><span id=\"adubE_554\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/green_apple.png);\" data-alternative-name=\"food, fruit, nature\">green_apple</span><span id=\"adubE_555\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tangerine.png);\" data-alternative-name=\"food, fruit, nature\">tangerine</span><span id=\"adubE_556\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/lemon.png);\" data-alternative-name=\"food, fruit, nature\">lemon</span><span id=\"adubE_557\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cherries.png);\" data-alternative-name=\"food, fruit\">cherries</span><span id=\"adubE_558\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/grapes.png);\" data-alternative-name=\"food, fruit, wine\">grapes</span><span id=\"adubE_559\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/watermelon.png);\" data-alternative-name=\"food, fruit, picnic, summer\">watermelon</span><span id=\"adubE_560\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/strawberry.png);\" data-alternative-name=\"food, fruit, nature\">strawberry</span><span id=\"adubE_561\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/peach.png);\" data-alternative-name=\"food, fruit, nature\">peach</span><span id=\"adubE_562\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/melon.png);\" data-alternative-name=\"food, fruit, nature\">melon</span><span id=\"adubE_563\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/banana.png);\" data-alternative-name=\"food, fruit, monkey\">banana</span><span id=\"adubE_564\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pear.png);\" data-alternative-name=\"food, fruit, nature\">pear</span><span id=\"adubE_565\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pineapple.png);\" data-alternative-name=\"food, fruit, nature\">pineapple</span><span id=\"adubE_566\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sweet_potato.png);\" data-alternative-name=\"food, vegetable, nature\">sweet_potato</span><span id=\"adubE_567\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/eggplant.png);\" data-alternative-name=\"food, vegetable, nature, aubergine\">eggplant</span><span id=\"adubE_568\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tomato.png);\" data-alternative-name=\"food, fruit, vegetable, nature\">tomato</span><span id=\"adubE_569\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/corn.png);\" data-alternative-name=\"food, vegetable, plant\">corn</span>    <h2>Places</h2><span id=\"adubE_570\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/house.png);\" data-alternative-name=\"building, home\">house</span><span id=\"adubE_571\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/house_with_garden.png);\" data-alternative-name=\"building, home, plant, nature\">house_with_garden</span><span id=\"adubE_572\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/school.png);\" data-alternative-name=\"building, student, education, learn, teach\">school</span><span id=\"adubE_573\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/office.png);\" data-alternative-name=\"building, unit, bureau, work\">office</span><span id=\"adubE_574\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/post_office.png);\" data-alternative-name=\"building, email, communication\">post_office</span><span id=\"adubE_575\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hospital.png);\" data-alternative-name=\"building, health, surgery, doctor\">hospital</span><span id=\"adubE_576\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bank.png);\" data-alternative-name=\"building, money, sales, cash, business, enterprise\">bank</span><span id=\"adubE_577\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/convenience_store.png);\" data-alternative-name=\"building, shopping, groceries\">convenience_store</span><span id=\"adubE_578\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/love_hotel.png);\" data-alternative-name=\"building, like, affection, dating\">love_hotel</span><span id=\"adubE_579\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hotel.png);\" data-alternative-name=\"building, whotel, accomodation, checkin\">hotel</span><span id=\"adubE_580\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wedding.png);\" data-alternative-name=\"building, love, like, affection, couple, marriage, bride, groom, church, heart\">wedding</span><span id=\"adubE_581\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/church.png);\" data-alternative-name=\"building, religion, christ\">church</span><span id=\"adubE_582\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/department_store.png);\" data-alternative-name=\"building, shopping, mall\">department_store</span><span id=\"adubE_583\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/european_post_office.png);\" data-alternative-name=\"building, email\">european_post_office</span><span id=\"adubE_584\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/city_sunrise.png);\" data-alternative-name=\"photo, good morning, dawn\">city_sunrise</span><span id=\"adubE_585\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/city_sunset.png);\" data-alternative-name=\"photo, evening, sky, buildings\">city_sunset</span><span id=\"adubE_586\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/japanese_castle.png);\" data-alternative-name=\"photo, building, asia\">japanese_castle</span><span id=\"adubE_587\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/european_castle.png);\" data-alternative-name=\"building, royalty, history\">european_castle</span><span id=\"adubE_588\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tent.png);\" data-alternative-name=\"camping, photo, camp, outdoors\">tent</span><span id=\"adubE_589\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/factory.png);\" data-alternative-name=\"building, industry, pollution, smoke\">factory</span><span id=\"adubE_590\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tokyo_tower.png);\" data-alternative-name=\"photo, japanese, asia\">tokyo_tower</span><span id=\"adubE_591\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/japan.png);\" data-alternative-name=\"nation, country, japanese, asia, island\">japan</span><span id=\"adubE_592\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mount_fuji.png);\" data-alternative-name=\"photo, mountain, nature, japanese\">mount_fuji</span><span id=\"adubE_593\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sunrise_over_mountains.png);\" data-alternative-name=\"view, vacation, photo\">sunrise_over_mountains</span><span id=\"adubE_594\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sunrise.png);\" data-alternative-name=\"morning, view, vacation, photo\">sunrise</span><span id=\"adubE_595\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/stars.png);\" data-alternative-name=\"night, photo, falling, sky, bright\">stars</span><span id=\"adubE_596\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/statue_of_liberty.png);\" data-alternative-name=\"american, newyork, monument, head\">statue_of_liberty</span><span id=\"adubE_597\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bridge_at_night.png);\" data-alternative-name=\"photo, sanfrancisco\">bridge_at_night</span><span id=\"adubE_598\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/carousel_horse.png);\" data-alternative-name=\"photo, carnival, ride\">carousel_horse</span><span id=\"adubE_599\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rainbow.png);\" data-alternative-name=\"nature, happy, unicorn, photo, sky, spring, color\">rainbow</span><span id=\"adubE_600\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ferris_wheel.png);\" data-alternative-name=\"photo, carnival, londoneye\">ferris_wheel</span><span id=\"adubE_601\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fountain.png);\" data-alternative-name=\"photo, summer, water, fresh\">fountain</span><span id=\"adubE_602\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/roller_coaster.png);\" data-alternative-name=\"carnival, playground, photo, ride, fun\">roller_coaster</span><span id=\"adubE_603\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ship.png);\" data-alternative-name=\"vehicle, transportation, titanic, deploy, cruise\">ship</span><span id=\"adubE_604\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/speedboat.png);\" data-alternative-name=\"vehicle, ship, transportation, summer\">speedboat</span><span id=\"adubE_605\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/boat.png);\" data-alternative-name=\"vehicle, ship, summer, transportation, water, sailing, sailboat\">boat</span><span id=\"adubE_606\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sailboat.png);\" data-alternative-name=\"vehicle\">sailboat</span><span id=\"adubE_607\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rowboat.png);\" data-alternative-name=\"vehicle, sports, hobby, water, ship\">rowboat</span><span id=\"adubE_608\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/anchor.png);\" data-alternative-name=\"ship, ferry, sea, boat\">anchor</span><span id=\"adubE_609\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rocket.png);\" data-alternative-name=\"launch, ship, staffmode, NASA, outer space, outer_space, fly\">rocket</span><span id=\"adubE_610\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/airplane.png);\" data-alternative-name=\"vehicle, transportation, flight, fly\">airplane</span><span id=\"adubE_611\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/helicopter.png);\" data-alternative-name=\"vehicle, transportation, fly\">helicopter</span><span id=\"adubE_612\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/steam_locomotive.png);\" data-alternative-name=\"vehicle, transportation, train\">steam_locomotive</span><span id=\"adubE_613\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tram.png);\" data-alternative-name=\"vehicle, transportation\">tram</span><span id=\"adubE_614\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mountain_railway.png);\" data-alternative-name=\"vehicle, transportation\">mountain_railway</span><span id=\"adubE_615\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bike.png);\" data-alternative-name=\"vehicle, sports, bicycle, exercise, hipster\">bike</span><span id=\"adubE_616\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/aerial_tramway.png);\" data-alternative-name=\"vehicle, transportation, ski\">aerial_tramway</span><span id=\"adubE_617\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/suspension_railway.png);\" data-alternative-name=\"vehicle, transportation\">suspension_railway</span><span id=\"adubE_618\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mountain_cableway.png);\" data-alternative-name=\"vehicle, transportation, ski\">mountain_cableway</span><span id=\"adubE_619\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tractor.png);\" data-alternative-name=\"vehicle, car, farming, agriculture\">tractor</span><span id=\"adubE_620\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/blue_car.png);\" data-alternative-name=\"vehicle, transportation\">blue_car</span><span id=\"adubE_621\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/oncoming_automobile.png);\" data-alternative-name=\"vehicle, car, transportation\">oncoming_automobile</span><span id=\"adubE_622\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/car.png);\" data-alternative-name=\"vehicle, car, red, transportation\">car</span><span id=\"adubE_623\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/red_car.png);\" data-alternative-name=\"vehicle\">red_car</span><span id=\"adubE_624\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/taxi.png);\" data-alternative-name=\"vehicle, car, uber, cars, transportation\">taxi</span><span id=\"adubE_625\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/oncoming_taxi.png);\" data-alternative-name=\"vehicle, car, cars, uber\">oncoming_taxi</span><span id=\"adubE_626\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/articulated_lorry.png);\" data-alternative-name=\"vehicle, cars, transportation, express\">articulated_lorry</span><span id=\"adubE_627\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bus.png);\" data-alternative-name=\"vehicle, car, transportation\">bus</span><span id=\"adubE_628\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/oncoming_bus.png);\" data-alternative-name=\"vehicle, transportation\">oncoming_bus</span><span id=\"adubE_629\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rotating_light.png);\" data-alternative-name=\"police, ambulance, 911, emergency, alert, error, pinged, law, legal\">rotating_light</span><span id=\"adubE_630\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/police_car.png);\" data-alternative-name=\"vehicle, cars, transportation, law, legal, enforcement\">police_car</span><span id=\"adubE_631\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/oncoming_police_car.png);\" data-alternative-name=\"vehicle, law, legal, enforcement, 911\">oncoming_police_car</span><span id=\"adubE_632\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fire_engine.png);\" data-alternative-name=\"vehicle, transportation, cars\">fire_engine</span><span id=\"adubE_633\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ambulance.png);\" data-alternative-name=\"vehicle, health, 911, hospital\">ambulance</span><span id=\"adubE_634\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/minibus.png);\" data-alternative-name=\"vehicle, car, transportation\">minibus</span><span id=\"adubE_635\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/truck.png);\" data-alternative-name=\"vehicle, cars, transportation\">truck</span><span id=\"adubE_636\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/train.png);\" data-alternative-name=\"vehicle, transportation, carriage, public, travel\">train</span><span id=\"adubE_637\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/station.png);\" data-alternative-name=\"transportation, vehicle, public\">station</span><span id=\"adubE_638\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/train2.png);\" data-alternative-name=\"vehicle, transportation\">train2</span><span id=\"adubE_639\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bullettrain_front.png);\" data-alternative-name=\"vehicle, transportation, speed, fast, public, travel\">bullettrain_front</span><span id=\"adubE_640\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bullettrain_side.png);\" data-alternative-name=\"vehicle, transportation\">bullettrain_side</span><span id=\"adubE_641\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/light_rail.png);\" data-alternative-name=\"vehicle, transportation\">light_rail</span><span id=\"adubE_642\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/monorail.png);\" data-alternative-name=\"vehicle, transportation\">monorail</span><span id=\"adubE_643\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/railway_car.png);\" data-alternative-name=\"vehicle, transportation\">railway_car</span><span id=\"adubE_644\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/trolleybus.png);\" data-alternative-name=\"vehicle, bart, transportation\">trolleybus</span><span id=\"adubE_645\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ticket.png);\" data-alternative-name=\"event, concert, pass\">ticket</span><span id=\"adubE_646\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fuelpump.png);\" data-alternative-name=\"gas station, petroleum\">fuelpump</span><span id=\"adubE_647\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/vertical_traffic_light.png);\" data-alternative-name=\"transportation, driving\">vertical_traffic_light</span><span id=\"adubE_648\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/traffic_light.png);\" data-alternative-name=\"stoplight, transportation, signal\">traffic_light</span><span id=\"adubE_649\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/warning.png);\" data-alternative-name=\"exclamation, wip, alert, error, problem, issue\">warning</span><span id=\"adubE_650\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/construction.png);\" data-alternative-name=\"wip, progress, caution, warning\">construction</span><span id=\"adubE_651\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/beginner.png);\" data-alternative-name=\"badge, shield\">beginner</span><span id=\"adubE_652\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/atm.png);\" data-alternative-name=\"money, sales, cash, blue-square, payment, bank\">atm</span><span id=\"adubE_653\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/slot_machine.png);\" data-alternative-name=\"bet, gamble, vegas, fruit machine, luck, casino\">slot_machine</span><span id=\"adubE_654\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/busstop.png);\" data-alternative-name=\"transportation, wait\">busstop</span><span id=\"adubE_655\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/barber.png);\" data-alternative-name=\"hair, salon, style\">barber</span><span id=\"adubE_656\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hotsprings.png);\" data-alternative-name=\"bath, warm, relax\">hotsprings</span><span id=\"adubE_657\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/checkered_flag.png);\" data-alternative-name=\"contest, finishline, rase, gokart\">checkered_flag</span><span id=\"adubE_658\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/crossed_flags.png);\" data-alternative-name=\"japanese, nation, country, border\">crossed_flags</span><span id=\"adubE_659\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/izakaya_lantern.png);\" data-alternative-name=\"light, paper, halloween, spooky\">izakaya_lantern</span><span id=\"adubE_660\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/moyai.png);\" data-alternative-name=\"stone, easter island, beach, statue\">moyai</span><span id=\"adubE_661\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/circus_tent.png);\" data-alternative-name=\"festival, carnival, party\">circus_tent</span><span id=\"adubE_662\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/performing_arts.png);\" data-alternative-name=\"acting, theater, drama\">performing_arts</span><span id=\"adubE_663\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/round_pushpin.png);\" data-alternative-name=\"stationery, location, map, here\">round_pushpin</span><span id=\"adubE_664\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/triangular_flag_on_post.png);\" data-alternative-name=\"mark, milestone, place\">triangular_flag_on_post</span><span id=\"adubE_665\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/jp.png);\" data-alternative-name=\"japan, nippon, nihon, japanese, nation, flag, country, banner\">jp</span><span id=\"adubE_666\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/kr.png);\" data-alternative-name=\"korea, hanguk, nation, flag, country, banner\">kr</span><span id=\"adubE_667\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cn.png);\" data-alternative-name=\"china, prc, chinese, flag, country, nation, banner\">cn</span><span id=\"adubE_668\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/us.png);\" data-alternative-name=\"usa, america, united states, nation, flag, american, country, banner\">us</span><span id=\"adubE_669\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fr.png);\" data-alternative-name=\"france, banner, flag, nation, french, country\">fr</span><span id=\"adubE_670\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/es.png);\" data-alternative-name=\"spain, espana, flag, nation, country, banner\">es</span><span id=\"adubE_671\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/it.png);\" data-alternative-name=\"italy, italia, flag, nation, country, banner\">it</span><span id=\"adubE_672\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ru.png);\" data-alternative-name=\"russia, russian, nation, flag, country, banner\">ru</span><span id=\"adubE_673\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/gb.png);\" data-alternative-name=\"great britain, united kingdom, banner, nation, flag, british, UK, country, english, england, union jack\">gb</span><span id=\"adubE_674\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/uk.png);\" data-alternative-name=\"great britain, united kingdom\">uk</span><span id=\"adubE_675\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/de.png);\" data-alternative-name=\"germany, deutschland, german, nation, flag, country, banner\">de</span>    <h2>Symbols</h2><span id=\"adubE_676\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/one.png);\" data-alternative-name=\"1, blue-square, numbers\">one</span><span id=\"adubE_677\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/two.png);\" data-alternative-name=\"2, numbers, prime, blue-square\">two</span><span id=\"adubE_678\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/three.png);\" data-alternative-name=\"3, numbers, prime, blue-square\">three</span><span id=\"adubE_679\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/four.png);\" data-alternative-name=\"4, numbers, blue-square\">four</span><span id=\"adubE_680\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/five.png);\" data-alternative-name=\"5, numbers, blue-square, prime\">five</span><span id=\"adubE_681\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/six.png);\" data-alternative-name=\"6, numbers, blue-square\">six</span><span id=\"adubE_682\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/seven.png);\" data-alternative-name=\"7, numbers, blue-square, prime\">seven</span><span id=\"adubE_683\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/eight.png);\" data-alternative-name=\"8, blue-square, numbers\">eight</span><span id=\"adubE_684\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/nine.png);\" data-alternative-name=\"9, blue-square, numbers\">nine</span><span id=\"adubE_685\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/keycap_ten.png);\" data-alternative-name=\"10, numbers, blue-square\">keycap_ten</span><span id=\"adubE_686\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/1234.png);\" data-alternative-name=\"numbers, blue-square\">1234</span><span id=\"adubE_687\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/zero.png);\" data-alternative-name=\"0, numbers, blue-square, null\">zero</span><span id=\"adubE_688\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/hash.png);\" data-alternative-name=\"symbol, blue-square, twitter\">hash</span><span id=\"adubE_689\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/symbols.png);\" data-alternative-name=\"blue-square, music, note, ampersand, percent, glyphs, characters\">symbols</span><span id=\"adubE_690\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_backward.png);\" data-alternative-name=\"left, blue-square, direction\">arrow_backward</span><span id=\"adubE_691\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_down.png);\" data-alternative-name=\"blue-square, direction, bottom\">arrow_down</span><span id=\"adubE_692\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_forward.png);\" data-alternative-name=\"right, blue-square, direction\">arrow_forward</span><span id=\"adubE_693\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_left.png);\" data-alternative-name=\"blue-square, previous, back\">arrow_left</span><span id=\"adubE_694\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/capital_abcd.png);\" data-alternative-name=\"alphabet, words, blue-square\">capital_abcd</span><span id=\"adubE_695\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/abcd.png);\" data-alternative-name=\"blue-square, alphabet\">abcd</span><span id=\"adubE_696\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/abc.png);\" data-alternative-name=\"blue-square, alphabet\">abc</span><span id=\"adubE_697\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_lower_left.png);\" data-alternative-name=\"blue-square, direction\">arrow_lower_left</span><span id=\"adubE_698\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_lower_right.png);\" data-alternative-name=\"blue-square, direction\">arrow_lower_right</span><span id=\"adubE_699\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_right.png);\" data-alternative-name=\"blue-square, next\">arrow_right</span><span id=\"adubE_700\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_up.png);\" data-alternative-name=\"blue-square, continue, top, direction\">arrow_up</span><span id=\"adubE_701\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_upper_left.png);\" data-alternative-name=\"blue-square, point, direction\">arrow_upper_left</span><span id=\"adubE_702\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_upper_right.png);\" data-alternative-name=\"blue-square, point, direction\">arrow_upper_right</span><span id=\"adubE_703\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_double_down.png);\" data-alternative-name=\"blue-square, direction, bottom\">arrow_double_down</span><span id=\"adubE_704\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_double_up.png);\" data-alternative-name=\"blue-square, direction, top\">arrow_double_up</span><span id=\"adubE_705\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_down_small.png);\" data-alternative-name=\"blue-square, direction, bottom\">arrow_down_small</span><span id=\"adubE_706\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_heading_down.png);\" data-alternative-name=\"blue-square, direction, bottom\">arrow_heading_down</span><span id=\"adubE_707\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_heading_up.png);\" data-alternative-name=\"blue-square, direction, top\">arrow_heading_up</span><span id=\"adubE_708\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/leftwards_arrow_with_hook.png);\" data-alternative-name=\"back, return, blue-square, undo\">leftwards_arrow_with_hook</span><span id=\"adubE_709\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_right_hook.png);\" data-alternative-name=\"blue-square, return, rotade, direction\">arrow_right_hook</span><span id=\"adubE_710\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/left_right_arrow.png);\" data-alternative-name=\"shape, direction\">left_right_arrow</span><span id=\"adubE_711\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_up_down.png);\" data-alternative-name=\"blue-square, direction, way\">arrow_up_down</span><span id=\"adubE_712\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrow_up_small.png);\" data-alternative-name=\"blue-square, triangle, direction, point, forward, top\">arrow_up_small</span><span id=\"adubE_713\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrows_clockwise.png);\" data-alternative-name=\"sync, cycle, round, repeat\">arrows_clockwise</span><span id=\"adubE_714\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/arrows_counterclockwise.png);\" data-alternative-name=\"blue-square, sync, cycle\">arrows_counterclockwise</span><span id=\"adubE_715\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/rewind.png);\" data-alternative-name=\"play, blue-square\">rewind</span><span id=\"adubE_716\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/fast_forward.png);\" data-alternative-name=\"blue-square, play, speed, continue\">fast_forward</span><span id=\"adubE_717\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/information_source.png);\" data-alternative-name=\"blue-square, alphabet, letter\">information_source</span><span id=\"adubE_718\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ok.png);\" data-alternative-name=\"good, agree, yes, blue-square\">ok</span><span id=\"adubE_719\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/twisted_rightwards_arrows.png);\" data-alternative-name=\"blue-square, shuffle, music, random\">twisted_rightwards_arrows</span><span id=\"adubE_720\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/repeat.png);\" data-alternative-name=\"loop, record\">repeat</span><span id=\"adubE_721\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/repeat_one.png);\" data-alternative-name=\"blue-square, loop\">repeat_one</span><span id=\"adubE_722\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/new.png);\" data-alternative-name=\"blue-square, words, start\">new</span><span id=\"adubE_723\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/top.png);\" data-alternative-name=\"words, blue-square\">top</span><span id=\"adubE_724\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/up.png);\" data-alternative-name=\"blue-square, above, high\">up</span><span id=\"adubE_725\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cool.png);\" data-alternative-name=\"words, blue-square\">cool</span><span id=\"adubE_726\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/free.png);\" data-alternative-name=\"blue-square, words\">free</span><span id=\"adubE_727\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ng.png);\" data-alternative-name=\"blue-square, words, shape, icon\">ng</span><span id=\"adubE_728\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cinema.png);\" data-alternative-name=\"movie, blue-square, record, film\">cinema</span><span id=\"adubE_729\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/koko.png);\" data-alternative-name=\"blue-square, here, katakana, japanese, destination\">koko</span><span id=\"adubE_730\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/signal_strength.png);\" data-alternative-name=\"blue-square, reception, phone, internet, connection, wifi, bluetooth\">signal_strength</span><span id=\"adubE_731\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u5272.png);\" data-alternative-name=\"wari, cut, divide, chinese, kanji, pink-square\">u5272</span><span id=\"adubE_732\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u5408.png);\" data-alternative-name=\"japanese, chinese, join, kanji, red-square\">u5408</span><span id=\"adubE_733\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u55b6.png);\" data-alternative-name=\"ying, japanese, opening hours, orange-square\">u55b6</span><span id=\"adubE_734\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u6307.png);\" data-alternative-name=\"zhǐ, zhi, chinese, point, green-square, kanji\">u6307</span><span id=\"adubE_735\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u6708.png);\" data-alternative-name=\"yuè, yue, chinese, month, moon, japanese, orange-square, kanji\">u6708</span><span id=\"adubE_736\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u6709.png);\" data-alternative-name=\"yǒu, you, orange-square, chinese, have, kanji\">u6709</span><span id=\"adubE_737\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u6e80.png);\" data-alternative-name=\"mitsuru, full, chinese, japanese, red-square, kanji\">u6e80</span><span id=\"adubE_738\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u7121.png);\" data-alternative-name=\"wú, wu, nothing, chinese, kanji, japanese, orange-square\">u7121</span><span id=\"adubE_739\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u7533.png);\" data-alternative-name=\"shēn, shen, chinese, japanese, kanji, orange-square\">u7533</span><span id=\"adubE_740\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u7a7a.png);\" data-alternative-name=\"kōng, kong, kanji, japanese, chinese, empty, sky, blue-square\">u7a7a</span><span id=\"adubE_741\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/u7981.png);\" data-alternative-name=\"jìn, jin, kanji, japanese, chinese, forbidden, limit, restricted, red-square\">u7981</span><span id=\"adubE_742\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sa.png);\" data-alternative-name=\"japanese, blue-square, katakana\">sa</span><span id=\"adubE_743\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/restroom.png);\" data-alternative-name=\"blue-square, toilet, refresh, wc, gender\">restroom</span><span id=\"adubE_744\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mens.png);\" data-alternative-name=\"toilet, restroom, wc, blue-square, gender, male\">mens</span><span id=\"adubE_745\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/womens.png);\" data-alternative-name=\"purple-square, woman, female, toilet, loo, restroom, gender\">womens</span><span id=\"adubE_746\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/baby_symbol.png);\" data-alternative-name=\"orange-square, child\">baby_symbol</span><span id=\"adubE_747\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/no_smoking.png);\" data-alternative-name=\"cigarette, blue-square, smell, smoke\">no_smoking</span><span id=\"adubE_748\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/parking.png);\" data-alternative-name=\"cars, blue-square, alphabet, letter\">parking</span><span id=\"adubE_749\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wheelchair.png);\" data-alternative-name=\"blue-square, disabled, a11y, accessibility\">wheelchair</span><span id=\"adubE_750\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/metro.png);\" data-alternative-name=\"transportation, blue-square, mrt, underground, tube\">metro</span><span id=\"adubE_751\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/baggage_claim.png);\" data-alternative-name=\"blue-square, airport, transport\">baggage_claim</span><span id=\"adubE_752\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/accept.png);\" data-alternative-name=\"ok, good, chinese, kanji, agree, yes, orange-circle\">accept</span><span id=\"adubE_753\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wc.png);\" data-alternative-name=\"toilet, restroom, blue-square\">wc</span><span id=\"adubE_754\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/potable_water.png);\" data-alternative-name=\"blue-square, liquid, restroom, cleaning, faucet\">potable_water</span><span id=\"adubE_755\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/put_litter_in_its_place.png);\" data-alternative-name=\"blue-square, sign, human, info\">put_litter_in_its_place</span><span id=\"adubE_756\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/secret.png);\" data-alternative-name=\"privacy, chinese, sshh, kanji, red-circle\">secret</span><span id=\"adubE_757\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/congratulations.png);\" data-alternative-name=\"chinese, kanji, japanese, red-circle\">congratulations</span><span id=\"adubE_758\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/m.png);\" data-alternative-name=\"alphabet, blue-circle, letter\">m</span><span id=\"adubE_759\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/passport_control.png);\" data-alternative-name=\"custom, blue-square\">passport_control</span><span id=\"adubE_760\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/left_luggage.png);\" data-alternative-name=\"blue-square, travel\">left_luggage</span><span id=\"adubE_761\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/customs.png);\" data-alternative-name=\"passport, border, blue-square\">customs</span><span id=\"adubE_762\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ideograph_advantage.png);\" data-alternative-name=\"chinese, kanji, obtain, get, circle\">ideograph_advantage</span><span id=\"adubE_763\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cl.png);\" data-alternative-name=\"alphabet, words, red-square\">cl</span><span id=\"adubE_764\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sos.png);\" data-alternative-name=\"help, red-square, words, emergency, 911\">sos</span><span id=\"adubE_765\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/id.png);\" data-alternative-name=\"purple-square, words\">id</span><span id=\"adubE_766\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/no_entry_sign.png);\" data-alternative-name=\"forbid, stop, limit, denied, disallow, circle\">no_entry_sign</span><span id=\"adubE_767\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/underage.png);\" data-alternative-name=\"18, drink, pub, night, minor, circle\">underage</span><span id=\"adubE_768\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/no_mobile_phones.png);\" data-alternative-name=\"iphone, mute, circle\">no_mobile_phones</span><span id=\"adubE_769\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/do_not_litter.png);\" data-alternative-name=\"trash, bin, garbage, circle\">do_not_litter</span><span id=\"adubE_770\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/non-potable_water.png);\" data-alternative-name=\"drink, faucet, tap, circle\">non-potable_water</span><span id=\"adubE_771\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/no_bicycles.png);\" data-alternative-name=\"cyclist, prohibited, circle\">no_bicycles</span><span id=\"adubE_772\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/no_pedestrians.png);\" data-alternative-name=\"rules, crossing, walking, circle\">no_pedestrians</span><span id=\"adubE_773\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/children_crossing.png);\" data-alternative-name=\"school, warning, danger, sign, driving, yellow-diamond\">children_crossing</span><span id=\"adubE_774\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/no_entry.png);\" data-alternative-name=\"limit, security, privacy, bad, denied, stop, circle\">no_entry</span><span id=\"adubE_775\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/eight_spoked_asterisk.png);\" data-alternative-name=\"star, sparkle, green-square\">eight_spoked_asterisk</span><span id=\"adubE_776\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sparkle.png);\" data-alternative-name=\"stars, green-square, awesome, good, fireworks\">sparkle</span><span id=\"adubE_777\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/eight_pointed_black_star.png);\" data-alternative-name=\"orange-square, shape, polygon\">eight_pointed_black_star</span><span id=\"adubE_778\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heart_decoration.png);\" data-alternative-name=\"heart, purple-square, love, like\">heart_decoration</span><span id=\"adubE_779\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/vs.png);\" data-alternative-name=\"words, orange-square\">vs</span><span id=\"adubE_780\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/vibration_mode.png);\" data-alternative-name=\"orange-square, phone\">vibration_mode</span><span id=\"adubE_781\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/mobile_phone_off.png);\" data-alternative-name=\"mute, orange-square, silence, quiet\">mobile_phone_off</span><span id=\"adubE_782\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/chart.png);\" data-alternative-name=\"yen, green-square, graph, presentation, stats\">chart</span><span id=\"adubE_783\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/currency_exchange.png);\" data-alternative-name=\"money, sales, dollar, travel\">currency_exchange</span><span id=\"adubE_784\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/aries.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology\">aries</span><span id=\"adubE_785\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/taurus.png);\" data-alternative-name=\"zodiac, purple-square, sign, astrology\">taurus</span><span id=\"adubE_786\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/gemini.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology\">gemini</span><span id=\"adubE_787\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/cancer.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology\">cancer</span><span id=\"adubE_788\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/leo.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology\">leo</span><span id=\"adubE_789\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/virgo.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology\">virgo</span><span id=\"adubE_790\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/libra.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology\">libra</span><span id=\"adubE_791\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/scorpius.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology, scorpio\">scorpius</span><span id=\"adubE_792\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/sagittarius.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology\">sagittarius</span><span id=\"adubE_793\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/capricorn.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology\">capricorn</span><span id=\"adubE_794\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/aquarius.png);\" data-alternative-name=\"zodiac, sign, purple-square, astrology\">aquarius</span><span id=\"adubE_795\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/pisces.png);\" data-alternative-name=\"zodiac, purple-square, sign, astrology\">pisces</span><span id=\"adubE_796\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ophiuchus.png);\" data-alternative-name=\"zodiac, sign, purple-square, constellation, astrology\">ophiuchus</span><span id=\"adubE_797\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/six_pointed_star.png);\" data-alternative-name=\"purple-square, religion, jewish, hexagram\">six_pointed_star</span><span id=\"adubE_798\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/negative_squared_cross_mark.png);\" data-alternative-name=\"x, green-square, no, deny\">negative_squared_cross_mark</span><span id=\"adubE_799\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/a.png);\" data-alternative-name=\"red-square, alphabet, letter\">a</span><span id=\"adubE_800\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/b.png);\" data-alternative-name=\"red-square, alphabet, letter\">b</span><span id=\"adubE_801\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ab.png);\" data-alternative-name=\"red-square, alphabet\">ab</span><span id=\"adubE_802\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/o2.png);\" data-alternative-name=\"alphabet, red-square, letter\">o2</span><span id=\"adubE_803\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/diamond_shape_with_a_dot_inside.png);\" data-alternative-name=\"jewel, blue, gem, crystal, fancy\">diamond_shape_with_a_dot_inside</span><span id=\"adubE_804\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/recycle.png);\" data-alternative-name=\"arrow, environment, garbage, trash\">recycle</span><span id=\"adubE_805\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/end.png);\" data-alternative-name=\"words, arrow\">end</span><span id=\"adubE_806\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/back.png);\" data-alternative-name=\"arrow, words, return\">back</span><span id=\"adubE_807\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/on.png);\" data-alternative-name=\"arrow, words\">on</span><span id=\"adubE_808\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/soon.png);\" data-alternative-name=\"arrow, words\">soon</span><span id=\"adubE_809\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock1.png);\" data-alternative-name=\"time, late, early, schedule\">clock1</span><span id=\"adubE_810\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock130.png);\" data-alternative-name=\"time, late, early, schedule\">clock130</span><span id=\"adubE_811\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock10.png);\" data-alternative-name=\"time, late, early, schedule\">clock10</span><span id=\"adubE_812\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock1030.png);\" data-alternative-name=\"time, late, early, schedule\">clock1030</span><span id=\"adubE_813\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock11.png);\" data-alternative-name=\"time, late, early, schedule\">clock11</span><span id=\"adubE_814\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock1130.png);\" data-alternative-name=\"time, late, early, schedule\">clock1130</span><span id=\"adubE_815\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock12.png);\" data-alternative-name=\"midnight, noon, time, late, early, schedule\">clock12</span><span id=\"adubE_816\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock1230.png);\" data-alternative-name=\"time, late, early, schedule\">clock1230</span><span id=\"adubE_817\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock2.png);\" data-alternative-name=\"time, late, early, schedule\">clock2</span><span id=\"adubE_818\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock230.png);\" data-alternative-name=\"time, late, early, schedule\">clock230</span><span id=\"adubE_819\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock3.png);\" data-alternative-name=\"time, late, early, schedule\">clock3</span><span id=\"adubE_820\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock330.png);\" data-alternative-name=\"time, late, early, schedule\">clock330</span><span id=\"adubE_821\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock4.png);\" data-alternative-name=\"time, late, early, schedule\">clock4</span><span id=\"adubE_822\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock430.png);\" data-alternative-name=\"time, late, early, schedule\">clock430</span><span id=\"adubE_823\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock5.png);\" data-alternative-name=\"time, late, early, schedule\">clock5</span><span id=\"adubE_824\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock530.png);\" data-alternative-name=\"time, late, early, schedule\">clock530</span><span id=\"adubE_825\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock6.png);\" data-alternative-name=\"time, late, early, schedule, dawn, dusk\">clock6</span><span id=\"adubE_826\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock630.png);\" data-alternative-name=\"time, late, early, schedule\">clock630</span><span id=\"adubE_827\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock7.png);\" data-alternative-name=\"time, late, early, schedule\">clock7</span><span id=\"adubE_828\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock730.png);\" data-alternative-name=\"time, late, early, schedule\">clock730</span><span id=\"adubE_829\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock8.png);\" data-alternative-name=\"time, late, early, schedule\">clock8</span><span id=\"adubE_830\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock830.png);\" data-alternative-name=\"time, late, early, schedule\">clock830</span><span id=\"adubE_831\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock9.png);\" data-alternative-name=\"time, late, early, schedule\">clock9</span><span id=\"adubE_832\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/clock930.png);\" data-alternative-name=\"time, late, early, schedule\">clock930</span><span id=\"adubE_833\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heavy_dollar_sign.png);\" data-alternative-name=\"money, sales, payment, currency\">heavy_dollar_sign</span><span id=\"adubE_834\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/copyright.png);\" data-alternative-name=\"ip, license, circle, law, legal\">copyright</span><span id=\"adubE_835\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/registered.png);\" data-alternative-name=\"alphabet, circle\">registered</span><span id=\"adubE_836\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/tm.png);\" data-alternative-name=\"trademark, brand, law, legal\">tm</span><span id=\"adubE_837\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/x.png);\" data-alternative-name=\"no, delete, remove\">x</span><span id=\"adubE_838\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heavy_exclamation_mark.png);\" data-alternative-name=\"shocked, surprised\">heavy_exclamation_mark</span><span id=\"adubE_839\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/bangbang.png);\" data-alternative-name=\"exclamation, surprise\">bangbang</span><span id=\"adubE_840\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/interrobang.png);\" data-alternative-name=\"wat, punctuation, surprise\">interrobang</span><span id=\"adubE_841\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/o.png);\" data-alternative-name=\"circle, round\">o</span><span id=\"adubE_842\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heavy_multiplication_x.png);\" data-alternative-name=\"math, calculation\">heavy_multiplication_x</span><span id=\"adubE_843\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heavy_plus_sign.png);\" data-alternative-name=\"math, calculation, addition, more, increase\">heavy_plus_sign</span><span id=\"adubE_844\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heavy_minus_sign.png);\" data-alternative-name=\"math, calculation, subtract, less\">heavy_minus_sign</span><span id=\"adubE_845\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heavy_division_sign.png);\" data-alternative-name=\"divide, math, calculation\">heavy_division_sign</span><span id=\"adubE_846\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/white_flower.png);\" data-alternative-name=\"floral, japanese, spring\">white_flower</span><span id=\"adubE_847\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/100.png);\" data-alternative-name=\"score, perfect, numbers, century, exam, quiz, test, pass, hundred\">100</span><span id=\"adubE_848\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/heavy_check_mark.png);\" data-alternative-name=\"ok, nike\">heavy_check_mark</span><span id=\"adubE_849\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/ballot_box_with_check.png);\" data-alternative-name=\"ok, agree, confirm, black-square, vote, election\">ballot_box_with_check</span><span id=\"adubE_850\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/radio_button.png);\" data-alternative-name=\"input, old, music, circle\">radio_button</span><span id=\"adubE_851\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/link.png);\" data-alternative-name=\"rings, url\">link</span><span id=\"adubE_852\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/curly_loop.png);\" data-alternative-name=\"scribble, draw, shape, squiggle\">curly_loop</span><span id=\"adubE_853\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/wavy_dash.png);\" data-alternative-name=\"draw, line, moustache, mustache, squiggle, scribble\">wavy_dash</span><span id=\"adubE_854\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/part_alternation_mark.png);\" data-alternative-name=\"graph, presentation, stats, business, economics, bad\">part_alternation_mark</span><span id=\"adubE_855\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/trident.png);\" data-alternative-name=\"weapon, spear\">trident</span><span id=\"adubE_856\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/black_small_square.png);\" data-alternative-name=\"shape, icon\">black_small_square</span><span id=\"adubE_857\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/white_small_square.png);\" data-alternative-name=\"shape, icon\">white_small_square</span><span id=\"adubE_858\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/black_medium_small_square.png);\" data-alternative-name=\"icon, shape, button\">black_medium_small_square</span><span id=\"adubE_859\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/white_medium_small_square.png);\" data-alternative-name=\"shape, stone, icon, button\">white_medium_small_square</span><span id=\"adubE_860\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/black_medium_square.png);\" data-alternative-name=\"shape, button, icon\">black_medium_square</span><span id=\"adubE_861\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/white_medium_square.png);\" data-alternative-name=\"shape, stone, icon\">white_medium_square</span><span id=\"adubE_862\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/black_square.png);\" data-alternative-name=\"shape, icon, button\">black_large_square</span><span id=\"adubE_863\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/white_large_square.png);\" data-alternative-name=\"shape, icon, stone, button\">white_large_square</span><span id=\"adubE_864\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/white_check_mark.png);\" data-alternative-name=\"green-square, ok, agree, vote, election\">white_check_mark</span><span id=\"adubE_865\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/black_square_button.png);\" data-alternative-name=\"shape, input, frame\">black_square_button</span><span id=\"adubE_866\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/white_square_button.png);\" data-alternative-name=\"shape, input\">white_square_button</span><span id=\"adubE_867\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/black_circle.png);\" data-alternative-name=\"shape, button, round\">black_circle</span><span id=\"adubE_868\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/white_circle.png);\" data-alternative-name=\"shape, round\">white_circle</span><span id=\"adubE_869\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/red_circle.png);\" data-alternative-name=\"shape, error, danger\">red_circle</span><span id=\"adubE_870\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/large_blue_circle.png);\" data-alternative-name=\"shape, icon, button\">large_blue_circle</span><span id=\"adubE_871\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/large_blue_diamond.png);\" data-alternative-name=\"shape, jewel, gem\">large_blue_diamond</span><span id=\"adubE_872\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/large_orange_diamond.png);\" data-alternative-name=\"shape, jewel, gem\">large_orange_diamond</span><span id=\"adubE_873\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/small_blue_diamond.png);\" data-alternative-name=\"shape, jewel, gem\">small_blue_diamond</span><span id=\"adubE_874\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/small_orange_diamond.png);\" data-alternative-name=\"shape, jewel, gem\">small_orange_diamond</span><span id=\"adubE_875\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/small_red_triangle.png);\" data-alternative-name=\"shape, direction, up, top\">small_red_triangle</span><span id=\"adubE_876\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/small_red_triangle_down.png);\" data-alternative-name=\"shape, direction, bottom\">small_red_triangle_down</span><span id=\"adubE_877\" class=\"autodubmoji\" style=\"background-image:url(https://www.dubtrack.fm/assets/emoji/apple/shipit.png);\" data-alternative-name=\"squirrel, detective, animal, sherlock, inspector, custom_\">shipit</span></div></div>";
    setTimeout(function(){
      $("#chat").append(emojiPicker);
      $(".chat-text-box-icons").prepend("<span id=\"adubEmojiButton\"></span>");


      $("#autodubEmojiSearch").on("change paste keyup", function() {
              autoDub.emojis.niceSearch($("#autodubEmojiSearch").val());
      });

      $("#adubEmojis").on("click", "span", function() {
             try {
               var oldval = $("#chat-txt-message").val();
               var newval = oldval + ":"+ $(this).text().trim() + ":";
               $("#chat-txt-message").val(newval)

             } catch (s) {}
         });

  $( "#chatDTEmojis" ).mouseleave(function() {
    $("#autodubEmojiSearch").val("");
    autoDub.emojis.h();
    $("#chatDTEmojis").hide();
  });

         $("#adubEmojiButton").on("click", function() {
              $("#autodubEmojiSearch").val("");
              autoDub.emojis.h();
              $("#chatDTEmojis").toggle();
              var isvisible = $("#chatDTEmojis").is(":visible");
              if (isvisible){
                $( "#autodubEmojiSearch" ).focus();

              }

            });
    }, 4000);


    var lfmTxt = "<span id=\"lfmsetting\"><a href=\"http://www.last.fm/api/auth/?api_key=" + autoDub.lastfm.key + "&cb=" + window.location.href + "\" class=\"autodub-jllink\">Scrobble: <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDublfm\">Click to connect last.fm.</span></a></span>";
    if (autoDub.lastfm.sk) lfmTxt = "<span id=\"lfmsetting\"><a id=\"lfmsetting\" href=\"#\" onclick=\"autoDub.lfmClick()\" class=\"autodub-jllink\">Scrobble: <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDublfm\"> Connected to last.fm. Click to disconnect.</span></a></span>";
    $("#adbsettings").append("<a href=\"#\" class=\"autodub-link\"><span id=\"autoDubMode\">Vote Timer</span> <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubTimer\">voted</span></a>");
    $("#adbsettings").append(lfmTxt);
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.jlmToggle()\" class=\"autodub-jllink\">Join/Leave <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubjlm\">" + jlm + "</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.dvmToggle()\" class=\"autodub-dvlink\">Downvote Alert <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubdvm\">" + dvm + "</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.haToggle()\" class=\"autodub-qtlink\">Hide Avatars <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubha\">" + hideav + "</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.qtToggle()\" class=\"autodub-halink\">Queue+Chat <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubqt\">" + qtm + "</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.toggleDeskNotStat()\" class=\"autodub-desktopNotificationStatus\" title=\"Show a desktop notification for @ mentions\">Desktop Notifications <span style=\"float:right; color:#fff; font-weight:700;\" id=\"desktopNotificationStatus\">" + desktopNotificationStatus + "</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.noMediaToggle()\" class=\"autodub-nmlink\">No Media Streaming (refresh whenever toggling this to OFF) <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubnm\">" + nm + "</span></a>");

    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.pmpToggle()\" class=\"autodub-pmplink\" >PM+ [BETA. Refresh after toggling this. Expect bugs.]<span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubpmp\">" + pmp + "</span></a>");
    $("<style>#main_player .player_container #room-main-player-container:before{ visibility: hidden !important; }</style>").appendTo("head");
    autoDub.ui.toolTips();
    $('.autodub-link').hover(function() {
      $('<p class="tooltip" style="max-width:150px;opacity:0.7;z-index:1000000;position:absolute;padding:5px;background-color:cyan;color:#000;font-size:14px;font-weight:700;"></p>')
        .text(autoDub.toolTip)
        .appendTo('body');
    }, function() {
      $('.tooltip').remove();
    }).mousemove(function(e) {
      var mousex = e.pageX + 20;
      var mousey = e.pageY + 10;
      $('.tooltip')
        .css({
          top: mousey,
          left: mousex
        })
    });
    setTimeout(function() {
      if (Dubtrack.room.model.id == "55f82ef944809b0300f88695") {
        $(".right_section").prepend("<div id=\"discobal\" style=\"position: absolute; margin-top: -20px; font-size: 14px;\">Loading your Discocheque balance...</div>");
        autoDub.idmode.discoball.create();
        setTimeout(function() {
          autoDub.idmode.init();
          var cat = Dubtrack.helpers.cookie.get('dubtrack-disable-role-colors');
          if (!cat) {
            $("head").append("<style>.user-5660d67dd7c15a6800fa07d9 .username,.user-560164dd2e803803000fffb6 .username,.userid-5660d67dd7c15a6800fa07d9 .username, .userid-560164dd2e803803000fffb6 .username, .userid-5660d67dd7c15a6800fa07d9 .user-role, .userid-560164dd2e803803000fffb6 .user-role{color:#CB213D !important;} .user-5660d67dd7c15a6800fa07d9 .user-role, .user-560164dd2e803803000fffb6 .user-role{width:100px; background:no-repeat -3px 0 url(https://i.imgur.com/3puCdq3.png); color: rgba(0, 0, 0, 0) !important;} .userid-5660d67dd7c15a6800fa07d9 .user-role, .userid-560164dd2e803803000fffb6 .user-role{width:100px; background: no-repeat -2px url(https://i.imgur.com/7eTBSTh.png); color: rgba(0, 0, 0, 0) !important;}</style>");
          } else if (cat == "false") {
            $("head").append("<style>.user-5660d67dd7c15a6800fa07d9 .username,.user-560164dd2e803803000fffb6 .username,.userid-5660d67dd7c15a6800fa07d9 .username, .userid-560164dd2e803803000fffb6 .username, .userid-5660d67dd7c15a6800fa07d9 .user-role, .userid-560164dd2e803803000fffb6 .user-role{color:#CB213D !important;} .user-5660d67dd7c15a6800fa07d9 .user-role, .user-560164dd2e803803000fffb6 .user-role{width:100px; background:no-repeat -3px 0 url(https://i.imgur.com/3puCdq3.png); color: rgba(0, 0, 0, 0) !important;} .userid-5660d67dd7c15a6800fa07d9 .user-role, .userid-560164dd2e803803000fffb6 .user-role{width:100px; background: no-repeat -2px url(https://i.imgur.com/7eTBSTh.png); color: rgba(0, 0, 0, 0) !important;}</style>");
          }
        }, 1000);
          autoDub.nmImage = "https://thompsn.com/autodub/idlogo.svg";
      }
      if (nm1) {
        setTimeout(function() {
          soundManager.stopAll();

          $("#room-main-player-container").remove();
          soundManager = null;
          $(".loading").remove();
          $(".player_container").append("<div style=\"text-align: center; position: absolute; height: 100%; width: 100%;\" id=\"autoooooDub\"><img src=\""+ autoDub.nmImage +"\" style=\"height:95% \"/></div>");
        }, 5000);
      }
        }, 2000);
    $("#chat-txt-message").attr('maxlength', 140);
  },
  toolTips: function() {
    autoDub.toolTip = 'AutoDub is in timer mode. This autovotes at a random time during each song.';
    if ($(".tooltip").text()) $(".tooltip").text(autoDub.toolTip);
  },
  pmMenu: function() {
    var status = $("#usrbottom").css("display");
    if (status == "none") {
      $.ajax({
        dataType: "json",
        type: "GET",
        url: "https://api.dubtrack.fm/room/" + Dubtrack.room.model.id + "/users",
        success: function(formatted) {
          for (var i = 0; i < formatted.data.length; i++) {
            var id = formatted.data[i]._user._id;
            var name = formatted.data[i]._user.username;
            $('#usrsneak').prepend('<li onclick="autoDub.makeConvo(\'' + id + '\',\'' + name + '\')" id="yoits' + id + '">' + name + '</li>');
          }
        }
      });
      $("#snklist").text("-");
      $("#usrbottom").css("display", "block");
      $("#sneakyPMList").css("width", "200px");
    } else {
      $("#usrbottom").css("display", "none");
      $('#usrsneak').text("");
      $("#snklist").text("+");
      $("#sneakyPMList").css("width", "100px");
    }
  }
};


autoDub.lfmClick = function() {
  console.log("lastfm session DESTROYED.");
  autoDub.lastfm.sk = false;
  localStorage["adLastfmSession"] = autoDub.lastfm.sk;
  $("#lfmsetting").html("<span id=\"lfmsetting\"><a href=\"http://www.last.fm/api/auth/?api_key=" + autoDub.lastfm.key + "&cb=" + window.location.href + "\" class=\"autodub-jllink\">Scrobble: <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDublfm\">Click to connect last.fm.</span></a></span>");
};

autoDub.jlmToggle = function() {
  var label = "off";
  if (autoDub.joinLeaves) {
    autoDub.joinLeaves = false;
  } else {
    label = "on";
    autoDub.joinLeaves = true;
  }
  autoDub.storage.save();
  $("#autoDubjlm").text(label);
};

autoDub.noMediaToggle = function() {
  var label = "off";
  if (autoDub.nm) {
    autoDub.nm = false;
    label = "refresh now!"
  } else {
    label = "on";
    autoDub.nm = true;
    soundManager.stopAll();
    $("#room-main-player-container").remove();
    soundManager = null;
    $(".loading").remove();
    $(".player_container").append("<div style=\"text-align: center; position: absolute; height: 100%; width: 100%;\" id=\"autoooooDub\"><img src=\""+ autoDub.nmImage +"\" style=\"height:95% \"/></div>");
  }
  autoDub.storage.save();
  $("#autoDubnm").text(label);
};

autoDub.pmpToggle = function() {
  var label = "off";
  if (autoDub.pmPlus) {
    autoDub.pmPlus = false;
  } else {
    label = "on";
    autoDub.pmPlus = true;
  }
  autoDub.storage.save();
  $("#autoDubpmp").text(label);
};

autoDub.toggleDeskNotStat = function() {
  var label = 'off';
  if (autoDub.desktopNotifications) {
    autoDub.desktopNotifications = false;
    label = 'off';
  } else {
    label = 'on';
    autoDub.desktopNotifications = true;
  }
  autoDub.storage.save();
  $("#desktopNotificationStatus").text(label);
}

autoDub.emojis = {
  h: function() {
          $(".autodubmoji").show();
          $("#adubEmojis h2").show();
      },
  n: function (p, q) {
          var e = p.attr("data-alternative-name");
          return ($(p).text().toLowerCase().indexOf(q) >= 0) || (e != null && e.toLowerCase().indexOf(q) >= 0)
      },
  niceSearch: function (val){
    if (val.length == 0) {
              autoDub.emojis.h();
              return
          } else {
             var isvisible = $("#adubEmojis h2").is(":visible");
             if (isvisible) $("#adubEmojis h2").hide();
          }
          val = val.toLowerCase();
          $(".autodubmoji").each(function(p, q) {
              if (autoDub.emojis.n($(q), val)) {
                  $(q).show()
              } else {
                  $(q).hide()
              }
          })
  }
}

autoDub.dvmToggle = function() {
  var label = "off";
  if (autoDub.dvm) {
    autoDub.dvm = false;
  } else {
    label = "on";
    autoDub.dvm = true;
  }
  autoDub.storage.save();
  $("#autoDubdvm").text(label);
};

autoDub.qtToggle = function() {
  var label = "off";
  if (autoDub.queueThanks) {
    autoDub.queueThanks = false;
    $("#browser").css("width", "100%");
    $("#browser").css("margin-bottom", "0px");
  } else {
    label = "on";
    autoDub.queueThanks = true;
    $('#browser').one("DOMSubtreeModified", function() {
      $(window).unbind('click.browser');
      $("#browser").css("width", "50%");
    });
  }
  autoDub.storage.save();
  $("#autoDubqt").text(label);
};

autoDub.haToggle = function() {
  var label = "off";
  if (autoDub.hideAvatars) {
    autoDub.hideAvatars = false;
    $("#hideAvatars").remove();
  } else {
    label = "on";
    autoDub.hideAvatars = true;
    $("head").append("<style id='hideAvatars'>.image_row{display:none;} .activity-row{padding-left: 0 !important;} li.imgEl{ display: none !important;} li.infoContainer{padding:0 !important;}}</style>");
  }
  autoDub.storage.save();
  $("#autoDubha").text(label);
};

autoDub.etToggle = function() {
  var label = "off";
  if (autoDub.eveTalk) {
    autoDub.eveTalk = false;
  } else {
    label = "on";
    autoDub.eveTalk = true;
  }
  autoDub.storage.save();
  $("#autoDubet").text(label);
};


autoDub.altDToggle = function() {
  var label = "off";
  if (autoDub.altDancers) {
    autoDub.altDancers = false;
    $(".dncr").css("width", "59px");
    $(".dncr").css("background-image", "url(https://i.imgur.com/IieFNhZ.gif)");

  } else {
    label = "on";
    autoDub.altDancers = true;
    $(".dncr").css("width", "88px");
    $(".dncr").css("background-image", "url(https://i.imgur.com/aeOoQTZ.gif)");
  }
  autoDub.storage.save();
  $("#autoDubaltd").text(label);
};

autoDub.ducksToggle = function() {
  var label = "off";
  if (autoDub.shootDucks) {
    autoDub.shootDucks = false;
  } else {
    label = "on";
    autoDub.shootDucks = true;
  }
  autoDub.storage.save();
  $("#autoDubducks").text(label);
};

autoDub.discoballdancersToggle = function() {
  var label = "off";
  if (autoDub.discoballDancers) {
    autoDub.discoballDancers = false;
    document.getElementById('discoball').style.display = 'none';
    document.getElementById('dancers').style.height = '0';
  } else {
    label = "on";
    autoDub.discoballDancers = true;
    document.getElementById('discoball').style.display = 'block';
    document.getElementById('dancers').style.height = '130px';
  }
  autoDub.storage.save();
  $("#autoDubdiscoballdancers").text(label);
};

autoDub.newVote = function(data) {
  var username = $(".user-info").first().text();
  if (data.user.username == username) {
    //cancel the upvote if user voted
    if (autoDub.songtimer != null) {
      clearTimeout(autoDub.songtimer);
      autoDub.songtimer = null;
      $("#autoDubTimer").countdown("destroy");
      $("#autoDubTimer").text("voted");
      console.log("autovote off until next song.");
    }
  }
  if (data.dubtype == "downdub") {
    if (autoDub.dvm) autoDub.chatSpam.dv(data.user.username);
  }
};

autoDub.storage = {
  save: function() {
    var save_file = {
      mode: autoDub.mode,
      autoVote: autoDub.autoVote,
      joinLeaves: autoDub.joinLeaves,
      altDancers: autoDub.altDancers,
      eveTalk: autoDub.eveTalk,
      queueThanks: autoDub.queueThanks,
      hideAvatars: autoDub.hideAvatars,
      lastLoaded: autoDub.lastLoaded,
      nm: autoDub.nm,
      dvm: autoDub.dvm,
      pmPlus: autoDub.pmPlus,
      desktopNotifications: autoDub.desktopNotifications,
      shootDucks: autoDub.shootDucks,
      discoballDancers: autoDub.discoballDancers,
    };
    var preferences = JSON.stringify(save_file);
    localStorage["autoDub"] = preferences;
    if (autoDub.lastfm.sk) localStorage["adLastfmSession"] = autoDub.lastfm.sk;
  },
  restore: function() {
    var favorite = localStorage["autoDub"];
    if (!favorite) {
      autoDub.ui.init();
      autoDub.storage.save();
      return;
    }
    console.log("autodub settings found.");
    var preferences = JSON.parse(favorite);
    $.extend(autoDub, preferences);
    var jl = false;
    var qt = true;
    var pm = false;
    var ha = false;
    var dv = true;
    var nm = false;
    if (typeof preferences.pmPlus != "undefined") pm = preferences.pmPlus;
    if (typeof preferences.hideAvatars != "undefined") ha = preferences.hideAvatars;
    if (typeof preferences.dvm != "undefined") dv = preferences.dvm;
    if (typeof preferences.queueThanks != "undefined") qt = preferences.queueThanks;
    if (typeof preferences.joinLeaves != "undefined") jl = preferences.joinLeaves;
    if (typeof preferences.nm != "undefined") nm = preferences.nm;
    var thingo = localStorage["adLastfmSession"];
    if (thingo == "false") thingo = false;
    if (thingo) autoDub.lastfm.sk = thingo;
    autoDub.ui.init(preferences.mode, jl, dv, qt, pm, ha, nm);


  }
};

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";

function rhex(num) {
  str = "";
  for (j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
    hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str) {
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for (i = 0; i < nblk * 16; i++) blks[i] = 0;
  for (i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t) {
  return add(rol(add(add(a, q), add(x, t)), s), b);
}

function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str) {
  x = str2blks_MD5(str);
  a = 1732584193;
  b = -271733879;
  c = -1732584194;
  d = 271733878;

  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}

var serialize = function(obj, prefix) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push(typeof v == "object" ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}
autoDub.init();
if ("undefined" != typeof responsiveVoice) console.log("ResponsiveVoice already loaded"), console.log(responsiveVoice);
else var ResponsiveVoice = function() {
    var e = this;
    e.version = 3, console.log("ResponsiveVoice r" + e.version);
    var a = [{
        name: "UK English Female",
        voiceIDs: [3, 5, 1, 6, 7, 8]
      }, {
        name: "UK English Male",
        voiceIDs: [0, 4, 2, 6, 7, 8]
      }, {
        name: "US English Female",
        voiceIDs: [39, 40, 41, 42, 43, 44]
      }, {
        name: "Spanish Female",
        voiceIDs: [19, 16, 17, 18, 20, 15]
      }, {
        name: "French Female",
        voiceIDs: [21, 22, 23, 26]
      }, {
        name: "Deutsch Female",
        voiceIDs: [27, 28, 29, 30, 31, 32]
      }, {
        name: "Italian Female",
        voiceIDs: [33, 34, 35, 36, 37, 38]
      }, {
        name: "Greek Female",
        voiceIDs: [62, 63, 64]
      }, {
        name: "Hungarian Female",
        voiceIDs: [9, 10, 11]
      }, {
        name: "Russian Female",
        voiceIDs: [47, 48, 49]
      }, {
        name: "Dutch Female",
        voiceIDs: [45]
      }, {
        name: "Swedish Female",
        voiceIDs: [65]
      }, {
        name: "Japanese Female",
        voiceIDs: [50, 51, 52, 53]
      }, {
        name: "Korean Female",
        voiceIDs: [54, 55, 56, 57]
      }, {
        name: "Chinese Female",
        voiceIDs: [58, 59, 60, 61]
      }, {
        name: "Hindi Female",
        voiceIDs: [66, 67]
      }, {
        name: "Serbian Male",
        voiceIDs: [12]
      }, {
        name: "Croatian Male",
        voiceIDs: [13]
      }, {
        name: "Bosnian Male",
        voiceIDs: [14]
      }, {
        name: "Romanian Male",
        voiceIDs: [46]
      }, {
        name: "Fallback UK Female",
        voiceIDs: [8]
      }],
      n = [{
        name: "Google UK English Male"
      }, {
        name: "Agnes"
      }, {
        name: "Daniel Compact"
      }, {
        name: "Google UK English Female"
      }, {
        name: "en-GB",
        rate: .25,
        pitch: 1
      }, {
        name: "en-AU",
        rate: .25,
        pitch: 1
      }, {
        name: "inglés Reino Unido"
      }, {
        name: "English United Kingdom"
      }, {
        name: "Fallback en-GB Female",
        lang: "en-GB",
        fallbackvoice: !0
      }, {
        name: "Eszter Compact"
      }, {
        name: "hu-HU",
        rate: .4
      }, {
        name: "Fallback Hungarian",
        lang: "hu",
        fallbackvoice: !0
      }, {
        name: "Fallback Serbian",
        lang: "sr",
        fallbackvoice: !0
      }, {
        name: "Fallback Croatian",
        lang: "hr",
        fallbackvoice: !0
      }, {
        name: "Fallback Bosnian",
        lang: "bs",
        fallbackvoice: !0
      }, {
        name: "Fallback Spanish",
        lang: "es",
        fallbackvoice: !0
      }, {
        name: "Spanish Spain"
      }, {
        name: "español España"
      }, {
        name: "Diego Compact",
        rate: .3
      }, {
        name: "Google Español"
      }, {
        name: "es-ES",
        rate: .2
      }, {
        name: "Google Français"
      }, {
        name: "French France"
      }, {
        name: "francés Francia"
      }, {
        name: "Virginie Compact",
        rate: .5
      }, {
        name: "fr-FR",
        rate: .25
      }, {
        name: "Fallback French",
        lang: "fr",
        fallbackvoice: !0
      }, {
        name: "Google Deutsch"
      }, {
        name: "German Germany"
      }, {
        name: "alemán Alemania"
      }, {
        name: "Yannick Compact",
        rate: .5
      }, {
        name: "de-DE",
        rate: .25
      }, {
        name: "Fallback Deutsch",
        lang: "de",
        fallbackvoice: !0
      }, {
        name: "Google Italiano"
      }, {
        name: "Italian Italy"
      }, {
        name: "italiano Italia"
      }, {
        name: "Paolo Compact",
        rate: .5
      }, {
        name: "it-IT",
        rate: .25
      }, {
        name: "Fallback Italian",
        lang: "it",
        fallbackvoice: !0
      }, {
        name: "Google US English",
        timerSpeed: 1
      }, {
        name: "English United States"
      }, {
        name: "inglés Estados Unidos"
      }, {
        name: "Vicki"
      }, {
        name: "en-US",
        rate: .2,
        pitch: 1,
        timerSpeed: 1.3
      }, {
        name: "Fallback English",
        lang: "en-US",
        fallbackvoice: !0,
        timerSpeed: 0
      }, {
        name: "Fallback Dutch",
        lang: "nl",
        fallbackvoice: !0,
        timerSpeed: 0
      }, {
        name: "Fallback Romanian",
        lang: "ro",
        fallbackvoice: !0
      }, {
        name: "Milena Compact"
      }, {
        name: "ru-RU",
        rate: .25
      }, {
        name: "Fallback Russian",
        lang: "ru",
        fallbackvoice: !0
      }, {
        name: "Google 日本人",
        timerSpeed: 1
      }, {
        name: "Kyoko Compact"
      }, {
        name: "ja-JP",
        rate: .25
      }, {
        name: "Fallback Japanese",
        lang: "ja",
        fallbackvoice: !0
      }, {
        name: "Google 한국의",
        timerSpeed: 1
      }, {
        name: "Narae Compact"
      }, {
        name: "ko-KR",
        rate: .25
      }, {
        name: "Fallback Korean",
        lang: "ko",
        fallbackvoice: !0
      }, {
        name: "Google 中国的",
        timerSpeed: 1
      }, {
        name: "Ting-Ting Compact"
      }, {
        name: "zh-CN",
        rate: .25
      }, {
        name: "Fallback Chinese",
        lang: "zh-CN",
        fallbackvoice: !0
      }, {
        name: "Alexandros Compact"
      }, {
        name: "el-GR",
        rate: .25
      }, {
        name: "Fallback Greek",
        lang: "el",
        fallbackvoice: !0
      }, {
        name: "Fallback Swedish",
        lang: "sv",
        fallbackvoice: !0
      }, {
        name: "hi-IN",
        rate: .25
      }, {
        name: "Fallback Hindi",
        lang: "hi",
        fallbackvoice: !0
      }];
    e.iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    var l, o = [{
        name: "he-IL",
        voiceURI: "he-IL",
        lang: "he-IL"
      }, {
        name: "th-TH",
        voiceURI: "th-TH",
        lang: "th-TH"
      }, {
        name: "pt-BR",
        voiceURI: "pt-BR",
        lang: "pt-BR"
      }, {
        name: "sk-SK",
        voiceURI: "sk-SK",
        lang: "sk-SK"
      }, {
        name: "fr-CA",
        voiceURI: "fr-CA",
        lang: "fr-CA"
      }, {
        name: "ro-RO",
        voiceURI: "ro-RO",
        lang: "ro-RO"
      }, {
        name: "no-NO",
        voiceURI: "no-NO",
        lang: "no-NO"
      }, {
        name: "fi-FI",
        voiceURI: "fi-FI",
        lang: "fi-FI"
      }, {
        name: "pl-PL",
        voiceURI: "pl-PL",
        lang: "pl-PL"
      }, {
        name: "de-DE",
        voiceURI: "de-DE",
        lang: "de-DE"
      }, {
        name: "nl-NL",
        voiceURI: "nl-NL",
        lang: "nl-NL"
      }, {
        name: "id-ID",
        voiceURI: "id-ID",
        lang: "id-ID"
      }, {
        name: "tr-TR",
        voiceURI: "tr-TR",
        lang: "tr-TR"
      }, {
        name: "it-IT",
        voiceURI: "it-IT",
        lang: "it-IT"
      }, {
        name: "pt-PT",
        voiceURI: "pt-PT",
        lang: "pt-PT"
      }, {
        name: "fr-FR",
        voiceURI: "fr-FR",
        lang: "fr-FR"
      }, {
        name: "ru-RU",
        voiceURI: "ru-RU",
        lang: "ru-RU"
      }, {
        name: "es-MX",
        voiceURI: "es-MX",
        lang: "es-MX"
      }, {
        name: "zh-HK",
        voiceURI: "zh-HK",
        lang: "zh-HK"
      }, {
        name: "sv-SE",
        voiceURI: "sv-SE",
        lang: "sv-SE"
      }, {
        name: "hu-HU",
        voiceURI: "hu-HU",
        lang: "hu-HU"
      }, {
        name: "zh-TW",
        voiceURI: "zh-TW",
        lang: "zh-TW"
      }, {
        name: "es-ES",
        voiceURI: "es-ES",
        lang: "es-ES"
      }, {
        name: "zh-CN",
        voiceURI: "zh-CN",
        lang: "zh-CN"
      }, {
        name: "nl-BE",
        voiceURI: "nl-BE",
        lang: "nl-BE"
      }, {
        name: "en-GB",
        voiceURI: "en-GB",
        lang: "en-GB"
      }, {
        name: "ar-SA",
        voiceURI: "ar-SA",
        lang: "ar-SA"
      }, {
        name: "ko-KR",
        voiceURI: "ko-KR",
        lang: "ko-KR"
      }, {
        name: "cs-CZ",
        voiceURI: "cs-CZ",
        lang: "cs-CZ"
      }, {
        name: "en-ZA",
        voiceURI: "en-ZA",
        lang: "en-ZA"
      }, {
        name: "en-AU",
        voiceURI: "en-AU",
        lang: "en-AU"
      }, {
        name: "da-DK",
        voiceURI: "da-DK",
        lang: "da-DK"
      }, {
        name: "en-US",
        voiceURI: "en-US",
        lang: "en-US"
      }, {
        name: "en-IE",
        voiceURI: "en-IE",
        lang: "en-IE"
      }, {
        name: "hi-IN",
        voiceURI: "hi-IN",
        lang: "hi-IN"
      }, {
        name: "el-GR",
        voiceURI: "el-GR",
        lang: "el-GR"
      }, {
        name: "ja-JP",
        voiceURI: "ja-JP",
        lang: "ja-JP"
      }],
      c = 100,
      i = 5,
      t = 0,
      s = !1,
      r = 140;
    e.fallback_playing = !1, e.fallback_parts = null, e.fallback_part_index = 0, e.fallback_audio = null, e.msgparameters = null, e.timeoutId = null, e.OnLoad_callbacks = [], "undefined" != typeof speechSynthesis && (speechSynthesis.onvoiceschanged = function() {
      l = window.speechSynthesis.getVoices(), null != e.OnVoiceReady && e.OnVoiceReady.call()
    }), e.default_rv = a[0], e.OnVoiceReady = null, e.init = function() {
      "undefined" == typeof speechSynthesis ? (console.log("RV: Voice synthesis not supported"), e.enableFallbackMode()) : setTimeout(function() {
        var a = setInterval(function() {
          var n = window.speechSynthesis.getVoices();
          0 != n.length || null != l && 0 != l.length ? (console.log("RV: Voice support ready"), e.systemVoicesReady(n), clearInterval(a)) : (t++, t > i && (clearInterval(a), null != window.speechSynthesis ? e.iOS ? (console.log("RV: Voice support ready (cached)"), e.systemVoicesReady(o)) : (console.log("RV: speechSynthesis present but no system voices found"), e.enableFallbackMode()) : e.enableFallbackMode()))
        }, 100)
      }, 100), e.Dispatch("OnLoad")
    }, e.systemVoicesReady = function(a) {
      l = a, e.mapRVs(), null != e.OnVoiceReady && e.OnVoiceReady.call()
    }, e.enableFallbackMode = function() {
      s = !0, console.log("RV: Enabling fallback mode"), e.mapRVs(), null != e.OnVoiceReady && e.OnVoiceReady.call()
    }, e.getVoices = function() {
      for (var e = [], n = 0; n < a.length; n++) e.push({
        name: a[n].name
      });
      return e
    }, e.speak = function(a, n, l) {
      e.msgparameters = l || {}, e.msgtext = a, e.msgvoicename = n;
      var o = [];
      if (a.length > c) {
        for (var i = a; i.length > c;) {
          var t = i.search(/[:!?.;]+/),
            r = "";
          if ((-1 == t || t >= c) && (t = i.search(/[,]+/)), -1 == t || t >= c)
            for (var m = i.split(" "), v = 0; v < m.length && !(r.length + m[v].length + 1 > c); v++) r += (0 != v ? " " : "") + m[v];
          else r = i.substr(0, t + 1);
          i = i.substr(r.length, i.length - r.length), o.push(r)
        }
        i.length > 0 && o.push(i)
      } else o.push(a);
      var g;
      g = null == n ? e.default_rv : e.getResponsiveVoice(n);
      var d = {};
      if (null != g.mappedProfile) d = g.mappedProfile;
      else if (d.systemvoice = e.getMatchedVoice(g), d.collectionvoice = {}, null == d.systemvoice) return void console.log("RV: ERROR: No voice found for: " + n);
      1 == d.collectionvoice.fallbackvoice ? (s = !0, e.fallback_parts = []) : s = !1, e.msgprofile = d;
      for (var v = 0; v < o.length; v++)
        if (s) {
          var u = "https://responsivevoice.org/responsivevoice/getvoice.php?t=" + o[v] + "&tl=" + d.collectionvoice.lang || d.systemvoice.lang || "en-US",
            p = document.createElement("AUDIO");
          p.src = u, p.playbackRate = 1, p.preload = "auto", p.volume = d.collectionvoice.volume || d.systemvoice.volume || 1, e.fallback_parts.push(p)
        } else {
          var h = new SpeechSynthesisUtterance;
          h.voice = d.systemvoice, h.voiceURI = d.systemvoice.voiceURI, h.volume = d.collectionvoice.volume || d.systemvoice.volume || 1, h.rate = d.collectionvoice.rate || d.systemvoice.rate || 1, h.pitch = d.collectionvoice.pitch || d.systemvoice.pitch || 1, h.text = o[v], h.lang = d.collectionvoice.lang || d.systemvoice.lang, h.rvIndex = v, h.rvTotal = o.length, 0 == v && (h.onstart = e.speech_onstart), e.msgparameters.onendcalled = !1, null != l ? (v < o.length - 1 && o.length > 1 ? (h.onend = l.onchunkend, h.addEventListener("end", l.onchuckend)) : (h.onend = e.speech_onend, h.addEventListener("end", e.speech_onend)), h.onerror = l.onerror || function(e) {
            console.log("RV: Error"), console.log(e)
          }, h.onpause = l.onpause, h.onresume = l.onresume, h.onmark = l.onmark, h.onboundary = l.onboundary) : (h.onend = e.speech_onend, h.onerror = function(e) {
            console.log("RV: Error"), console.log(e)
          }), speechSynthesis.speak(h)
        }
      s && (e.fallback_part_index = 0, e.fallback_startPart())
    }, e.startTimeout = function(a, n) {
      var l = e.msgprofile.collectionvoice.timerSpeed;
      null == e.msgprofile.collectionvoice.timerSpeed && (l = 1), 0 >= l || (e.timeoutId = setTimeout(n, 1e3 * l * (60 / r) * a.split(/\s+/).length))
    }, e.checkAndCancelTimeout = function() {
      null != e.timeoutId && (clearTimeout(e.timeoutId), e.timeoutId = null)
    }, e.speech_timedout = function() {
      e.cancel(), e.speech_onend()
    }, e.speech_onend = function() {
      return e.checkAndCancelTimeout(), e.cancelled === !0 ? void(e.cancelled = !1) : void(null != e.msgparameters && null != e.msgparameters.onend && 1 != e.msgparameters.onendcalled && (e.msgparameters.onendcalled = !0, e.msgparameters.onend()))
    }, e.speech_onstart = function() {
      e.iOS && e.startTimeout(e.msgtext, e.speech_timedout), e.msgparameters.onendcalled = !1, null != e.msgparameters && null != e.msgparameters.onstart && e.msgparameters.onstart()
    }, e.fallback_startPart = function() {
      0 == e.fallback_part_index && e.speech_onstart(), e.fallback_audio = e.fallback_parts[e.fallback_part_index], null == e.fallback_audio ? console.log("RV: Fallback Audio is not available") : (e.fallback_audio.play(), e.fallback_audio.addEventListener("ended", e.fallback_finishPart))
    }, e.fallback_finishPart = function(a) {
      e.checkAndCancelTimeout(), e.fallback_part_index < e.fallback_parts.length - 1 ? (e.fallback_part_index++, e.fallback_startPart()) : e.speech_onend()
    }, e.cancel = function() {
      e.checkAndCancelTimeout(), s ? null != e.fallback_audio && e.fallback_audio.pause() : (e.cancelled = !0, speechSynthesis.cancel())
    }, e.voiceSupport = function() {
      return "speechSynthesis" in window
    }, e.OnFinishedPlaying = function(a) {
      null != e.msgparameters && null != e.msgparameters.onend && e.msgparameters.onend()
    }, e.setDefaultVoice = function(a) {
      var n = e.getResponsiveVoice(a);
      null != n && (e.default_vr = n)
    }, e.mapRVs = function() {
      for (var l = 0; l < a.length; l++)
        for (var o = a[l], c = 0; c < o.voiceIDs.length; c++) {
          var i = n[o.voiceIDs[c]];
          if (1 == i.fallbackvoice) {
            o.mappedProfile = {
              systemvoice: {},
              collectionvoice: i
            };
            break
          }
          var t = e.getSystemVoice(i.name);
          if (null != t) {
            o.mappedProfile = {
              systemvoice: t,
              collectionvoice: i
            };
            break
          }
        }
    }, e.getMatchedVoice = function(a) {
      for (var l = 0; l < a.voiceIDs.length; l++) {
        var o = e.getSystemVoice(n[a.voiceIDs[l]].name);
        if (null != o) return o
      }
      return null
    }, e.getSystemVoice = function(e) {
      if ("undefined" == typeof l) return null;
      for (var a = 0; a < l.length; a++)
        if (l[a].name == e) return l[a];
      return null
    }, e.getResponsiveVoice = function(e) {
      for (var n = 0; n < a.length; n++)
        if (a[n].name == e) return a[n];
      return null
    }, e.Dispatch = function(a) {
      if (e.hasOwnProperty(a + "_callbacks") && e[a + "_callbacks"].length > 0)
        for (var n = e[a + "_callbacks"], l = 0; l < n.length; l++) n[l]()
    }, e.AddEventListener = function(a, n) {
      e.hasOwnProperty(a + "_callbacks") ? e[a + "_callbacks"].push(n) : console.log("RV: Event listener not found: " + a)
    }, "undefined" == typeof $ ? document.addEventListener("DOMContentLoaded", function() {
      e.init()
    }) : $(document).ready(function() {
      e.init()
    })
  },
  responsiveVoice = new ResponsiveVoice;
