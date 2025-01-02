//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, Events, CacheType, Interaction } from "discord.js";
import dotenv from "dotenv";
import { joinCommandData, joinVC } from "./commands/join";
//import { talk } from "./talk";
import { createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } from "@discordjs/voice";
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";

//.envファイルを読み込む
dotenv.config()

// ESM環境に合わせて定義する
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Botで使うGatewayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
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


const audioPlayer = createAudioPlayer();
// メッセージ送ると喋る
client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;

  // VC接続確認
  const connection = getVoiceConnection(message.guild!.id);
  if (!connection) {
    // message.reply("ボットは現在どのボイスチャンネルにも接続していません。");
    return;
  }

  // 音声ファイルのパスとその確認
  const audioFilePath = path.resolve(__dirname, "../voice/2.wav");
  if (!fs.existsSync(audioFilePath)) {
    message.reply("音声ファイルが見つかりません。");
    console.error("音声ファイルが見つかりません: " + audioFilePath);
    return;
  }
  
  const resource = createAudioResource(audioFilePath, { inlineVolume: true });

  audioPlayer.removeAllListeners();

  connection.subscribe(audioPlayer);
  audioPlayer.play(resource);

  console.log("Connection state:", connection.state.status);
  console.log("Audio player state:", audioPlayer.state.status);

  message.reply("音声を再生します！");
});

audioPlayer.on(AudioPlayerStatus.Playing, () => {
  console.log("音声を再生しています...");
});

audioPlayer.on(AudioPlayerStatus.Idle, () => {
  console.log("音声再生が終了しました。");
});

audioPlayer.on("error", (error) => {
  console.error("音声再生エラー:", error);
});


// スラッシュコマンド
client.on(Events.InteractionCreate, async (interaction: Interaction<CacheType>) => {
  //console.log(interaction); //test code
  
  if (!interaction.isCommand()) {
      return;
  }
  const { commandName } = interaction;

  if (commandName === joinCommandData.name) {
    try {
      await joinVC(interaction);
    }
    catch(e) {
      console.log('エラーが発生しました')
      console.error(e);
    }
  }
})

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)
