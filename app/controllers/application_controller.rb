require 'net/http'

class ApplicationController < ActionController::Base
  # protect_from_forgery
  # force_ssl
  
  # after_filter :set_access_control_headers
  # def set_access_control_headers 
  #   headers['Access-Control-Allow-Origin'] = '*' 
  #   headers['Access-Control-Request-Method'] = '*' 
  # end
  
  private
  
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  
  helper_method :current_user
  
  def logged_in?
    current_user.present? ? true : false
  end
  helper_method :logged_in?
  
end