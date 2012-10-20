$(document).ready(function(){
	$("#video-trigger").click(function() {
		if ($("#video").css("top") === "-365px"){
			$("#video").animate({"top" : "0"}, 300, 'swing');
			$("#video-trigger").text("Video ausblenden");
		} else {
			$("#video").animate({"top" : "-365px"}, 300, 'swing');
			$("#video-trigger").text("Video jetzt anschauen");
		}
	});
});