class AddTimestampToLogs < ActiveRecord::Migration
  def change
    add_column :logs, :timestamp, :integer
  end
end
