const axios = require('axios').default;
const Discord = require('discord.js')
const config = require('dotenv').config()
const API_KEY = process.env.API_KEY

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
    
    if(command === 'rank') {
        try{
            const summoner = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${args}?api_key=${API_KEY}`)
            const data = summoner.data
            try{
                const getRankStats = async (ID) => {
                    const res = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${ID}?api_key=${API_KEY}`)
                    return res.data
                }

                const getLatestVersion = async () => {
                    const version = (await axios.get('http://ddragon.leagueoflegends.com/api/versions.json')).data[0]
                    return version;
                }
    
                const stats = await getRankStats(data.id)
                const version = await getLatestVersion();
    
                const soloQ = stats.filter(queue => queue.queueType === "RANKED_SOLO_5x5")[0]
                const flexQ = stats.filter(queue => queue.queueType === "RANKED_FLEX_SR")[0]
    
                if(!soloQ && flexQ){
                    const embeddedMsg = new Discord.MessageEmbed()
                    .setColor('#9831a3')
                    .setTitle(data.name)
                    .setDescription(`Summoner Level: ${data.summonerLevel}`)
                    .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.profileIconId}.png`)
                    .addFields(
                        { name: 'Flex 5v5', value: `${flexQ.tier} ${flexQ.rank}\n${flexQ.leaguePoints} LP / ${flexQ.wins}W ${flexQ.losses}L\nWin Ratio ${Math.round(flexQ.wins/(flexQ.wins + flexQ.losses) * 100)}%` }
                        
                    )
                    .attachFiles([`./img/ranked-emblems/Emblem_${flexQ.tier.toLowerCase()}.png`])
                    .setImage(`attachment://Emblem_${flexQ.tier.toLowerCase()}.png`)
                    message.channel.send(embeddedMsg);
                } else if(!flexQ && soloQ){
                    const embeddedMsg = new Discord.MessageEmbed()
                    .setColor('#9831a3')
                    .setTitle(data.name)
                    .setDescription(`Summoner Level: ${data.summonerLevel}`)
                    .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.profileIconId}.png`)
                    .addFields(
                        { name: 'Solo/Duo', value: `${soloQ.tier} ${soloQ.rank}\n${soloQ.leaguePoints} LP / ${soloQ.wins}W ${soloQ.losses}L\nWin Ratio ${Math.round(soloQ.wins/(soloQ.wins + soloQ.losses) * 100)}%` }
                        
                    )
                    .attachFiles([`./img/ranked-emblems/Emblem_${soloQ.tier.toLowerCase()}.png`])
                    .setImage(`attachment://Emblem_${soloQ.tier.toLowerCase()}.png`)
                    message.channel.send(embeddedMsg);
                } else {
                    const embeddedMsg = new Discord.MessageEmbed()
                    .setColor('#9831a3')
                    .setTitle(data.name)
                    .setDescription(`Summoner Level: ${data.summonerLevel}`)
                    .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.profileIconId}.png`)
                    .addFields(
                        { name: 'Solo/Duo', value: `${soloQ.tier} ${soloQ.rank}\n${soloQ.leaguePoints} LP / ${soloQ.wins}W ${soloQ.losses}L\nWin Ratio ${Math.round(soloQ.wins/(soloQ.wins + soloQ.losses) * 100)}%` }
                        
                    )
                    .attachFiles([`./img/ranked-emblems/Emblem_${soloQ.tier.toLowerCase()}.png`])
                    .setImage(`attachment://Emblem_${soloQ.tier.toLowerCase()}.png`)
                    .setFooter(`Flex 5v5\n${flexQ.tier} ${flexQ.rank}\n${flexQ.leaguePoints} LP / ${flexQ.wins}W ${flexQ.losses}L\nWin Ratio ${Math.round(flexQ.wins/(flexQ.wins + flexQ.losses) * 100)}%`, `https://opgg-static.akamaized.net/images/medals/${flexQ.tier}_1.png?image=q_auto:best&v=1`);
                    message.channel.send(embeddedMsg);
                }
    
                
            } catch (e) {
                console.log(e)
                message.channel.send('Summoner is unranked')
            }

        } catch (e) {
            console.log(e)
            message.channel.send('Summoner not found')
        }
        
    }

    
    // async function getLatestDDragon(language = "en_US") {
    //     let response;
    //     let versionIndex = 0;
    //     do { // I loop over versions because 9.22.1 is broken
    //         const version = (await fetch("http://ddragon.leagueoflegends.com/api/versions.json").then(async(r) => await r.json()))[versionIndex++];
        
    //         response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/profileicon.json`);
    //     }
    //     while (!response.ok)
        
    //     profileJson[language] = await response.json();
    //     return profileJson[language];
    // }

    
    

});

// login to Discord with your app's token
client.login('ODA1MzUwMzM0MTU5NTE5NzQ1.YBZm8g.hAl44JAOk-5PFCXoRdZNYEiETNM');