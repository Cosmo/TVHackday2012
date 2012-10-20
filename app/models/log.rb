class Log < ActiveRecord::Base
  belongs_to :user
  attr_accessible :at, :body
end
