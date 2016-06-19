var autoDub = {
  started: false,
  mode: "classic",
  version: "00.39",
  whatsNew: "Desktop noticications for @user messages! On by default, but can be turned off in AutoDub settings!",
  firstMessage: "Hey there! AutoDub upvotes at a random time during the song. There's a countdown timer hidden in the 'AUTODUB' tab above the video box.",
  lastLoaded: null,
  roomCheck: null,
  altDancers: false,
  songtimer: null,
  eveTalk: false,
  queueThanks: true,
  firstTalk: false,
  dvm: true,
  users: {},
  joinLeaves: false,
  userid: null,
  toolTip: null,
  lastSong: null,
  desktopNotifications: true,
  shootDucks: true,
  workMode: false,
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
      $("#autoDubTimer").text("voted");
      $(".dubup").click();
      console.log("voted.");
    }, thetimer);

};

autoDub.newChat = function(data) {
  var id = data.chatid;
  var uid = data.user._id;
  var name = data.user.username;
  var msg = data.message;
  if( autoDub.shootDucks == true ){
    if (Notification){
      if (Notification.permission !== "granted"){
        Notification.requestPermission();
      }else{
        if ( uid == "560164dd2e803803000fffb6" && msg.match(/Quack quack../i) ){
          var ducknotification = new Notification('AutoDub', {
            icon: 'https://i.imgur.com/1huAkzf.png',
            body: "Quack Quack...",
          }); // notification
          ducknotification.onclick = function () {
            Dubtrack.room.chat._messageInputEl.val("!shootduck");
            Dubtrack.room.chat.sendMessage();
          }; // notification.onclick
        }else if( uid == "560164dd2e803803000fffb6" && msg.match( /nice\! you felled a/ ) ){
          var duckdeadnotification = new Notification('AutoDub', {
            icon: 'https://i.imgur.com/1huAkzf.png',
            body: "THE DUCKY LOST.",
          }); // notification
        }else if( uid == "560164dd2e803803000fffb6" && msg.match( /DUCK FLEW AWAY\!/ ) ){
          var duckdeadnotification = new Notification('AutoDub', {
            icon: 'https://i.imgur.com/1huAkzf.png',
            body: "DUCK FLEW AWAY!",
          }); // notification
        }
      } // else
    } // Notification
  }
  if( autoDub.desktopNotifications == true ){
    var yourStupidName = '@'+$('.user-info span').text();
    if (Notification){
      if (Notification.permission !== "granted"){
        Notification.requestPermission();
      }else{
        if( msg.match( yourStupidName, 'i' ) || msg.match( /\@everyone/ ) ){
          var notification = new Notification(name, {
            icon: 'https://api.dubtrack.fm/user/'+uid+'/image',
            body: msg,
          }); // notification
        }
      } // else
    } // Notification
  } // if desktopNotifications

  if (autoDub.idmode.userid && autoDub.idmode.arnold){
    setTimeout(function(){
      $(".chat-id-" + id).find(".cursor-pointer").attr("src", "https://i.imgur.com/1AME7v3.png");
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
    console.log("enter init");

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
      console.log("events binded");

 // $(".dubup").click();

  console.log("autodub v" + autoDub.version + " is a go!");
  $( "<style>.adbsettings a{display: block;padding: 8px 0;padding: .5rem 0;border-bottom: 1px solid #878c8e;color:#878c8e;zoom: 1;}.adbsettings a:last-child { border-bottom:none;}</style>" ).appendTo( "head" );
  $( "<div style=\"padding-bottom: 56.25%; display:none; position: relative; z-index: 5;\" id=\"noumBoard\"><div id=\"noumcon\" style=\"height: 100%; width: 100%; position: absolute; top: 0; left: 0; overflow-y: scroll; padding: 0 16px 0 0; padding: 0 1rem 0 0;\"><div style=\"font-size:35px;font-weight:700; padding-bottom:15px; text-align:center;\">AutoDub v"+autoDub.version+"</div><div style=\"font-size: 1.1rem; font-weight: 700; text-align: center; text-transform: uppercase;\">General Settings</div><div class=\"adbsettings\" id=\"adbsettings\"></div></div></div>" ).insertAfter( "#room-info-display" );

$(".player_header").append("<span style=\"width: 40px; background-image: url(https://i.imgur.com/0WML9BT.png);color: rgba(0,0,0,0);background-position: center center;background-repeat: no-repeat;\" id=\"buttonThingThanks2\" onclick=\"autoDub.noumBoard()\">_</span>");


$( ".displayVideo-el" ).click(function() {
    $("#noumBoard").css("display","none");

});
$( ".room-info-display" ).click(function() {
    $("#noumBoard").css("display","none");
});

$( ".display-mods-controls" ).click(function() {
    $("#noumBoard").css("display","none");
});
  autoDub.storage.restore();
    console.log("exit init");

};

autoDub.noumBoard = function(){
  $( ".player_header" ).find( ".active" ).removeClass( "active" );
  $( "#buttonThingThanks2" ).addClass( "active" );
  $("#room-info-display").css("display","none");
  $("#mods-controllers").css("display","none");
  $(".player_container").css("display","none");
  $("#noumBoard").css("display","block");
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
      if( autoDub.workMode ){
        var discoballdisplay = 'none';
        var dancersheight = '0';
      }else{
        var discoballdisplay = 'block';
        var dancersheight = '130px';
      }
      $(".right_section").prepend("<div id=\"discoball\" style=\"pointer-events: none; background: transparent url(https://i.imgur.com/Bdn4yrg.gif) no-repeat center top; display: "+discoballdisplay+"; width: 100%; height:300px;position: absolute;left: 5;z-index: 6;margin-top: -377px;\"></div>");
      if (!autoDub.altDancers){
        $(".player_sharing").append("<div style=\"width:93%; display:none; pointer-events: none; position:absolute; height:"+dancersheight+"; z-index:120; margin-top:-180px;overflow:hidden;\" id=\"dancers\"><div class=\"dncr\" style=\"float:left; background: transparent url(https://i.imgur.com/IieFNhZ.gif); width:59px; height:130px;\"></div><div class=\"dncr\" style=\"float:right; background: transparent url(https://i.imgur.com/IieFNhZ.gif); width:59px; height:130px;\"></div><div style=\"clear:both;\"></div></div>");
      } else {
      $(".player_sharing").append("<div style=\"width:93%; display:none; pointer-events: none; position:absolute; height:"+dancersheight+"; z-index:120; margin-top:-180px;overflow:hidden;\" id=\"dancers\"><div class=\"dncr\" style=\"float:left; background: transparent url(https://i.imgur.com/aeOoQTZ.gif); width:88px; height:130px;\"></div><div class=\"dncr\" style=\"float:right; background: transparent url(https://i.imgur.com/aeOoQTZ.gif); width:88px; height:130px;\"></div><div style=\"clear:both;\"></div></div>");
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
  onShirt: null,
  theBank: null,
  shirt: null,
  theRoomShit: null,
  userid: null,
  init: function() {
     if (Notification.permission !== "granted"){
    Notification.requestPermission();
}
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
    autoDub.idmode.shirt = autoDub.idmode.fb.child("shirt");
    autoDub.idmode.eveWords = autoDub.idmode.fb.child("evetalk");
    autoDub.idmode.onWordChange = autoDub.idmode.eveWords.on("value", function(snapshot) {
      autoDub.idmode.eveTalkr(snapshot);
    });
    autoDub.idmode.onShirt = autoDub.idmode.shirt.on("value", function(snapshot) {
      autoDub.idmode.shirtChange(snapshot);
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
var workmodeOpt = "off";
if (autoDub.altDancers) altD = "on";
if (autoDub.eveTalk) et = "on";
if( autoDub.shootDucks ) ducksOpt = "on";
if( autoDub.workMode ) workmodeOpt = "on"
$("#noumcon").append("<div style=\"font-size: 1.1rem; margin-top:30px; font-weight: 700; text-align: center; text-transform: uppercase;\">Indie Discotheque Settings</div><div class=\"adbsettings\" id=\"idsettings\"></div>");
  $("#idsettings").append("<a href=\"#\" onclick=\"autoDub.etToggle()\" class=\"autodub-etlink\">Eve Talk <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubet\">"+et+"</span>");
   $("#idsettings").append("<a href=\"#\" onclick=\"autoDub.altDToggle()\" class=\"autodub-altDlink\">Alt Dancer <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubaltd\">"+altD+"</span>");
   $("#idsettings").append("<a href=\"#\" onclick=\"autoDub.ducksToggle()\" class=\"autodub-duckslink\" title=\"Show desktop notifications for duck hunting\">Ducks <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubducks\">"+ducksOpt+"</span>");
   $("#idsettings").append("<a href=\"#\" onclick=\"autoDub.workmodeToggle()\" class=\"autodub-workmodelink\" title=\"Disables the discoball and dancers entirely\">Work Mode <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubworkmode\">"+workmodeOpt+"</span>");


  },
  eveTalkr: function(snapshot){
    var data = snapshot.val();
    if (!autoDub.firstTalk){
      autoDub.firstTalk = true;
    } else {
    if (data){
      if (autoDub.eveTalk){
        console.log(data.msg);
        responsiveVoice.speak(data.msg);
      }
    }
  }
  },
  shirtChange: function(snapshot){
    var data = snapshot.val();
    $(".currentSong").html(data.artist+" - "+data.title);
  },
  roomShitChange: function(snapshot) {
    var data = snapshot.val();
    if (data.discoball) {
      autoDub.idmode.discoball.down();
    } else {
      autoDub.idmode.discoball.up();
    }
      if (typeof data.dancers != "undefined"){

    var currentDancers = $("#dancers").is(":visible");
    if (data.dancers != currentDancers){
      $( "#dancers" ).slideToggle( "slow", function() {
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
  init: function(mode, jl, dv, qt) {
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
      $('#browser').one("DOMSubtreeModified", function(){$(window).unbind('click.browser'); $("#browser").css("margin-bottom","55px");$("#browser").css("width","50%");});
    }
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
 var qtm = "off";
    if (qt){
      qtm = "on";
    } else if (autoDub.queueThanks){
      qtm = "on";
    }

    var desktopNotificationStatus = 'off';
    if( autoDub.desktopNotifications == true ){
      desktopNotificationStatus = 'on';
    }else{
      desktopNotificationStatus = 'off';
    }

    $("#adbsettings").append("<a href=\"#\" class=\"autodub-link\"><span id=\"autoDubMode\">Vote Timer</span> <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubTimer\">voted</span></a>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.jlmToggle()\" class=\"autodub-jllink\">Join/Leave <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubjlm\">"+jlm+"</span>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.dvmToggle()\" class=\"autodub-dvlink\">Downvote Alert <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubdvm\">"+dvm+"</span>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.qtToggle()\" class=\"autodub-qtlink\">Queue+Chat <span style=\"float:right; color:#fff; font-weight:700;\" id=\"autoDubqt\">"+qtm+"</span>");
    $("#adbsettings").append("<a href=\"#\" onclick=\"autoDub.toggleDeskNotStat()\" class=\"autodub-desktopNotificationStatus\" title=\"Show a desktop notification for @ mentions\">Desktop Notifications <span style=\"float:right; color:#fff; font-weight:700;\" id=\"desktopNotificationStatus\">"+desktopNotificationStatus+"</span>");
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
          setTimeout(function() {

    if (Dubtrack.room.model.id == "55f82ef944809b0300f88695") {
      $(".right_section").prepend("<div id=\"discobal\" style=\"position: absolute; margin-top: -20px; font-size: 14px;\">Loading your Discocheque balance...</div>");
      autoDub.idmode.discoball.create();
      setTimeout(function() {
        autoDub.idmode.init();
        var cat = Dubtrack.helpers.cookie.get('dubtrack-disable-role-colors');
        if (!cat){
    $("head").append("<style>.user-560164dd2e803803000fffb6 .username,.userid-560164dd2e803803000fffb6 .username, .userid-560164dd2e803803000fffb6 .user-role{color:#CB213D !important;}.user-560164dd2e803803000fffb6 .user-role{background:no-repeat -3px 0 url(https://i.imgur.com/3puCdq3.png); color: rgba(0, 0, 0, 0) !important;} .userid-560164dd2e803803000fffb6 .user-role{background: no-repeat -2px url(https://i.imgur.com/7eTBSTh.png); color: rgba(0, 0, 0, 0) !important;}</style>");
        }else if (cat == "false"){
    $("head").append("<style>.user-560164dd2e803803000fffb6 .username,.userid-560164dd2e803803000fffb6 .username, .userid-560164dd2e803803000fffb6 .user-role{color:#CB213D !important;}.user-560164dd2e803803000fffb6 .user-role{background:no-repeat -3px 0 url(https://i.imgur.com/3puCdq3.png); color: rgba(0, 0, 0, 0) !important;} .userid-560164dd2e803803000fffb6 .user-role{background: no-repeat -2px url(https://i.imgur.com/7eTBSTh.png); color: rgba(0, 0, 0, 0) !important;}</style>");
        }
      }, 1000);
    }
         }, 2000);
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

autoDub.toggleDeskNotStat = function(){
  var label = 'off';
  if( autoDub.desktopNotifications ){
    autoDub.desktopNotifications = false;
    label = 'off';
  }else{
    label = 'on';
    autoDub.desktopNotifications = true;
  }
  autoDub.storage.save();
  $("#desktopNotificationStatus").text(label);
}

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

autoDub.qtToggle = function(){
  var label = "off";
  if (autoDub.queueThanks){
    autoDub.queueThanks = false;
         $("#browser").css("width","100%");
         $("#browser").css("margin-bottom","0px");
  } else {
    label = "on";
    autoDub.queueThanks = true;
          $('#browser').one("DOMSubtreeModified", function(){$(window).unbind('click.browser'); $("#browser").css("margin-bottom","55px");$("#browser").css("width","50%");});
  }
  autoDub.storage.save();
  $("#autoDubqt").text(label);
};

autoDub.etToggle = function(){
  var label = "off";
  if (autoDub.eveTalk){
    autoDub.eveTalk = false;
  } else {
    label = "on";
    autoDub.eveTalk = true;
  }
  autoDub.storage.save();
  $("#autoDubet").text(label);
};


autoDub.altDToggle = function(){
  var label = "off";
  if (autoDub.altDancers){
    autoDub.altDancers = false;
  $( ".dncr").css( "width", "59px" );
  $( ".dncr" ).css( "background-image", "url(https://i.imgur.com/IieFNhZ.gif)" );

  } else {
    label = "on";
    autoDub.altDancers = true;
  $( ".dncr").css( "width", "88px" );
  $( ".dncr" ).css( "background-image", "url(https://i.imgur.com/aeOoQTZ.gif)" );
  }
  autoDub.storage.save();
  $("#autoDubaltd").text(label);
};

autoDub.ducksToggle = function(){
  var label = "off";
  if (autoDub.shootDucks){
    autoDub.shootDucks = false;
  } else {
    label = "on";
    autoDub.shootDucks = true;
  }
  autoDub.storage.save();
  $("#autoDubducks").text(label);
};

autoDub.workmodeToggle = function(){
  var label = "off";
  if (autoDub.workMode){
    autoDub.workMode = false;
    document.getElementById('discoball').style.display = 'block';
    document.getElementById('dancers').style.height = '130px';
  } else {
    label = "on";
    autoDub.workMode = true;
    document.getElementById('discoball').style.display = 'none';
    document.getElementById('dancers').style.height = '0';
  }
  autoDub.storage.save();
  $("#autoDubworkmode").text(label);
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
      altDancers: autoDub.altDancers,
      eveTalk: autoDub.eveTalk,
      queueThanks: autoDub.queueThanks,
      lastLoaded: autoDub.lastLoaded,
      dvm: autoDub.dvm,
      desktopNotifications: autoDub.desktopNotifications,
      shootDucks: autoDub.shootDucks,
      workMode: autoDub.workMode,
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
    var qt = true;
    var dv = true;
    if (typeof preferences.dvm != "undefined") dv = preferences.dvm;
    if (typeof preferences.queueThanks != "undefined") qt = preferences.queueThanks;
    if (typeof preferences.joinLeaves != "undefined") jl = preferences.joinLeaves;
    autoDub.ui.init(preferences.mode, jl, dv, qt);
  }
};

autoDub.init();

if("undefined"!=typeof responsiveVoice)console.log("ResponsiveVoice already loaded"),console.log(responsiveVoice);else var ResponsiveVoice=function(){var e=this;e.version=3,console.log("ResponsiveVoice r"+e.version);var a=[{name:"UK English Female",voiceIDs:[3,5,1,6,7,8]},{name:"UK English Male",voiceIDs:[0,4,2,6,7,8]},{name:"US English Female",voiceIDs:[39,40,41,42,43,44]},{name:"Spanish Female",voiceIDs:[19,16,17,18,20,15]},{name:"French Female",voiceIDs:[21,22,23,26]},{name:"Deutsch Female",voiceIDs:[27,28,29,30,31,32]},{name:"Italian Female",voiceIDs:[33,34,35,36,37,38]},{name:"Greek Female",voiceIDs:[62,63,64]},{name:"Hungarian Female",voiceIDs:[9,10,11]},{name:"Russian Female",voiceIDs:[47,48,49]},{name:"Dutch Female",voiceIDs:[45]},{name:"Swedish Female",voiceIDs:[65]},{name:"Japanese Female",voiceIDs:[50,51,52,53]},{name:"Korean Female",voiceIDs:[54,55,56,57]},{name:"Chinese Female",voiceIDs:[58,59,60,61]},{name:"Hindi Female",voiceIDs:[66,67]},{name:"Serbian Male",voiceIDs:[12]},{name:"Croatian Male",voiceIDs:[13]},{name:"Bosnian Male",voiceIDs:[14]},{name:"Romanian Male",voiceIDs:[46]},{name:"Fallback UK Female",voiceIDs:[8]}],n=[{name:"Google UK English Male"},{name:"Agnes"},{name:"Daniel Compact"},{name:"Google UK English Female"},{name:"en-GB",rate:.25,pitch:1},{name:"en-AU",rate:.25,pitch:1},{name:"inglés Reino Unido"},{name:"English United Kingdom"},{name:"Fallback en-GB Female",lang:"en-GB",fallbackvoice:!0},{name:"Eszter Compact"},{name:"hu-HU",rate:.4},{name:"Fallback Hungarian",lang:"hu",fallbackvoice:!0},{name:"Fallback Serbian",lang:"sr",fallbackvoice:!0},{name:"Fallback Croatian",lang:"hr",fallbackvoice:!0},{name:"Fallback Bosnian",lang:"bs",fallbackvoice:!0},{name:"Fallback Spanish",lang:"es",fallbackvoice:!0},{name:"Spanish Spain"},{name:"español España"},{name:"Diego Compact",rate:.3},{name:"Google Español"},{name:"es-ES",rate:.2},{name:"Google Français"},{name:"French France"},{name:"francés Francia"},{name:"Virginie Compact",rate:.5},{name:"fr-FR",rate:.25},{name:"Fallback French",lang:"fr",fallbackvoice:!0},{name:"Google Deutsch"},{name:"German Germany"},{name:"alemán Alemania"},{name:"Yannick Compact",rate:.5},{name:"de-DE",rate:.25},{name:"Fallback Deutsch",lang:"de",fallbackvoice:!0},{name:"Google Italiano"},{name:"Italian Italy"},{name:"italiano Italia"},{name:"Paolo Compact",rate:.5},{name:"it-IT",rate:.25},{name:"Fallback Italian",lang:"it",fallbackvoice:!0},{name:"Google US English",timerSpeed:1},{name:"English United States"},{name:"inglés Estados Unidos"},{name:"Vicki"},{name:"en-US",rate:.2,pitch:1,timerSpeed:1.3},{name:"Fallback English",lang:"en-US",fallbackvoice:!0,timerSpeed:0},{name:"Fallback Dutch",lang:"nl",fallbackvoice:!0,timerSpeed:0},{name:"Fallback Romanian",lang:"ro",fallbackvoice:!0},{name:"Milena Compact"},{name:"ru-RU",rate:.25},{name:"Fallback Russian",lang:"ru",fallbackvoice:!0},{name:"Google 日本人",timerSpeed:1},{name:"Kyoko Compact"},{name:"ja-JP",rate:.25},{name:"Fallback Japanese",lang:"ja",fallbackvoice:!0},{name:"Google 한국의",timerSpeed:1},{name:"Narae Compact"},{name:"ko-KR",rate:.25},{name:"Fallback Korean",lang:"ko",fallbackvoice:!0},{name:"Google 中国的",timerSpeed:1},{name:"Ting-Ting Compact"},{name:"zh-CN",rate:.25},{name:"Fallback Chinese",lang:"zh-CN",fallbackvoice:!0},{name:"Alexandros Compact"},{name:"el-GR",rate:.25},{name:"Fallback Greek",lang:"el",fallbackvoice:!0},{name:"Fallback Swedish",lang:"sv",fallbackvoice:!0},{name:"hi-IN",rate:.25},{name:"Fallback Hindi",lang:"hi",fallbackvoice:!0}];e.iOS=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);var l,o=[{name:"he-IL",voiceURI:"he-IL",lang:"he-IL"},{name:"th-TH",voiceURI:"th-TH",lang:"th-TH"},{name:"pt-BR",voiceURI:"pt-BR",lang:"pt-BR"},{name:"sk-SK",voiceURI:"sk-SK",lang:"sk-SK"},{name:"fr-CA",voiceURI:"fr-CA",lang:"fr-CA"},{name:"ro-RO",voiceURI:"ro-RO",lang:"ro-RO"},{name:"no-NO",voiceURI:"no-NO",lang:"no-NO"},{name:"fi-FI",voiceURI:"fi-FI",lang:"fi-FI"},{name:"pl-PL",voiceURI:"pl-PL",lang:"pl-PL"},{name:"de-DE",voiceURI:"de-DE",lang:"de-DE"},{name:"nl-NL",voiceURI:"nl-NL",lang:"nl-NL"},{name:"id-ID",voiceURI:"id-ID",lang:"id-ID"},{name:"tr-TR",voiceURI:"tr-TR",lang:"tr-TR"},{name:"it-IT",voiceURI:"it-IT",lang:"it-IT"},{name:"pt-PT",voiceURI:"pt-PT",lang:"pt-PT"},{name:"fr-FR",voiceURI:"fr-FR",lang:"fr-FR"},{name:"ru-RU",voiceURI:"ru-RU",lang:"ru-RU"},{name:"es-MX",voiceURI:"es-MX",lang:"es-MX"},{name:"zh-HK",voiceURI:"zh-HK",lang:"zh-HK"},{name:"sv-SE",voiceURI:"sv-SE",lang:"sv-SE"},{name:"hu-HU",voiceURI:"hu-HU",lang:"hu-HU"},{name:"zh-TW",voiceURI:"zh-TW",lang:"zh-TW"},{name:"es-ES",voiceURI:"es-ES",lang:"es-ES"},{name:"zh-CN",voiceURI:"zh-CN",lang:"zh-CN"},{name:"nl-BE",voiceURI:"nl-BE",lang:"nl-BE"},{name:"en-GB",voiceURI:"en-GB",lang:"en-GB"},{name:"ar-SA",voiceURI:"ar-SA",lang:"ar-SA"},{name:"ko-KR",voiceURI:"ko-KR",lang:"ko-KR"},{name:"cs-CZ",voiceURI:"cs-CZ",lang:"cs-CZ"},{name:"en-ZA",voiceURI:"en-ZA",lang:"en-ZA"},{name:"en-AU",voiceURI:"en-AU",lang:"en-AU"},{name:"da-DK",voiceURI:"da-DK",lang:"da-DK"},{name:"en-US",voiceURI:"en-US",lang:"en-US"},{name:"en-IE",voiceURI:"en-IE",lang:"en-IE"},{name:"hi-IN",voiceURI:"hi-IN",lang:"hi-IN"},{name:"el-GR",voiceURI:"el-GR",lang:"el-GR"},{name:"ja-JP",voiceURI:"ja-JP",lang:"ja-JP"}],c=100,i=5,t=0,s=!1,r=140;e.fallback_playing=!1,e.fallback_parts=null,e.fallback_part_index=0,e.fallback_audio=null,e.msgparameters=null,e.timeoutId=null,e.OnLoad_callbacks=[],"undefined"!=typeof speechSynthesis&&(speechSynthesis.onvoiceschanged=function(){l=window.speechSynthesis.getVoices(),null!=e.OnVoiceReady&&e.OnVoiceReady.call()}),e.default_rv=a[0],e.OnVoiceReady=null,e.init=function(){"undefined"==typeof speechSynthesis?(console.log("RV: Voice synthesis not supported"),e.enableFallbackMode()):setTimeout(function(){var a=setInterval(function(){var n=window.speechSynthesis.getVoices();0!=n.length||null!=l&&0!=l.length?(console.log("RV: Voice support ready"),e.systemVoicesReady(n),clearInterval(a)):(t++,t>i&&(clearInterval(a),null!=window.speechSynthesis?e.iOS?(console.log("RV: Voice support ready (cached)"),e.systemVoicesReady(o)):(console.log("RV: speechSynthesis present but no system voices found"),e.enableFallbackMode()):e.enableFallbackMode()))},100)},100),e.Dispatch("OnLoad")},e.systemVoicesReady=function(a){l=a,e.mapRVs(),null!=e.OnVoiceReady&&e.OnVoiceReady.call()},e.enableFallbackMode=function(){s=!0,console.log("RV: Enabling fallback mode"),e.mapRVs(),null!=e.OnVoiceReady&&e.OnVoiceReady.call()},e.getVoices=function(){for(var e=[],n=0;n<a.length;n++)e.push({name:a[n].name});return e},e.speak=function(a,n,l){e.msgparameters=l||{},e.msgtext=a,e.msgvoicename=n;var o=[];if(a.length>c){for(var i=a;i.length>c;){var t=i.search(/[:!?.;]+/),r="";if((-1==t||t>=c)&&(t=i.search(/[,]+/)),-1==t||t>=c)for(var m=i.split(" "),v=0;v<m.length&&!(r.length+m[v].length+1>c);v++)r+=(0!=v?" ":"")+m[v];else r=i.substr(0,t+1);i=i.substr(r.length,i.length-r.length),o.push(r)}i.length>0&&o.push(i)}else o.push(a);var g;g=null==n?e.default_rv:e.getResponsiveVoice(n);var d={};if(null!=g.mappedProfile)d=g.mappedProfile;else if(d.systemvoice=e.getMatchedVoice(g),d.collectionvoice={},null==d.systemvoice)return void console.log("RV: ERROR: No voice found for: "+n);1==d.collectionvoice.fallbackvoice?(s=!0,e.fallback_parts=[]):s=!1,e.msgprofile=d;for(var v=0;v<o.length;v++)if(s){var u="https://responsivevoice.org/responsivevoice/getvoice.php?t="+o[v]+"&tl="+d.collectionvoice.lang||d.systemvoice.lang||"en-US",p=document.createElement("AUDIO");p.src=u,p.playbackRate=1,p.preload="auto",p.volume=d.collectionvoice.volume||d.systemvoice.volume||1,e.fallback_parts.push(p)}else{var h=new SpeechSynthesisUtterance;h.voice=d.systemvoice,h.voiceURI=d.systemvoice.voiceURI,h.volume=d.collectionvoice.volume||d.systemvoice.volume||1,h.rate=d.collectionvoice.rate||d.systemvoice.rate||1,h.pitch=d.collectionvoice.pitch||d.systemvoice.pitch||1,h.text=o[v],h.lang=d.collectionvoice.lang||d.systemvoice.lang,h.rvIndex=v,h.rvTotal=o.length,0==v&&(h.onstart=e.speech_onstart),e.msgparameters.onendcalled=!1,null!=l?(v<o.length-1&&o.length>1?(h.onend=l.onchunkend,h.addEventListener("end",l.onchuckend)):(h.onend=e.speech_onend,h.addEventListener("end",e.speech_onend)),h.onerror=l.onerror||function(e){console.log("RV: Error"),console.log(e)},h.onpause=l.onpause,h.onresume=l.onresume,h.onmark=l.onmark,h.onboundary=l.onboundary):(h.onend=e.speech_onend,h.onerror=function(e){console.log("RV: Error"),console.log(e)}),speechSynthesis.speak(h)}s&&(e.fallback_part_index=0,e.fallback_startPart())},e.startTimeout=function(a,n){var l=e.msgprofile.collectionvoice.timerSpeed;null==e.msgprofile.collectionvoice.timerSpeed&&(l=1),0>=l||(e.timeoutId=setTimeout(n,1e3*l*(60/r)*a.split(/\s+/).length))},e.checkAndCancelTimeout=function(){null!=e.timeoutId&&(clearTimeout(e.timeoutId),e.timeoutId=null)},e.speech_timedout=function(){e.cancel(),e.speech_onend()},e.speech_onend=function(){return e.checkAndCancelTimeout(),e.cancelled===!0?void(e.cancelled=!1):void(null!=e.msgparameters&&null!=e.msgparameters.onend&&1!=e.msgparameters.onendcalled&&(e.msgparameters.onendcalled=!0,e.msgparameters.onend()))},e.speech_onstart=function(){e.iOS&&e.startTimeout(e.msgtext,e.speech_timedout),e.msgparameters.onendcalled=!1,null!=e.msgparameters&&null!=e.msgparameters.onstart&&e.msgparameters.onstart()},e.fallback_startPart=function(){0==e.fallback_part_index&&e.speech_onstart(),e.fallback_audio=e.fallback_parts[e.fallback_part_index],null==e.fallback_audio?console.log("RV: Fallback Audio is not available"):(e.fallback_audio.play(),e.fallback_audio.addEventListener("ended",e.fallback_finishPart))},e.fallback_finishPart=function(a){e.checkAndCancelTimeout(),e.fallback_part_index<e.fallback_parts.length-1?(e.fallback_part_index++,e.fallback_startPart()):e.speech_onend()},e.cancel=function(){e.checkAndCancelTimeout(),s?null!=e.fallback_audio&&e.fallback_audio.pause():(e.cancelled=!0,speechSynthesis.cancel())},e.voiceSupport=function(){return"speechSynthesis"in window},e.OnFinishedPlaying=function(a){null!=e.msgparameters&&null!=e.msgparameters.onend&&e.msgparameters.onend()},e.setDefaultVoice=function(a){var n=e.getResponsiveVoice(a);null!=n&&(e.default_vr=n)},e.mapRVs=function(){for(var l=0;l<a.length;l++)for(var o=a[l],c=0;c<o.voiceIDs.length;c++){var i=n[o.voiceIDs[c]];if(1==i.fallbackvoice){o.mappedProfile={systemvoice:{},collectionvoice:i};break}var t=e.getSystemVoice(i.name);if(null!=t){o.mappedProfile={systemvoice:t,collectionvoice:i};break}}},e.getMatchedVoice=function(a){for(var l=0;l<a.voiceIDs.length;l++){var o=e.getSystemVoice(n[a.voiceIDs[l]].name);if(null!=o)return o}return null},e.getSystemVoice=function(e){if("undefined"==typeof l)return null;for(var a=0;a<l.length;a++)if(l[a].name==e)return l[a];return null},e.getResponsiveVoice=function(e){for(var n=0;n<a.length;n++)if(a[n].name==e)return a[n];return null},e.Dispatch=function(a){if(e.hasOwnProperty(a+"_callbacks")&&e[a+"_callbacks"].length>0)for(var n=e[a+"_callbacks"],l=0;l<n.length;l++)n[l]()},e.AddEventListener=function(a,n){e.hasOwnProperty(a+"_callbacks")?e[a+"_callbacks"].push(n):console.log("RV: Event listener not found: "+a)},"undefined"==typeof $?document.addEventListener("DOMContentLoaded",function(){e.init()}):$(document).ready(function(){e.init()})},responsiveVoice=new ResponsiveVoice;