$(document).ready(function(){
	$("#video-trigger-minified").click(function() {
		if($("#video").css("margin-top") === "-323px"){
			$("#video").animate({"margin-top" : "0"}, 300, 'swing');
			$("#infocard").slideUp(400);
			$("#video-trigger-minified").css({"background-color" : "#ff4300"});
			$("#info-trigger-minified").css({"background-color" : "#222"});
		} else {
			$("#video").animate({"margin-top" : "-323px"}, 300, 'swing');
			$("#video-trigger-minified").css({"background-color" : "#222"});
		}
	});

	$("#video-trigger").click(function() {
		$("#video").animate({"margin-top" : "0"}, 300, 'swing');
		$("#infocard").slideUp(400);
		$("#video-trigger-minified").css({"background-color" : "#ff4300"});
		$("#info-trigger-minified").css({"background-color" : "#222"});
	});

	$("#info-trigger-minified").click(function() {
		if($("#infocard").is(":hidden")){
			$("#infocard").slideDown('fast');
			$("#video").animate({"margin-top" : "-323px"}, 300, 'swing');
			$("#video-trigger-minified").css({"background-color" : "#222"});
			$("#info-trigger-minified").css({"background-color" : "#ff4300"});
		} else {
			$("#infocard").slideUp('fast');
			$("#info-trigger-minified").css({"background-color" : "#222"});
		}
	});
});