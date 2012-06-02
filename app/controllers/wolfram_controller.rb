class WolframController < ApplicationController  
  
  # GET wolfram
  def index
    # Get the last 10 queries
    @last_ten = Query.last_ten
  end
  
  # GET wolfram/query
  # Accepts input through the query string and returns the result retrieved from Wolfram.
  def query
    # Get the query and validate
    input = params[:input]
    
    # Validate the input
    # Validation code here
    
    begin
      # Run the input through the Wolfram API
      @elements = WolframAPI.submit(input, 'Web')
      
     rescue Exception => e
      # Handle the error
      # Log the error and exit the query method
      render :text => "#{e.message}; #{e.backtrace}"
      return
    end
    
    render :layout => false
  end
  
  # GET wolfram/last_ten
  # Retrieves the last 10 queries and results.
  def last_ten
    @last_ten = Query.last_ten
    render :layout => false
  end
  
end
