
function _debug(msg) {
	if (undefined != window.console) {
		console.log(msg);
	};
};

function ArteContext() {
	this._reloadInterval = 600000;//milisecs
	this._updateInterval = 60000;//milisecs
	this._cache= { schedule: undefined, ts: undefined  };
	
	this.current={};
	this.prev={};
	this.next={};
	this.future={};
	
	this.isInitialized = function () {
		_debug("isInitialized");
		return undefined != this.current && undefined != this.prev && undefined != this.next && undefined != this._cache.schedule &&  undefined != this._cache.ts;
	};
	
	this._loadFromCache = function(bid) {
		var l = this._cache.schedule.length;
		_debug("loadFrom cache bid: " + bid + "  schedule.length:" + l);
		this.prev= undefined;
		this.current = undefined;
		this.next = undefined;
		this.future = undefined;
		for (var index = 0; index < l; index++) {
			var brdcst = this._cache.schedule[index];
			var prevBid = brdcst.BID;
			if ( bid == prevBid ) {
				if ( 0 < index) {
					this.prev = this._cache.schedule[index - 1];
				}
				this.current = brdcst;
				if ((l-1) > index ) {
					this.next = this._cache.schedule[index + 1];
					this.future = this._cache.schedule.slice(index + 1);
				}
				break;
			};
		};
	};
	
	this._loadFromSchedule = function(bid, bts, bet, callback) {
		_debug("load from schedule: " + bid + ',' + bts + ',' + bet );
		var ctx = this;
		var start = new Date(bts - 10*3600*1000);
		var end = new Date(bet + 10*3600*1000);
		var startText = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
		var endText = end.getFullYear() + '-' + (end.getMonth() + 1 )+ '-' + end.getDate();
		$.getJSON('http://www.arte.tv/tvhack/tvguide/epg/schedule/D/L3/' + startText + '/' + endText + '.json', function(fullData) {
			_debug("set cache schedule from fullData");
			ctx._cache.schedule = fullData.abstractBroadcastList;
			ctx._cache.ts = new Date().getUTCMilliseconds();
			ctx._loadFromCache(bid);
			callback(ctx.prev,ctx.current,ctx.next);
		});
	};
	
	this.loadFromBid = function (bid, callback) {
		_debug("load from bid");
		var ctx = this;
		if (undefined == bid) {
			//no bid provided fallback to load now
			this.load(callback);
		} else {
			if (ctx.isInitialized()) {
				//get data for bid
				if (bid == current.BID) {
					callback(ctx.prev,ctx.current,ctx.next);
				} else {
					ctx._loadFromCache(bid);
					if (isInitialized()) {
						callback(ctx.prev,ctx.current,ctx.next);
					};
				};
			};
			//no cache or not in cache
			_debug("no cache or not in cache");
			//load data for bid
			$.getJSON('http://www.arte.tv/tvhack/tvguide/epg/broadcast/D/L3/' + bid + '.json', function(biddata) {
				//error handling
				ctx._loadFromSchedule(bid, biddata.BTS, biddata.BET, callback);
			});
		};
	};
	
	this.load = function(callback ) {
		_debug("load " + this.toString());
		var ctx = this;
		var now = new Date().getMilliseconds();
		if (ctx.isInitialized() && (ctx._cache.ts + ctx._reloadInterval) < now) {
			_debug("use cache");
			if ((ctx._cache.ts + ctx._updateInterval) < now || (now < ctx.current.BET )) {
				_debug("current event still running");
				callback(ctx.prev, ctx.current, ctx.next);
			} else {
				_debug("set next event as current event");
				ctx.loadFromBid(ctx.next.BID, callback);
			}
		} else {
			_debug("get new data");
			$.getJSON('http://www.arte.tv/tvhack/tvguide/epg/live/D/L3/2.json', function(data) {
				//put into current and next
				ctx.current = data.abstractBroadcastList[0];
				var nextEv = data.abstractBroadcastList[1];
				ctx._loadFromSchedule(ctx.current.BID, ctx.current.BTS, nextEv.BET, callback);
			});
		};
	};
};


