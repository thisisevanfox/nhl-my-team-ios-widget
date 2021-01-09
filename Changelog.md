# Changelog
## v2
- New features:
			- Added livescores. Livescores are enabled by default. See [FAQs](https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/FAQ.md#how-to-disable-live-ticker) to disable them.
			- Added link to NHL app when clicking the widget. To disable it please check the [FAQs](https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/FAQ.md#how-to-disable-link-to-nhl-app).
- Bugfix:
			- Games in european timezones start after midnight. To have the next game displayed properly, we have to calculate back the beginning (-6 hours)
- Minor fixes:
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
