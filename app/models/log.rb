class Log < ActiveRecord::Base
  belongs_to :user
  attr_accessible :at, :body, :timestamp
  
  def uid
    user.uid
  end
  
  def name
    user.name
  end
end
