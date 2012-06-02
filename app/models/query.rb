class Query < ActiveRecord::Base
  scope :last_ten, :limit => 10, :order => 'created_at DESC'
end
