 var videoDuration = 0;

  $(document).ready(function () {
    
      $("#player").youTubeEmbed({
          video: 'http://www.youtube.com/watch?v=p2MKzO9MfrE',
          width: 584,
          progressBar: true,
          onProgressBarAdded: getComments,
          onJump: populateComments
      });

  });

  function getComments(duration) {

      videoDuration = duration;
      var requestUrl = "/logs.json?from=0&to=" + videoDuration;

      $.getJSON(requestUrl, function (comments) {
          $(comments).each(function (i) {
              pushComment(this);
          });
      });
  }

  function populateComments(timestamp) {
    entries = $("#comment-entries");
    $(".comment").each(function(index, element) {
      element_time = parseInt($(element).attr("data-timestamp"), 10);
      comment_id = $(element).attr("data-marker-id");
      if(element_time < timestamp) {
        if(entries.find("#comment_" + comment_id).length === 0) {
          $('<div class="comment-entry" id="comment_'+comment_id +'">'+
          '<span class="image"><img src="https://graph.facebook.com/' +
          $(element).attr("data-uid") +
          '/picture/" style="float:left; margin-right:5px;" /></span><span class="bubble"><span class="name">'+
          $(element).attr("data-name")+
          '</span><span class="message">' + 
          $(element).attr("data-text") +
          '</span></span></div>').appendTo(entries);
        }
      }
      
    });
  }

  function pushComment(data) {
      if (console && console.log) {
          console.log("Adding comment for user '" + data.uid + "'.");
      }

      var id = data.id;
      var uid = data.uid;
      var name = data.name;
      var body = data.body;
      var timestamp = data.timestamp;
      var is_me = $("body").attr("data-current-id") == data.user_id;
      var user_type = is_me ? " me" : " notme";
      
      var left = (584 / videoDuration) * timestamp;
      $("<div id='marker_" + id + "' data-uid='"+uid+"' data-marker-id='"+id+"' data-name='" + name + "' data-text='" + body +
          "' data-timestamp='"+timestamp+"' class='comment" + user_type + "' style='position:absolute; left:" + (left - 4) + "px;'></div>")
          .mouseenter(function () {
              $("<div id='c" + id + "' style='width:200px; background-color:#eee; padding:4px;'><img src='https://graph.facebook.com/" +
                  uid + "/picture/' style='float:left; margin-right:5px;' />" +
                  $(this).attr("data-name") + "<br /><span class='body'>" + $(this).attr("data-text") + "</span></div>")
                  .appendTo("body")
                  .css("position", "absolute")
                  .css("top", ($(this).offset().top + $(this).height()) + "px")
                  .css("left", ($(this).offset().left - (($("#c" + id).width()) / 2) + 3) + "px");
          })
          .mouseleave(function () {
              $("#c" + id).remove();
          })
          .appendTo(".progressBar");
  }
