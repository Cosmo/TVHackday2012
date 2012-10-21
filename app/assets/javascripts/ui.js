$(document).ready(function(){
	$("#video-trigger-minified-open").click(function() {
		if($("#video").css("margin-top") === "-323px"){
			$("#video").animate({"margin-top" : "0"}, 300, 'swing');
			$("#current-video").slideUp(400);
			$("#video-trigger-minified-open").css({"background-color" : "#ff4300"});
			$("#info-trigger-minified-open").css({"background-color" : "#222"});
		} else {
			$("#video").animate({"margin-top" : "-323px"}, 300, 'swing');
			$("#video-trigger-minified-open").css({"background-color" : "#222"});
		}
	});

	$("#video-trigger").click(function() {
		$("#video").animate({"margin-top" : "0"}, 300, 'swing');
		$("#current-video").slideUp(400);
		$("#video-trigger-minified-open").css({"background-color" : "#ff4300"});
		$("#info-trigger-minified-open").css({"background-color" : "#222"});
	});

	$("#info-trigger-minified-open").click(function() {
		if($("#current-video").is(":hidden")){
			$("#current-video").slideDown('fast');
			$("#video").animate({"margin-top" : "-323px"}, 300, 'swing');
			$("#video-trigger-minified-open").css({"background-color" : "#222"});
			$("#info-trigger-minified-open").css({"background-color" : "#ff4300"});
		} else {
			$("#current-video").slideUp('fast');
			$("#info-trigger-minified-open").css({"background-color" : "#222"});
		}
	});
});