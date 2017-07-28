var autoDub = {
  started: false,
  mode: "classic",
  version: "00.48.2",
  whatsNew: "Built in last.fm scrobbling is here. Connect your last.fm account in autoDub settings.",
  firstMessage: "Hey there! AutoDub upvotes at a random time during the song. There's a countdown timer hidden in the 'AUTODUB' tab above the video box.",
  lastLoaded: null,
  roomCheck: null,
  altDancers: false,
  songtimer: null,
  eveTalk: false,
  songInfo: {},
  queueThanks: true,
  pmPlus: false,
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
  $("<style>.sneakyMsg a {color: #00f;}.adbsettings a{display: block;padding: 8px 0;padding: .5rem 0;border-bottom: 1px solid #878c8e;color:#878c8e;zoom: 1;}</style>").appendTo("head");
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
    $("#newtagbox").bind("keyup", function() {
      if (event.which == 13) {
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
    $.getScript("https://cdn.firebase.com/js/client/1.1.0/firebase.js", autoDub.idmode.initFirebase);
  },
  initFirebase: function() {
    autoDub.idmode.fb = new Firebase("https://discocheques.firebaseio.com");
    autoDub.idmode.theBank = autoDub.idmode.fb.child("bank/" + autoDub.idmode.userid);
    autoDub.idmode.theRoomShit = autoDub.idmode.fb.child("roomshit");
    autoDub.idmode.shirt = autoDub.idmode.fb.child("shirt");
    autoDub.idmode.ballChange = autoDub.idmode.fb.child("ballchange");
    autoDub.idmode.danChange = autoDub.idmode.fb.child("danchange");
    autoDub.idmode.eveWords = autoDub.idmode.fb.child("evetalk");
    autoDub.idmode.onWordChange = autoDub.idmode.eveWords.on("value", function(snapshot) {
      autoDub.idmode.eveTalkr(snapshot);
    });
    autoDub.idmode.onShirt = autoDub.idmode.shirt.on("value", function(snapshot) {
      autoDub.idmode.shirtChange(snapshot);
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
    $(".currentSong").html("<input type=\"text\" style=\"margin-top:-10px; font-style:normal; padding:0; font-weight:700;\" value=\"" + firstVal + "\" id=\"newtagbox\">");
    $("#newtagbox").bind("keyup", function() {
      if (event.which == 13) {
        var newtag = $("#newtagbox").val();
        Dubtrack.room.chat._messageInputEl.val("!fixtags " + newtag);
        Dubtrack.room.chat.sendMessage();
      }
    });
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
  init: function(mode, jl, dv, qt, pm, ha) {
    if (pm) {
      $('html').append('<style>.psons{white-space:nowrap; overflow-x:hidden; width:150px; display: inline-block;} #usrsneak li{border-bottom:1px solid #eee; cursor: pointer; padding:4px;}#usrbottom{background-color:#fff; display:none;height:400px;overflow-y:scroll; overflow-x:hidden;}#usrtop{padding: 7px;-webkit-border-top-left-radius: .3rem; -webkit-border-top-right-radius: .3rem; -moz-border-radius-topleft: .3rem; -moz-border-radius-topright: .3rem; border-top-left-radius: .3rem; border-top-right-radius: .3rem;background-color: rgba(0,0,0,.8);color: #fff;}#sneakyPMList{vertical-align: bottom;display: inline-block; width: 100px; margin-left: 10px;}.sneakyClose{cursor:pointer;float:right;}#Scontainer{font-family:helvetica, arial, san-serif;font-size:12px;background-color:#000; background-color:#fff; max-width:900px; margin-left:auto; margin-right:auto; min-height:100%;}.sneakyTop{-webkit-border-top-left-radius: .3rem; -webkit-border-top-right-radius: .3rem; -moz-border-radius-topleft: .3rem; -moz-border-radius-topright: .3rem; border-top-left-radius: .3rem; border-top-right-radius: .3rem;padding:7px;background-color:rgba(0,0,0,.8);color:#fff}div#sneakyPM{z-index:9000;position:fixed;bottom:56px;font: 1rem/1.5 Open Sans,sans-serif; font-size:13px;}.sneakyPMWindow{display:inline-block; width:200px;margin-left:10px;} .sneakypmPut{font: 1rem/1.5 Open Sans,sans-serif; font-size:13px;width:100%;border-top:1px solid #ccc;background-color:#fff;color:#000!important}.sneakyMsg{padding:5px;} .sneakyMsg:nth-child(even) { background-color: #eee; }.sneakyPmtxt{background-color:#fff;height:200px;overflow-y:scroll; overflow-x:hidden;} </style><div id="sneakyPM"><div id="sneakyPMList"><div id="usrtop">Send a PM <div onclick="autoDub.ui.pmMenu()" id="snklist" class="sneakyClose">+</div></div><div id="usrbottom"><ul id="usrsneak"></ul></div></div></div>');
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

    var desktopNotificationStatus = 'off';
    if (autoDub.desktopNotifications == true) {
      desktopNotificationStatus = 'on';
    } else {
      desktopNotificationStatus = 'off';
    }

    var lfmTxt = "<span id=\"lfmsetting\"><a href=\"http://www.last.fm/api/auth/?api_key=" + autoDub.lastfm.key + "&cb=" + window.location.href + "\" class=\"autodub-jllink\">Scrobble: <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDublfm\">Click to connect last.fm.</span></a></span>";
    if (autoDub.lastfm.sk) lfmTxt = "<span id=\"lfmsetting\"><a id=\"lfmsetting\" href=\"#\" onclick=\"autoDub.lfmClick()\" class=\"autodub-jllink\">Scrobble: <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDublfm\"> Connected to last.fm. Click to disconnect.</span></a></span>";


    $("#adbsettings").append("<a href=\"#\" class=\"autodub-link\"><span id=\"autoDubMode\">Vote Timer</span> <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubTimer\">voted</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.jlmToggle()\" class=\"autodub-jllink\">Join/Leave <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubjlm\">" + jlm + "</span></a>");
    $("#adbsettings").append(lfmTxt);
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.dvmToggle()\" class=\"autodub-dvlink\">Downvote Alert <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubdvm\">" + dvm + "</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.haToggle()\" class=\"autodub-qtlink\">Hide Avatars <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubha\">" + hideav + "</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.qtToggle()\" class=\"autodub-halink\">Queue+Chat <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubqt\">" + qtm + "</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.toggleDeskNotStat()\" class=\"autodub-desktopNotificationStatus\" title=\"Show a desktop notification for @ mentions\">Desktop Notifications <span style=\"float:right; color:#fff; font-weight:700;\" id=\"desktopNotificationStatus\">" + desktopNotificationStatus + "</span></a>");
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
    if (typeof preferences.pmPlus != "undefined") pm = preferences.pmPlus;
    if (typeof preferences.hideAvatars != "undefined") ha = preferences.hideAvatars;
    if (typeof preferences.dvm != "undefined") dv = preferences.dvm;
    if (typeof preferences.queueThanks != "undefined") qt = preferences.queueThanks;
    if (typeof preferences.joinLeaves != "undefined") jl = preferences.joinLeaves;
    var thingo = localStorage["adLastfmSession"];
    if (thingo == "false") thingo = false;
    if (thingo) autoDub.lastfm.sk = thingo;
    autoDub.ui.init(preferences.mode, jl, dv, qt, pm, ha);


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
