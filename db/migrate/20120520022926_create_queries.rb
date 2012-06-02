class CreateQueries < ActiveRecord::Migration
  def change
    create_table :queries do |t|
      t.string :input
      t.string :response
      t.string :source

      t.timestamps
    end
  end
end
