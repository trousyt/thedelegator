// Create a scope for our query methods.
var QueryMe = QueryMe || {
	// DEFAULT_OPTIONS
	input_element: '#input',
	submit_element: '#submit',
	response_element: '#response',
	status_element: '#status',
	notice_element: '#notice',
	has_run: false,
	
	// QUERY--
	query: function(input) {
		
		// Validate the string isn't empty.
		if (input == '') {
			console.log('QueryMe: #Error: Input is empty.')
			if ($(this.notice_element).length) {
				this.show_notice('<div><strong>Not so fast!</strong> You\'ve got to search for <em>something</em>!</div>', 'error');
			}
		} 
		else  {
			// Hide the error element if it's showing.
			$(this.notice_element).addClass('noshow');
			
			// Replace any spaces with the plus symbol.
			input = input.replace(/\s/g, '+');
			
			// Start the AJAX request
			// Show the loading glyph
			$(this.status_element).html('<img src="/images/loader.gif" alt="Loading" height="16" width="16" />');
			
			console.log('QueryMe: Starting AJAX request to URL /wolfram/query/' + input);
			if (this.has_run) $(this.response_element).fadeOut('slow');		// Run the fadeout if necessary
			
			// Setup a working notice.
			this.show_notice('<div><strong>Hold tight!</strong> We\'re running the numbers...');
			
			// Run AJAX.load
			var that = this;
			$(this.response_element).load('/wolfram/query/' + input, function(response, status, xhr) {
				// Fade in the new result and stop the loading glyph
				if (that.has_run) { $(that.response_element).fadeIn('slow'); }
				$(that.status_element).html('');
				
				if (status == 'success') {
					that.has_run = true;
					
					// Show a success notice.
					that.show_notice('<strong>Voila!</strong> It was a pleasure to serve you.', 'success');
					
					// Get a new last-10 list.
					that.last_ten();
				}
			});
		}
	},
	
	// SHOW_NOTICE--
	show_notice: function(content, style) {
		var notice = $(this.notice_element);
		var style;
		
		// Logic to determine type of alert.
		switch(style) {
			case 'error': style = 'alert-error'; break;
			case 'success': style = 'alert-success'; break;
			default: style = 'alert-info';
		}
		
		// Remove all possible left-over styles.
		notice.removeClass('alert-error alert-info alert-success');
		
		// Set the classes and content.
		notice.addClass(style);
		notice.removeClass('noshow');
		notice.html(content);
	},
	
	// HIDE_NOTICE--
	hide_notice: function() {
		notice.addClass('noshow');
	},
	
	// LAST_TEN--
	last_ten: function () {
		$('#last10-container').load('/wolfram/last_ten')
	},
	
	// INIT--
	init: function(options) {
		console.log('QueryMe: In initializer');
		
		// Override defaults with options.
		for (key in options) {
			if (this.hasOwnProperty(key)) {
				//console.log('QueryMe: Init\'d ' + key + ' with \'' + options[key] + '\'');
				this[key] = options[key];
			}
		}
		
		// Keep an instance of this for nested functions.
		var that = this;
		
		// Register handler with submit click.
		if ($(this.submit_element)) {
			console.log('QueryMe: Registering event handler for submit_element.click');
			
			//--
			$(this.submit_element).click(function()  {
				console.log('QueryMe: submit_element.click executing');
				
				if ($(that.input_element)) {
					// Execute the query method.
					that.query($(that.input_element).val());
				}
			});
		}

		// Register handler with ajaxError.
		$(this.response_element).ajaxError(function(ev, xhr, settings, error) {
			console.log('QueryMe: #Error: AJAX failed with error "' + error + '"');
		});
	}
};
