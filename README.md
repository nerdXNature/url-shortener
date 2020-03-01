# URL Shortener

I made this URL shortener for a few reasons

 1. I wanted to work on a quick side-project
 2. I wanted to make a URL shortener template that anyone could use and is free.

## Getting Started

Getting this URL shortener up and running is really easy!

### Prerequisites

 - GitHub Account
 - Heroku Account

### Installing

Installing and running the URL shortener is really simple.

 1. Start by forking this repository.
 2. Go to heroku.com and login.
 3. Once logged in press __New__, and then click __Create new app__.
 4. Pick a name for your project and then press __Create app__.
 5. Go to __Settings__, and click __Reveal Config Vars__.
 6. Now you are going to create a few Config Variables:
	 - Variable named __SSL__ which, if you are using the normal herokuapp.com domian, or have SSL on your own domain, will have a value of __TRUE__. If you are using your own domain and do not have SSL, set this to __FALSE__.
	 - Variable named __PORT__ which, unless you would like it to run on a different port, will be set to __80__.
	 - Variable named __SHORT_DOMAIN__. If you are not adding your own domain this will be __*\<Your-App-Name>*.herokuapp.com__. If you are using a custom domain, enter that here. Make sure not to add *http://* or *https://* before, and to remove anything after the TLD.
	 - One last variable called __NAME__. Set this variable to whatever you would like to call your URL Shortner.
7. Now you can head over to the __Overview__ tab.
8. Click on __Configure Add-ons__.
9. In the search box type __*Heroku Postgres*__, and click on it.
10. Then click __Provision__.
11. Now we can head over to the __Deploy__ tab, and click on __GitHub__.
12. If you are not already, login with GitHub. In the repository search box type __*url-shortener*__ and press __Connect__.
13. Then deploy your app. That's it. You did it!

## Author

* **Daniel Stoiber** - [GitHub](https://github.com/nerdXNature)