class LogsController < ApplicationController
  def index
    @logs = Log.scoped
    
    if params[:at]
      # Format: "2012-10-20-10-00"
      at = DateTime.strptime(params[:at],"%Y-%m-%d-%H-%M").to_time
      @logs = @logs.where("at >= ?", at).where("at <= ?", at + 1.minute)
    end
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @logs }
    end
  end
  
  def new
    @log = Log.new
  end
  
  def create
    if logged_in?
      @log = Log.new(body: params[:log][:body])
      @log.user_id = current_user.id
      if params[:time].present?
        @log.at = params[:time]
      else
        @log.at = Time.now
      end
      if @log.save
        logger.info "awesome, #{current_user.email} tagged a video at #{@log.at}"
        Pusher['comments'].trigger('comment', { :body => @log.body, :user_id => @log.user_id, :short_time => @log.at.strftime("%H:%M"), :name => @log.user.name })
      end
      redirect_to logs_path
    else
      flash[:notice] = 'not logged in!'
      redirect_to new_log_path
    end
  end
end