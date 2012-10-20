

function ArteContext() {
	var current={};
	var prev={};
	var next={};
	this.load = function(callback ) {
		$.getJSON('http://www.arte.tv/tvhack/tvguide/epg/live/D/L3/2.json', function(data) {
			//put into current and next
			current = data.abstractBroadcastList[0];
			next = data.abstractBroadcastList[1];
			//load prev
			var start = new Date(current.BTS - 10*3600*1000);
			var end = new Date(current.BTS);
			var startText = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
			var endText = end.getFullYear() + '-' + (end.getMonth() + 1 )+ '-' + end.getDate();
			var currentBid = current.BID;
			$.getJSON('http://www.arte.tv/tvhack/tvguide/epg/schedule/D/L3/' + startText + '/' + endText + '.json', function(prevData) {
				var l = prevData.abstractBroadcastList.length;
				var prevBroadcast = prevData.abstractBroadcastList[0];
				for (var index = 0; index < l; index++) {
					var brdcst = prevData.abstractBroadcastList[index];
					var prevBid = brdcst.BID;
					if ( currentBid == prevBid ) {
						prev = prevBroadcast;
						break;
					}
					last = index;
					prevBroadcast=brdcst;
				};
				callback(prev, current, next);
			});
		});
	};
}
