// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
// require jquery
//= require jquery_ujs

//= require arte_api
//= require jquery.swfobject
//= require player
//= require jquery.youtube
//= require ui

//r-equire_tree .

jQuery.fn.reset = function () {
  $(this).each (function() { this.reset(); });
}

$(function() {
  // Set focus on message field
  $("#log_body").focus();
  
  var socket            = new Pusher('9b398a15a5cdeb082e7d');
  var presence_channel  = socket.subscribe('presence-channel');
  var channel           = socket.subscribe('comments');

  presence_channel.bind('pusher:subscription_succeeded', function(members) {
    update_member_count(presence_channel.members.count);
    members.each(function(member) {
      add_member(member.id, member.info);
    });
  });

  presence_channel.bind('pusher:member_added', function(member) {
    add_member(member.id, member.info);
    update_member_count(presence_channel.members.count);
  });

  presence_channel.bind('pusher:member_removed', function(member) {
    remove_member(member.id);
    update_member_count(presence_channel.members.count);
  });
  
  channel.bind('comment', function(data) {
    $("<p>["+data.short_time+"] "+data.name+": "+data.body+"</p>").appendTo("#comment-entries");
    $("#log_body").val("");
    $("#log_body").focus();
    pushComment({ id: data.id, uid: data.uid, name: data.name, body: data.body, timestamp: data.timestamp, user_id: data.user_id });
  });
  
  function update_member_count(count) {
    $("#count").text(count + " users");
  }

  function add_member(member_id, member_info) {
    $("<li id='member_id_"+member_id+"'>"+member_info.name+"</li>").appendTo("#members");
  }

  function remove_member(member_id) {
    $("#member_id_" + member_id).remove();
  }
  
  $("#send_comment").bind("click", function() {
    message = $("#log_body").val();
    timestamp = $("object").get(0).getCurrentTime();
    
    send_data = { log: { timestamp: timestamp, body: message } };
    $.ajax({ type: "POST", url: "/logs", data: send_data, success: function(data, textStatus, jqXHR) { } });
    
    
    
  });
});