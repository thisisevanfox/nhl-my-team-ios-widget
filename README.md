
# "NHL-MyTeam" Scriptable iOS widget  🏒
I created a widget for iOS and the [Scriptable.app](https://scriptable.app/) to always see on the homescreen of my iPhone when the next games are up for my favorite NHL team.

## Table of Content

1.  [Features](https://github.com/thisisevanfox/nhl-my-team-ios-widget#features-) 💡
2.  [Getting started with the widget](https://github.com/thisisevanfox/nhl-my-team-ios-widget#getting-started-with-the-widget-) 🚀
3.  [Register for updates](https://github.com/thisisevanfox/nhl-my-team-ios-widget#register-for-updates-) 📥
4.  [Frequently Asked Questions (FAQs)](https://github.com/thisisevanfox/nhl-my-team-ios-widget#frequently-asked-questions-faqs-) ❓
5. [Support the project](https://github.com/thisisevanfox/nhl-my-team-ios-widget#support-the-project-) 💪
6. [Bugs](https://github.com/thisisevanfox/nhl-my-team-ios-widget#bugs-) 🐞
7. [References](https://github.com/thisisevanfox/nhl-my-team-ios-widget#references-) 🏆

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

You want to have more information on the releases? Check the [changelog](https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/Changelog.md).

## Getting started with the widget 🚀
1. Download Scriptable from the AppStore. Click [here](https://apps.apple.com/us/app/scriptable/id1405459188?uo=4) to get to AppStore.
2. Click the "+"-Icon in the Scriptable-app.
3. Copy all the text from the NHL-MyTeam-Widget.js-file. Click [here](https://raw.githubusercontent.com/thisisevanfox/nhl-my-team-ios-widget/main/NHL-MyTeam-Widget.js) to get to the file.
4. Step through the user settings in the script.
5. Add a Scriptable-widget to your homescreen.
   * Add it with size "medium".
   * Make sure to choose "Run script" for "When Interacting".
   
## Register for updates 📥
Don't want to miss a update for this widget? Just head over to [this](https://forms.gle/4SBmYLcVgzFak7SZ9) GoogleForm, type your email address and I'll send you an email when a new update is released.
   
## Frequently Asked Questions (FAQs) ❓
All Frequently Asked Question are collected [here](https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/FAQ.md).

## Support the project 💪
As some users asked how to donate to the project I created this section:

Of course I won't take anything for the widget, but if you really want to donate, feel free to buy me a coffee via paypal.

<p align="center">
<a href="http://paypal.me/thisisevanfox" target="_blank"><img src="https://camo.githubusercontent.com/74865d9b3ad7b0a216f64653cee3d2027790220fb7b0302cf693e5a9e7c20c7a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f70617970616c2d646f6e6174652d79656c6c6f772e737667" alt="Donate via Paypal" border="0" /></a>
</p>  

## Bugs 🐞
Found a bug? Feel free to create a issue.

## References 🏆
I used the publicly accessible NHL api which is documented by  [dword4](https://gitlab.com/dword4/nhlapi). The logos are taken from [thesportsdb.com](https://thesportsdb.com). 
