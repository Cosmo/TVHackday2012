class HomeController < ApplicationController
  def index
    schedule_now_and_next_url = "http://www.arte.tv/tvhack/tvguide/epg/live/D/L3/10.json"#?#{Time.now.to_i}"

    schedule_now_and_next = parse_json(schedule_now_and_next_url)
    @schedule_now = schedule_now_and_next["abstractBroadcastList"][0]
    @schedule_next = schedule_now_and_next["abstractBroadcastList"]

    date_today = Date.today.strftime("%Y-%m-%d")
    date_yesterday = Date.yesterday.strftime("%Y-%m-%d")
    schedule_url = "http://www.arte.tv/tvhack/tvguide/epg/schedule/D/L3/#{date_yesterday}/#{date_today}.json"#?#{Time.now.to_i}"

    schedule_day = parse_json(schedule_url)
    schedule_previous = []
    previous_found = false
    schedule_day["abstractBroadcastList"].each_with_index {|program, index|
      if program["BID"] == @schedule_now["BID"]
        previous_found = true
      end

      unless previous_found
        schedule_previous << schedule_day["abstractBroadcastList"][index]
      end
    }
    @schedule_previous = schedule_previous.reverse.take(9)
  end

  def parse_json(url)
    return JSON.parse(Net::HTTP.get_response(URI.parse(url)).body)
  end
end