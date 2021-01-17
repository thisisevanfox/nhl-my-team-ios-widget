# Changelog
## v3
### New features:
- Added current division and league standings to widget
- Implemented 2x2 widget, which only shows the next opponent with W-L-OTL stats, standings and top scorer and the W-L-OTL stats, standings and top scorer of your team
- If the livescore feature (came with v2) is activated, the top row shows current period and time remaining
- Added a setting to the top of the script to hide als stats and scores for those who don't want to be spoilered through widget. Currently stats and livescores are enabled, see the [FAQs](https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/FAQ.md#i-dont-want-to-be-spoilered-how-to-disable-livescores-and-w-l-otl-stats-standings-and-top-scorer) to find out how to disable them.
- When accidentally a large size widget is added to the homescreen the user will be prompted that only small and medium sized widgets are supported.
### Bugfixes:
- I noticed that the update of W-L-OTL stats takes a long time, so I changed the API endpoint where this data is fetched.
### Minor fixes:
- Updated the logo of Buffalo Sabres.
- Updated livescore: When game has not started yet, it displays "-" instead of "0"

## v2
### New features:
- Added livescores. Livescores are enabled by default. See [FAQs](https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/FAQ.md#i-dont-want-to-be-spoilered-how-to-disable-livescores-and-w-l-otl-stats-standings-and-top-scorer) to disable them. "Live" depends on how often the widget on the homescreen updates itself. It is not possible to say exactly, when it updates.
- Added link to NHL app when clicking the widget. To disable it please check the [FAQs](https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/FAQ.md#how-to-disable-link-to-nhl-app).
### Bugfixes:
- Games in european timezones start after midnight. To have the next game displayed properly, we have to calculate back the beginning (-6 hours)
- Error handling when API isn't reachable
### Minor fixes:
- Display of stats is now: W-L-OTL
- Venue of game is displayed with "@" instead of "-"

## v1    
-   Shows date and time of next game (local timezone)
-   Shows city where the next game takes place
-   Shows stats of both teams (wins, overtime wins, losses)
-   Shows top scorer of your team and the opponent (currently of last season, it will update after the first game)
-   Shows next 4 games with date
-   Caches logos to save data volume.
-   Supports light- and dark-mode
-   Supports [no-background.js](https://github.com/supermamon/scriptable-no-background)
