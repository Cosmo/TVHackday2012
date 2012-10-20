class LogsController < ApplicationController
  def index
    @logs = Log.scoped
  end
  
  def create
    @log = Log.new(user_id: current_user.id, body: params[:body])
    if params[:time].present?
      @log.at = params[:time]
    else
      @log.at = Time.now
    end
    if @log.save
      logger.info "awesome, #{current_user.email} tagged a video at #{@log.at}"
    end
  end
end
