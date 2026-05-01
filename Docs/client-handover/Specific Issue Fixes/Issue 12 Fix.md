Chosen remediation step: 1

Core Solution Idea: 

For each user account, track:

* Number of consecutive failed attempts  
* The timestamp of the last attempt  
* Calculate a delay


For each failed attempt:

* Increase the delay  
* Add randomness to prevent a timing attack  
* Cap the delay


After x amount of time, reset the attempts

In the database store the failed attempts (int) and the last attempts (timestamp) for each user  
With this we potentially introduce a timing vulnerability, so we have to add a random jitter to mitigate a timing attack. 

X will be the window reset or the time after unsuccessful attempts that allows for more attempts

Pseudocode

Function handleLogin(userId, password):  
	Now \= currentTime.Millis  
	  
	Record \= getLoginRecord(userId)  
		If record does not exist:  
			Record.failedattempts \= 0   
			Record.lastattempt \= null  
// Reset   
    		if record.lastAttemptAt \!= null and  
      			now \- record.lastAttemptAt \> RESET\_WINDOW\_MS:  
        			record.failedAttempts \= 0  
    // Calculate delay  
    		baseDelay \= BASE\_DELAY\_MS \* (2 ^ record.failedAttempts)  
   		cappedDelay \= min(baseDelay, MAX\_DELAY\_MS)

    // Add randomness  
   		 jitter \= random(0, JITTER\_MS)  
    		finalDelay \= cappedDelay \+ jitter

    // Apply delay   
    		sleep(finalDelay)

// Attempt log in  
    		if passwordIsInvalid(userId, password):  
        			record.failedAttempts \+= 1  
        			record.lastAttemptAt \= now  
        			saveLoginRecord(userId, record)  
        			return AUTH\_FAILED

    // Successful login  
    		record.failedAttempts \= 0  
   		record.lastAttemptAt \= null  
    		saveLoginRecord(userId, record)

\*The mentor liked the solution and agreed that it may solve the problem but for now wants to focus on a simple solution. This solution focuses on limiting the rate of request for the login route

Notes:  
Every route rate limit is specifically specified in [app.js](http://app.js), according to the code it appears to use the general limiter of 200 requests per 5 seconds and 144,000 requests/hour. Steve wants it down to 900\.

A similar rate limit is used in the RawLimited of 5 requests per 5 seconds. 

Pseudo code:  
Const loginLimiter \= rateLimit  
	Windows: 4\*1000  
	Limit: 1  
App.use (.../[login.js](http://login.js), loginLimiter)

