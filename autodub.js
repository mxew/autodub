var autoDub = {
  started: false,
  mode: "classic",
  version: "00.19",
  whatsNew: "Removed that obnoxious eye icon that dubtrack slaps onto the screen when the video is hidden.",
  firstMessage: "Hey there! AutoDub upvotes at a random time during the song. There's a countdown timer hidden in the left dubtrack menu.",
  lastLoaded: null,
  roomCheck: null,
  songtimer: null,
  dvm: true,
  users: {},
  joinLeaves: false,
  userid: null,
  toolTip: null,
  lastSong: null
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
    autoDub.songtimer = setTimeout(function() {
      autoDub.songtimer = null;
      $("#autoDubTimer").countdown("destroy");
      $("#autoDubTimer").text("");
      $(".dubup").click();
      console.log("voted.");
    }, thetimer);

};

autoDub.newChat = function(data) {
  var id = data.chatid;
  if (autoDub.idmode.userid && autoDub.idmode.arnold){
    setTimeout(function(){
      $(".chat-id-" + id).find(".cursor-pointer").attr("src", "http://i.imgur.com/1AME7v3.png");
    }, 1500);
  }
};

autoDub.chatSpam = {
  joinLeave: function (id, name, type){
    var color = "#b6ffc0";
    var msg = name+" has joined the room";
    if (type == "leave"){
      color = "#ffa1a1";
      msg = name+" left the room";
    }
    $(".chat-main").append("<li style=\"color:"+color+";\">"+msg+".</li>");
    Dubtrack.room.chat.scollBottomChat();
  },
  dv: function (name){
    $(".chat-main").append("<li style=\"color:magenta;\">"+name+" downvoted this song.</li>");
    Dubtrack.room.chat.scollBottomChat();
  }
};

autoDub.init = function() {
  autoDub.started = true;
  var script = document.createElement('script');
  script.id = 'aptimer';
  script.type = 'text/javascript';
  script.src = 'https://mxew.github.io/autodub/jquery.countdown.min.js';
  document.body.appendChild(script);
  autoDub.storage.restore();
  Dubtrack.Events.bind("realtime:room_playlist-update", autoDub.newSong);
  Dubtrack.Events.bind("realtime:user-leave", autoDub.userLeave);
  Dubtrack.Events.bind("realtime:user-join", autoDub.userJoin);
  Dubtrack.Events.bind("realtime:room_playlist-dub", autoDub.newVote);
  Dubtrack.Events.bind("realtime:chat-message", autoDub.newChat);
  $(".dubup").click();
  console.log("autodub v" + autoDub.version + " is a go!");
};

autoDub.userJoin = function(data){
  var id = data.user._id;
  var name = data.user.username;
  if (!autoDub.users[id]){
    autoDub.users[id] = true;
    if (autoDub.joinLeaves) autoDub.chatSpam.joinLeave(id, name, "join");
  }
};

autoDub.userLeave = function(data){
  var id = data.user._id;
  var name = data.user.username;
  autoDub.users[id] = false;
  if (autoDub.joinLeaves) autoDub.chatSpam.joinLeave(id, name, "leave");
};

autoDub.idmode = {
  discoball: {
    create: function() {
      $(".right_section").prepend("<div id=\"discoball\" style=\"pointer-events: none; background: transparent url(http://i.imgur.com/Bdn4yrg.gif) no-repeat center top; display: block; width: 100%; height:300px;position: absolute;left: 5;z-index: 6;margin-top: -377px;\"></div>");
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
  onDiscoballChange: null,
  theBank: null,
  theRoomShit: null,
  userid: null,
  init: function() {
    autoDub.idmode.getName();
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
    autoDub.idmode.onValueChange = autoDub.idmode.theBank.on("value", function(snapshot) {
      autoDub.idmode.balchange(snapshot);
    });
    autoDub.idmode.onDiscoballChange = autoDub.idmode.theRoomShit.on("value", function(snapshot) {
      autoDub.idmode.roomShitChange(snapshot);
    });
  },
  roomShitChange: function(snapshot) {
    var data = snapshot.val();
    if (data.discoball) {
      autoDub.idmode.discoball.down();
    } else {
      autoDub.idmode.discoball.up();
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
  init: function(mode, jl, dv) {
    var themode = autoDub.mode;
    if (mode) themode = mode;
    autoDub.roomCheck = setInterval(function() {
      if (window.location.href.match(/\/join\//)) {
        autoDub.versionMessage();
        clearInterval(autoDub.roomCheck);
        autoDub.roomCheck = null;
      }
    }, 2000);

    var jlm = "off";
    if (jl){
      jlm = "on";
    } else if (autoDub.joinLeaves){
      jlm = "on";
    }
    var dvm = "off";
    if (dv){
      dvm = "on";
    } else if (autoDub.dvm){
      dvm = "on";
    }

    $("#main-menu-left").append("<a href=\"#\" class=\"autodub-link\"><span id=\"autoDubMode\">AutoDub</span> <span style=\"float:right;\" id=\"autoDubTimer\"></span></a>");
    $("#main-menu-left").append("<a href=\"#\" onclick=\"autoDub.jlmToggle()\" class=\"autodub-jllink\">Join/Leave: <span id=\"autoDubjlm\">"+jlm+"</span>");
    $("#main-menu-left").append("<a href=\"#\" onclick=\"autoDub.dvmToggle()\" class=\"autodub-dvlink\">Downvote Alert: <span id=\"autoDubdvm\">"+dvm+"</span>");
    $( "<style>#main_player .player_container #room-main-player-container:before{ visibility: hidden !important; }</style>" ).appendTo( "head" );
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
    if (window.location.href.match(/\/join\/indie-discotheque/)) {
      $(".right_section").prepend("<div id=\"discobal\" style=\"position: absolute; margin-top: -20px; font-size: 14px;\">Loading your Discocheque balance...</div>");
      autoDub.idmode.discoball.create();
      setTimeout(function() {
        autoDub.idmode.init();
      }, 1000);
    }
    $("#chat-txt-message").attr('maxlength', 140);
  },
  toolTips: function() {
    autoDub.toolTip = 'AutoDub is in timer mode. This autovotes at a random time during each song.';
    if ($(".tooltip").text()) $(".tooltip").text(autoDub.toolTip);
  }
};

autoDub.jlmToggle = function(){
  var label = "off";
  if (autoDub.joinLeaves){
    autoDub.joinLeaves = false;
  } else {
    label = "on";
    autoDub.joinLeaves = true;
  }
  autoDub.storage.save();
  $("#autoDubjlm").text(label);
};

autoDub.dvmToggle = function(){
  var label = "off";
  if (autoDub.dvm){
    autoDub.dvm = false;
  } else {
    label = "on";
    autoDub.dvm = true;
  }
  autoDub.storage.save();
  $("#autoDubdvm").text(label);
};

autoDub.newVote = function(data) {
  var username = $(".user-info").first().text();
  if (data.user.username == username) {
    //cancel the upvote if user voted
    if (autoDub.songtimer != null) {
      clearTimeout(autoDub.songtimer);
      autoDub.songtimer = null;
      $("#autoDubTimer").countdown("destroy");
      $("#autoDubTimer").text("");
      console.log("autovote off until next song.");
    }
  }
  if (data.dubtype == "downdub"){
      if (autoDub.dvm) autoDub.chatSpam.dv(data.user.username);
  }
};

autoDub.storage = {
  save: function() {
    var save_file = {
      mode: autoDub.mode,
      autoVote: autoDub.autoVote,
      joinLeaves: autoDub.joinLeaves,
      lastLoaded: autoDub.lastLoaded,
      dvm: autoDub.dvm
    };
    var preferences = JSON.stringify(save_file);
    localStorage["autoDub"] = preferences;
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
    if (preferences.joinLeaves) jl = preferences.joinLeaves;
    autoDub.ui.init(preferences.mode, jl);
  }
};

if (!autoDub.started) autoDub.init();
