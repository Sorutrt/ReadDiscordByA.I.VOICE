//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, Events, CacheType, Interaction } from "discord.js";
import dotenv from "dotenv";
import { data, rand } from "./commands/rand";

//.envファイルを読み込む
dotenv.config()

//Botで使うGatewayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
})

//Botがきちんと起動したか確認
client.once('ready', () => {
    console.log('Ready!')
    if(client.user){
        console.log(client.user.tag)
    }
})

//!timeと入力すると現在時刻を返信するように
client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return
    if (message.content === '!ping') {
      message.reply("pong");
    }
})

client.on(Events.InteractionCreate, async (interaction: Interaction<CacheType>) => {
  //console.log(interaction); //test code
  
  if (!interaction.isCommand()) {
      return;
  }
  const { commandName } = interaction;

  if (commandName === data.name) {
      try {
          await rand(interaction);
      }
      catch(e) {
          console.log('main.ts error')
          console.error(e);
      }
  }
})

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)