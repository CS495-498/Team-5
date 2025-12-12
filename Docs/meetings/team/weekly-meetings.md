# Team 5 – Weekly Meeting Notes

## Week 1 Meeting Notes
**Team Roles:**
- Scrum Master: Zach S  
- Developer: Brian  
- Designer: Andrew  
- Project Manager: Krista  
- Team Communicator: Oye  
- QA/Debugging: Zach B  

**Meeting Updates:**
1. Weekly meetings set for Tuesday & Friday @ 6:00 PM.
2. Assigned Issues:
   - **Issue 1 (Docs Structure)** – Assigned to Zach S  
   - **Issue 2 (API Call Error)** – Assigned to Zach B  
   - **Issue 3 (Syntax Errors)** – Assigned to Oye  
   - **Issue 4 (Project Proposal)** – Assigned to Krista  
   - **Issue 5 (UI Bugs)** – Assigned to Brian  
   - **Issue 6 (Stats Not Displaying)** – Assigned to Andrew   

---

## Week 2 Meeting Notes
Same roles as Week 1.

**Updates:**
1. Mentor: Steve Huss Lederman  
2. Meeting times available:  
   - Tuesday 4 PM  
   - Wednesday 12 PM  
   - Friday 12 PM  
3. Project goals:  
   - Improve OED security (main focus)  
   - Implement preferred units feature  
4. Discussion points:
   - Understanding OED system  
   - MFA, permissions, backups, user roles  
   - Preferred unit feature requirements  

**Assigned Tasks:**  
- Complete active issues  
- Penetration test review  
- Address penetration test results  
- Validate security fixes (Oye)  
- Implement security system  

---

## Week 3 Meeting Notes
Same team roles.

**Security Issues Identified (19 items):**
Examples:
- Insufficient access controls  
- XSS  
- Insecure Docker configuration  
- Missing Content Security Policy  
- Undocumented DB user with hard-coded password  
- Known vulnerabilities in software components  
…and more.

**Plan:**
- Everyone install OED locally  
- Review Problem Reports 1, 6, and 3  
- Understand penetration test data  
- Assign tasks based on findings  

---

## Week 4 Meeting Notes

**Presentation Review:**
- Each member created and presented 2 slides  
- Presentation overall went well  
- Improvements:
  - Better shared plan for presentation flow  
  - Avoid repeated details  
  - Normalize fonts, sizes, and slide structure  

**Next Steps:**
- Discuss suggestions and questions from the class with Steve  
- Decide which extra ideas/features actually fit OED and our timeline  

---

## Week 5 Meeting Notes

**Diagram Updates:**
- Cleaned up and restructured the class diagram  
- Added middleware authenticator  
- Changed “access” to “response” to match goals  
- Put routes into their own class  

**Epic Progress:**
- Completed user story for collecting penetration documentation  
- Reviewed security risks in penetration reports  
- Started reviewing older PRs and their fixes  
- Learning tools like ExpressJS, Mocha, and Chai  

**Challenges:**
- Unfamiliar tools and testing frameworks  
- Time spent getting comfortable with OED’s tech stack  

---

## Week 6 Meeting Notes

- Check in and making sure everyone have DOCKER, OED running on their system
- We spoke and exchange idea and see how motivated and happy working on OED

---

## Week 7 Meeting Notes

**Progress Overview:**
- Main goal: fix most of the 19 security issues in OED  
- Plan is to complete about half this semester (Issues 1–9)  

**Status:**
- Issues 1 & 3: Reviewed, planned, implemented, and tested  
- Issue 2: In implementation  
- Issue 4: In review  

**Challenges:**
- Environmental and setup issues  
- New technologies for most of the team  
- Need to increase speed to meet goals  

**Plan by Week:**
- Week 1 → Complete Issue 2  
- Week 2 → Complete Issues 4 & 5  
- Week 3 → Complete Issue 6 & start Issue 7  
- Week 4 → Complete Issues 7 & 8  
- Week 5 → Complete Issue 9 & prepare final presentation  

---

## Week 8 Meeting Notes

**Questions Raised:**
- Error when running tests in OED  
- “beforeEach” errors while running tests  
- Running tests inside the web container  
- How to get OED instance to show in BurpSuite  
- Which routes need to be fixed for Problem Report 1  
- How to systematically test all routes and their permissions  

**Notes / Ideas:**
- Use config file listing routes and allowed roles  
- Create tests where only admins should pass; others fail  
- Use curl and sample data scripts to test reading/meter routes  
- Every route should be tested for proper auth, not just a few  

**Tasks:**
- Generate config file with all routes + roles in JSON  
- Review existing tests and draft a mock test for Steve to review  
- Look at login files and how they interact with users  

---

## Week 9 Meeting Notes

**Feedback on Class Activity (Bingo Review):**
- Fun and helpful way to review class concepts  
- Team enjoyed the format and motivation  
- Rules were a bit unclear (who fills which rows, what counts as correct)  
- Question difficulty varied a lot  

**Assignment 4 Reflection:**
- ER diagram part was straightforward  
- Swagger was new and required learning  
- Still getting used to Postman and its features  
- More in-class examples or resources would make tasks clearer  

---