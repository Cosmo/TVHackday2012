class HomeController < ApplicationController
  #layout 'ui', :only => 'ui'

  def index
    schedule_now_and_next_url = "http://www.arte.tv/tvhack/tvguide/epg/live/D/L3/2.json"

    schedule_now_and_next = parse_json(schedule_now_and_next_url)
    @schedule_now = schedule_now_and_next["abstractBroadcastList"][0]
    @schedule_next = schedule_now_and_next["abstractBroadcastList"][1]

    date_today = Time.now.strftime("%Y-%m-%d")
    schedule_url = "http://www.arte.tv/tvhack/tvguide/epg/schedule/D/L3/#{date_today}/#{date_today}.json"

    schedule_day = parse_json(schedule_url)
    schedule_day["abstractBroadcastList"].each_with_index {|program, index|
      if program["BID"] == @schedule_now["BID"]
        @schedule_previous = schedule_day["abstractBroadcastList"][index-1]
      end
    }
  end

  def parse_json(url)
    return JSON.parse(Net::HTTP.get_response(URI.parse(url)).body)
  end
  
  def ui
    
  end
end