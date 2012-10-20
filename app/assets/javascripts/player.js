 var videoDuration = 0;

  $(document).ready(function () {

      $("#player").youTubeEmbed({
          video: 'http://www.youtube.com/watch?v=p2MKzO9MfrE',
          width: 584,
          progressBar: true,
          onProgressBarAdded: getComments
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
      $("<div id='" + uid + "' name='" + name + "' text='" + body +
          "' class='comment" + user_type + "' style='position:absolute; left:" + left + "px;'></div>")
          .mouseenter(function () {
              $("<div id='c" + id + "' style='width:200px; background-color:#eee; padding:4px;'><img src='https://graph.facebook.com/" +
                  this.id + "/picture/' style='float:left; margin-right:5px;' />" +
                  $(this).attr("name") + "<br />" + $(this).attr("text") + "</div>")
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
