class LogsController < ApplicationController
  def index
    @logs = Log.scoped.includes(:user)
    
    if params[:at_time]
      # Format: "2012-10-20-10-00"
      at = DateTime.strptime(params[:at],"%Y-%m-%d-%H-%M").to_time
      @logs = @logs.where("at >= ?", at).where("at <= ?", at + 1.minute)
    end
    
    if params[:from] && params[:to]
      # Format: 0-n
      # In Seconds
      # 1st minute == timestamp = 60
      @logs = @logs.where("timestamp >= ? AND timestamp <= ?", params[:from], params[:to])
    end
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @logs.to_json(:methods => [:uid, :name]) }
    end
  end
  
  def new
    @log = Log.new
  end
  
  def create
    if logged_in?
      @log = Log.new(params[:log])
      @log.user_id = current_user.id
      if params[:time].present?
        @log.at = params[:time]
      else
        @log.at = Time.now
      end
      if @log.save
        logger.info "awesome, #{current_user.email} tagged a video at #{@log.at}"
        Pusher['comments'].trigger('comment', { :body => @log.body, :user_id => @log.user_id, :short_time => @log.at.strftime("%H:%M"), :name => @log.user.name, :uid => @log.user.uid, :id => @log.id, :timestamp => @log.timestamp })
      end
      render json: @log, status: :created, location: @log
    else
      flash[:notice] = 'not logged in!'
      logger.info "something went wrong :( #{current_user.to_json}"
      redirect_to new_log_path
    end
  end
end