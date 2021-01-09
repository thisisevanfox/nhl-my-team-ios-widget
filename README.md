# "NHL-MyTeam" Scriptable iOS widget  🏒
## Features 💡      
<p align="center">
<a href="https://i.ibb.co/FJBk6Xj/Nhl-My-Team-Screenshot-Big.png"><img src="https://i.ibb.co/0yMQLLZ/Nhl-My-Team-Screenshot-Small.png" alt="Widget supports light- and dark-mode" border="0" /></a>
</p>  
                                                                    
* Shows date and time of next game (local timezone)
* Shows city where the next game takes place
* Show live score of next game. "Live" depends on how often the widget on the homescreen updates itself. It is not possible to say exactly, when it updates.
* Shows stats of both teams (wins, losses, overtime losses)
* Shows top scorer of your team and the opponent (currently of last season, it will update after the first game)
* Shows next 4 games with date
* Caches logos to save data volume.
* Supports light- and dark-mode
* Supports [no-background.js](https://github.com/supermamon/scriptable-no-background)

Note: I don't know how the api displays the games when it comes to playoffs. I'll have to check again when the season is at this point.

## Getting started with the widget 🚀
1. Download Scriptable from the AppStore. Click [here](https://apps.apple.com/us/app/scriptable/id1405459188?uo=4) to get to AppStore.
2. Click the "+"-Icon in the Scriptable-app.
3. Copy all the text from the NHL-MyTeam-Widget.js-file. Click [here](https://raw.githubusercontent.com/thisisevanfox/nhl-my-team-ios-widget/main/NHL-MyTeam-Widget.js) to get to the file.
4. Step through the user settings in the script.
5. Add a Scriptable-widget to your homescreen.
   * Add it with size "medium".
   * Make sure to choose "Run script" for "When Interacting".
   
## Register for updates
Don't want to miss a update for this widget? Just head over to [this](https://forms.gle/4SBmYLcVgzFak7SZ9) GoogleForm, type your e-Mail adress and I'll send you an e-Mail when a new update is released.
   
## Frequently Asked Questions (FAQs)
All Frequently Asked Question are collected [here](https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/FAQ.md).

## Known bugs 🐞
* Top and bottom banners being off center. (Device: XS Max) [Screenshot](https://imgur.com/gallery/fvhmnew)

Find another bug? Feel free to create a issue.

## References 🏆
I used the publicly accessible NHL api which is documented by  [dword4](https://gitlab.com/dword4/nhlapi). The logos are taken from [thesportsdb.com](https://thesportsdb.com). 
