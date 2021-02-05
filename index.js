const axios = require('axios').default;
const Discord = require('discord.js')
require('dotenv').config()
const API_KEY = process.env.API_KEY
const TOKEN = process.env.TOKEN

const { Client, MessageEmbed } = require('discord.js');

const client = new Client();
const prefix = '!';

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
    let profileJson = {};
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const version = await getLatestVersion();
    if(command === 'rank') {
        try{
            const data = await getSummonerData(args);
            try{
                const stats = await getRankStats(data.id)
                
                const soloQ = stats.filter(queue => queue.queueType === "RANKED_SOLO_5x5")[0]
                const flexQ = stats.filter(queue => queue.queueType === "RANKED_FLEX_SR")[0]

                const queue = !soloQ ? flexQ : soloQ


                const embeddedMsg = new Discord.MessageEmbed()
                    .setColor('#9831a3')
                    .setTitle(data.name)
                    .setDescription(`Summoner Level: ${data.summonerLevel}`)
                    .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.profileIconId}.png`)
                    .addFields(
                        { 
                            name: `${!soloQ ? "Flex 5v5": "Solo/Duo"}`, value:`${queue.tier} ${queue.rank}\n${queue.leaguePoints} LP / ${queue.wins}W ${queue.losses}L
                            Win Ratio ${Math.round(queue.wins/(queue.wins + queue.losses) * 100)}%`
                        }
                        
                    )
                    .attachFiles([`./img/ranked-emblems/Emblem_${queue.tier.toLowerCase()}.png`])
                    .setImage(`attachment://Emblem_${queue.tier.toLowerCase()}.png`)
                    .setFooter( soloQ ?
                                `Flex 5v5\n${flexQ.tier} ${flexQ.rank}\n${flexQ.leaguePoints} LP / ${flexQ.wins}W ${flexQ.losses}L\nWin Ratio ${Math.round(flexQ.wins/(flexQ.wins + flexQ.losses) * 100)}%` : '', 
                                `https://opgg-static.akamaized.net/images/medals/${flexQ.tier}_1.png?image=q_auto:best&v=1`
                    )
                    
                    message.channel.send(embeddedMsg)
                    .then(msg => {
                        msg.delete({ timeout: 20000})
                    })
                    .catch(e => console.log(e))
                
            } catch (e) {
                const embeddedMsg = new Discord.MessageEmbed()
                    .setColor('#9831a3')
                    .setTitle(data.name)
                    .setDescription(`Summoner Level: ${data.summonerLevel}`)
                    .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.profileIconId}.png`)
                    .addField('Summoner is Unranked', ' .·´¯`(>▂<)´¯`·. ')
                    
                message.channel.send(embeddedMsg)
                .then(msg => {
                    msg.delete({ timeout: 20000})
                })
                .catch(e => console.log(e)) 
                    
                
            }

        } catch (e) {
            if(e.response.status === 404){
                const embeddedMsg = new Discord.MessageEmbed()
                .setColor('#9831a3')
                .setTitle('Summoner not found')
    
                message.channel.send(embeddedMsg)
                .then(msg => {
                    msg.delete({ timeout: 5000})
                })
                .catch(e => console.log(e))
            } else {console.error(e)}
        } finally {
            message.delete({timeout: 5000})
        }
        
    }

});

const getSummonerData = async (name) => {
    const summoner = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${API_KEY}`)
    return summoner.data
}

const getRankStats = async (ID) => {
    const res = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${ID}?api_key=${API_KEY}`)
    return res.data
}

const getLatestVersion = async () => {
    const version = (await axios.get('http://ddragon.leagueoflegends.com/api/versions.json')).data[0]
    return version;
}


// login to Discord with your app's token
client.login(TOKEN);