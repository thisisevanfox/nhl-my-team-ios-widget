
# Frequentley Asked Questions (FAQ)
### The widget doesn't show up properly on the homescreen.
Go to your homescreen, Click&Hold. Edit Homescreen. Right above there‘s a +. Click it. search Scriptable. Click it. Then you can swipe two times. The first option  is the small widget, when you swipe once you can add the medium one  (this is the one you need) and when swipe two times it's the big one. 

Does it say "Select script in widget configurator"? Then you have to "click & hold" -> "edit widget". Then choose for Script "NHL-MyTeam-Widget", for When Interacting "Run script".

### I get the following error: 'TypeError: undefined is not an object (evaluating 'oTeamData[MY_NHL_TEAM].id')”'      
Replace
```
const MY_NHL_TEAM = "ENTER_TEAM_ABBREVIATION_HERE";
```
with, e.g.
```
const MY_NHL_TEAM = "TOR";
```
if the Leafs are your team.

### no-background doesn't work
1. Make sure no-background.js is installed properly: Just copy [this](https://raw.githubusercontent.com/supermamon/scriptable-no-background/master/no-background.js) as a seperate script "no-background".

2. After that, make sure you changed the following line in the NHL script from
```
const NO_BACKGROUND_INSTALLED = false;
```
to
```
const NO_BACKGROUND_INSTALLED = true;
```

### How to set light- or dark-mode?
Search the line
```
const DARK_MODE = Device.isUsingDarkAppearance();
```
This is setting uses the system color scheme.

Write the following for having dark-mode activated:
```
const DARK_MODE = true;
```

Write the following for having light-mode activated:
```
const DARK_MODE = false;
```
### How to disable live-ticker?
Replace
```
const SHOW_LIVE_SCORES = true;
```
with
```
const SHOW_LIVE_SCORES = false;
```
### How to disable link to NHL app?
Replace
```
const WIDGET_URL = "nhl://";
```
with
```
const WIDGET_URL = "";
```
