use scrumi;

db.objectives.update({"task_name": "Server Read Objectives"}, {"$set": {"assigned_to":"John", "project":"Scrum", "duration":"1 day", "percent_complete": "25%", "finish": new Date("2017-01-10"), "status":"uno", "comments": "Use Angular" } });

db.objectives.update({"task_name": "Filters and Sorting of Objectives Screen"}, {"$set":{"assigned_to":"Jani", "project":"Scrumi", "duration": "2 days", "percent_complete": "50%", "finish": new Date("2017-01-13"), "status": "dos", "comments": "Use a screwdriver"}});

db.objectives.update({"task_name": "Token-Based Authentication"}, {"$set": {"assigned_to": "Janardhan", "project":"Scrumardhan", "duration": "3 days", "percent_complete": "75%", "finish": new Date("2017-01-14"), "status": "tres", "comments": "use JWT"}});
