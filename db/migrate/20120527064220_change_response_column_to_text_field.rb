class ChangeResponseColumnToTextField < ActiveRecord::Migration
  def up
    change_column :queries, :response, :text
  end

  def down
  end
end
