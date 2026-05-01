## Overview

This document summarizes the vulnerabilities identified during testing and the corresponding remediation work.

## Summary

A total of security issues have been identified and are being addressed across multiple areas of the system, including authentication, input validation, configuration, and logging.

## Remediation List

#### ***Problem Report 1: Insufficient Access Control \- Andrew***

PR: Broken, New 1594, Andrew working on PR comments \- plans to finish by 4/20.  
Status: Address outstanding comments  
Additional Libraries:  
Andrew cannot finish so proposing to change to draft for future work, Andrew would like to continue after the semester. Did about half of the comments; will commit/push what has. Steve proposed to also add issue and assign to Andrew for now \- Steve should do.

#### ***Problem Report 2: Insecure Default Configuration \- Zach S.***

PR: 1554  
Status: ~~Address outstanding comments in the current PR~~/Awaiting review; Additional Libraries:  
Will do last comment and then needs testing once development startup works. Could continue if sooner for any other changes.  
Plans to finish soon.

PR 1615 added a second docker file to avoid accidentally using development values in production.   
Status: 4/24 review: generally okay but asked if I could make some basic changes to it.  
Changes with only 2 comments to consider 4/26  
4/29: Looks good. I made some updates for Zack to review. I left a comment about one item.  
Once okay, this needs to wait for the OED startup issue to resolve to be tested/merged.  
Zack will finish up soon.

#### ***Problem Report 3: Cross-Site Scripting (XSS) \- Zach B.***

PR: Broken 1544, New 1591  
Status: Address outstanding comments  
Additional Libraries: DOMPurify, jsdom  
Needs to finish up with recent comments and be done by Wednesday night. Could look at new comments and will see. What if there was a flag or new parameter on success and failure that defaults to sanitize. limited cases do not get sanitized where the output is not on a regular page and is safe.

#### ***Problem Report 4: Insecure Docker Config \- Oye***

PR: 1606  
Status: Under Development by Oye  
Notes: Review Cyprus PR, test various proposed options to find a working solution. Discuss different credential managers in a design document.  
Additional Libraries:  
Recently addressed comment and pushed. Need to do 3 steps to fix since changing Docker version. Seems really added runtime user to web Docker config.  
Ready for me to look at again to verify.  
Seems okay but asked Oye about first-time steps so can facilitate transition when this is done.  
Once okay, this needs to wait for the OED startup issue to resolve to be tested/merged. Plans to finish up soon.

#### ***Problem Report 5: Undocumented Database User with Hard-Coded Password \- Zach S.***

PR: draft 1609  
Status: ~~Under development by Zach S.,~~ Self-hosting the vault implementation for testing   
Notes: Looking into a secure vault. Design document if unable to complete. Look into hashicorp.  
Additional Libraries:  
Has now updated so only changes for this PR. On top of PR 1554 since uses that too so that must clear first. Will add docs to regular place with PR.  
Reviewed 4/21 with comments; reviewed 4/23 where only need dev doc and link.  
Design doc now merged so complete.

#### ***Problem Report 6: Missing Content Security Policy \- Brian***

PR: 1567  
Status: ~~1\. Resolve small comments, Resolve merge conflict, Feb 2\. Comment Security content messages show up/unnecessary issues appearing in the terminal.~~ Brian is moving forward and hopes to update in the coming days.   
Additional Libraries:  
Has updated and push but needs some more work. Will finish up within next week.  
Saw  commit 4/27 but unsure status. Not yet ready. Working on merge and then hopefully comments. Unsure when may get to it but hopefully soon.

#### ***Problem Report 7: Known Vulnerabilities \- Software Components \- Andrew***

PR: Not Planned  
Status: ~~docker file needs to be sent to steve for version compatibility.~~ Send Steve status of attempts. Andrew sent information and Steve asked for clarification. Did respond and Steve needs to look at more but done for Andrew.  
I looked at this and did the upgrade on a fresh clone. Except for patching for the known DB startup issue, there were no problems.  
Additional Libraries:

#### ***Problem Report 8: Insufficient Input Validation \- Brian***

PR: 1528  
Status: Completed and Merged  
Additional Libraries:

#### ***Problem Report 9: File Upload Denial of Service \- Krista*** 

PR: 1587  
Status: ~~Address outstanding comments. (1.5 week old)~~, Update branch for review very soon. Missing at last meeting so uncertain.  
Additional Libraries:  
Status uncertain because not on last call.

#### ***Problem Report 10: Insecure Password Authentication \- Zach B.***

PR: 1611  
Status: ~~Reviewing the zxcvbn library, Under development and testing integration into OED~~, ~~Awaiting Review,~~ Address outstanding comments  
Notes: Make it so it only allows up to the 72 limit and make it a separate issue. Investigate issues concerning the zxcvbn  
Additional Libraries: zxcvbn  
Review 4/22 with comments  
Address outstanding comments, Steve will decide about current passwords (SHA, Message, Forced password reset, Next release add a timestamp for password creation, Set time during migration to be in the past)

#### ***Problem Report 11: Insufficient Session Expiration \- Oye***

PR: 1593  
Status: PR 1593: ~~Reviewed, needs comments addressed~~. Updated and ready for review.  
Additional Libraries:  
**Dropped from call so uncertain.** After call Steve looked and there are some comments that still need to be addressed. There is also a recent commit that may relate to a different PR so unsure if it is now a clean branch.  
Reviewed 4/21 with new comments. Indicated will not review again nor do final testing until all comments have a comment in return.  
Partial review 4/24 that was stopped due to issues with the changes.  
There are also merge conflicts now.  
Oye should update steve via email or document on what the plan is currently.

#### ***Problem Report 12: Insufficient Brute Force Protection \- Zach Bates*** 

PR: 1605  
Status: ~~Awaiting Review,~~ ~~Ready for 2nd Review~~, Address outstanding comments  
Notes: 2 tests that run under npm run test one with the limit and one without  
Address comments, look into current failing test returning a 404  
Additional Libraries:

#### ***Problem Report 13: Valid User Enumeration \- Andrew***

PR: 1599  
Status: Address outstanding comments  
Additional Libraries:  
Done but needs to commit/push. Expect by Tuesday.  
Reviewed 4/21; comments not resolved so needs to address. Plans to resolve current comments

#### ***Problem Report 14: Information Disclosure \- Zach S.***

PR: Draft 1580, New PR 1604  
Status: Under development by Zach S.; needs to fix up issues with PR; Awaiting Review, new review so needs to address  
Additional Libraries:  
Plans to do by Tuesday. Now merged and done.

#### ***Problem Report 15: Clickjacking (UI Redress) \- Oye***

PR: 1595 replaced for future work by issue   
Status: Solution rejected, concerned about the constraints around the get pages. Can either fix (seems unlikely given what needed/time or document what needs to be done & convert to draft for future team. PR closed.  
Additional Libraries:  
**Dropped from call so uncertain.** After call Steve looked and PR 1595 is closed and issue 1601 was opened to address this.

#### ***Problem Report 16: Log Injection  \- Zach B.***

PR: 1590  
Status: ~~Reviewed~~, address outstanding comments   
PR 1617, comment out two lines.   
Plans to address comments  
Additional Libraries: N/A

#### ***Problem Report 17: Session Tokens Stored in Local Storage \- Krista***

PR:   
Status: Testing solution, PR soon  
Additional Libraries:  
Not on call so uncertain.

#### ***Problem Report 18: Incorrect HTTP Response Codes \- Andrew***

PR: 1598  
Status: Awaiting full review, another team has been working alongside this issue and should be merged and unchanged. Comment and turn it into a draft if unable to complete.   
Additional Libraries:  
Need to change to draft. Steve should open issue to continue.

#### ***Problem Report 19: Business Logic Issues \- Brian*** 

PR: 1603  
Status: ~~Under development, trouble creating pull requests~~, Awaiting Review, review in  
Additional Libraries:  
Will address two comments that more straightforward. Someone else needs to get the min/max/date throughout code. Will convert to draft and open issue.  
Issue was opened but comments in draft PR unaddressed.  
Leaving as Draft, needs picked up by someone else

## Implementation Notes

Fixes were validated through:

* Automated testing  
* CI/CD pipeline checks  
* Manual verification where necessary

\*Make sure that the OED team repos will continue to live for an indefinite period and Steve will have access rights to it

