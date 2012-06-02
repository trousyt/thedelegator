require "rexml/document"

class WolframAPI
  require 'typhoeus'
  
  class QueryError < RuntimeError; end
  class StoreError < RuntimeError; end
    
  # Accepts input and calls the Wolfram API with that input
  # returns The response from the Wolfram API
  def self.submit(input, source)
    
    # Construct a pretty string with no space encoding
    # Rails automatically removes the %20 encoding on params
    pretty_input = input.gsub(/\+/, ' ')
    
    # Remove any spaces or pluses from the URL we'll send to the Wolfram API
    input.gsub!(/(\s|\+)/, '%20')
    
    # Properly construct the request URL
    url = construct_url(input)
    
    # Create an array for us to hold the releveant results in
    elements = []
    
    begin
      # Send the input to the Wolfram API via typhoeus
      #raise Exception if !Request.get
      response = Typhoeus::Request.get(url)
      
      # Find the image elements only and put them into an array
      xml = REXML::Document.new(response.body)
      xml.elements.each('/queryresult/pod/subpod/img') do |e|
        elements << e
      end
      
      # If nothing returned, use a default 'no response' answer.
      if elements.count == 0
        elements << 'Sorry, but apparently Wolfram has nothing to say about that...'
      end
    
      begin
        # Store the request and it's response.
        Query.create(:input => pretty_input, :response => elements.join, :source => source)
      rescue Exception => e
        raise StoreError, "There was an error storing the submission."
      end
      
    rescue Exception => e
      raise QueryError, "There was an error processing the submission at URL '#{url}': #{e.message}"
    end
    
    return elements
    
  end
  
  private
  def self.construct_url(input, format='image')
    "#{AppSettings.instance.wolfram['base_api_url']}?input=#{input}&format=#{format}&appid=#{AppSettings.instance.wolfram['app_id']}"
  end
  
end