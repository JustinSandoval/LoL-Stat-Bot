# LoL-Stat-Bot
League of Legends bot for Discord which makes calls to the League of Legends API to access player stats

# Requirements
<li>You must have a Riot Games account and register on developer.riotgames.com in order to use their API</li>
<li>You must have a Discord account and register on discord.com/developers</li>
<li>You must be able to host your server somewhere i.e. Heroku</li>

## Installation
Based on if the assumptions are met: 
Git clone repo then <code>npm install</code>
### Discord
1. Login to your account on discord.com/developers and click 'New Application'. Give your app a name (will be used for bot's name)
2. Click 'Bot' in the pane then click 'Add Bot'
3. Click the 'Copy' button under 'Token'. This will be used as a config var value for Heroku (name it <b>TOKEN</b> as the key)
### Riot games
1. Head over to your Riot Games account and copy the 24-hour API key that Riot has provided you
2. Use API key as the second config var value in Heroku (name it <b>API_KEY</b>)
### Heroku
1. Go to 'Resources' tab and make sure the 'worker' one is turned on (procfile is included)
2. Go to 'Settings' tab and under 'Config Vars' click 'Reveal Config Vars' and input the above API key and Disocrd token
3. Deploy on heroku and bot should appear on your discord server

## Using the Bot
Only one command is implemented so far, more to come soon!
<br>
<code>!rank</code> <summoner name> - this will give stats for the summoner (<b><ins>Dont put spaces in name!</ins></b>)

![sample of working bot](https://i.imgur.com/3uigWg1.png)
