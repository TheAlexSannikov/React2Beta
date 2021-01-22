Project completed for CS 639 - Building User Interfaces completed Fall 2020 at the University of Wisconsin - Madison. Made public with permission of course staff.
Author: Alex Sannikov + CS 639 staff for starter code.

Must be connected to University VPN for courses to load from the API.

Launching instructions:
     Clone repository
     execute command: `npm install`
     execute command: `npm audit fix`
     execute command: `npm start`
     Connect to University VPN (help: https://kb.wisc.edu/page.php?id=90370)

This is the final product of two assignments. 
Some code was provided from course staff as starting point. The following files were provided to me, though the files marked with a '+' are files with functionalities I have implemented previously, but I have decided to replace with the starter code for this project. 
     Much of App.js
     Course.js      +
     CourseArea.js  +
     index.js
     SearchAndFilter.js  +
     serviceWorker.js
     Sidebar.js
     Tag.js
     TagArea.js
     package.json

The following files were written by myself.
     Some of App.js
     PreviousCourse.js
     PreviousCourseArea.js
     RecommendedCourse.js
     RecommendedCourseArea.js

For this project, I added the complete addition of two tabs: 'Completed courses' and 'Recommended courses'. 
     The 'Completed courses' tab displays courses an imaginary student has complete. These courses can be given a rating which heavily influences which courses are recommended in the 'Recommended course' tab.
