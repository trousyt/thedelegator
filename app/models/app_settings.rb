require 'singleton'

class AppSettings
  include Singleton
  
  def setting_exists?(key)
    return APP_CONFIG.include?(key)
  end
  
  def method_missing(m, *args, &block)
    if (!APP_CONFIG.include?(m.to_s))
      # Return some error
      return -1;
    else
      APP_CONFIG["#{m}"]
    end
  end
  
  def method_signature
    
  end
  
end