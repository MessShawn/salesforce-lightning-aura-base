({
	call: function (component, event, helper) {
        const { action, isResolveSerializedData } = event.getParam('arguments');

		return new Promise(function (resolve, reject) {
			action.setCallback(this, function(response) {
				const responseState = response.getState();
				
				if (responseState === 'SUCCESS') {
                    const res = response.getReturnValue();
                    
                    let data = res.data;

                    // This approach is to avoid the Lightning create proxy for returned data 
                    // which has huge performance issue when dealing with large amount of data,
                    // as Lightning won't create proxy for string data, therefore, this provides an option for the client
                    // service to get better performance.
                    // use '=== true' cause type of the default value is not boolean value but a string 'false'
                    if (isResolveSerializedData === true) {
                        data = JSON.stringify(data);
                    }

					res.success && resolve(data);
					
					const errorContent = [{
						message: res.message, 
						error: res.error
					}];
					!res.success && reject(errorContent);
				} else {
					reject(response.getError());
				}
			});
	
			$A.enqueueAction(action);
		});
	}
})