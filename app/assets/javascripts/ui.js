$(document).ready(function(){
	$("#video-trigger-open").click(function() {
		if ($("#video").css("margin-top") === "-329px"){
			$("#current-video").slideUp();
			$("#video").animate({"margin-top" : "0"}, 300, 'swing');
			$("#current-video-minified").slideDown();
		} else {
			$("#video").animate({"margin-top" : "-329px"}, 300, 'swing');
		}
	});
	$("#video-trigger-close").click(function() {
		$("#current-video").slideDown();
		$("#video").animate({"margin-top" : "-329px"}, 300, 'swing');
		$("#current-video-minified").slideUp();
	});
});