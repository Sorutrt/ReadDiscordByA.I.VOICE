import { Interaction, SlashCommandBuilder, GuildMember } from "discord.js";
import { joinVoiceChannel, DiscordGatewayAdapterCreator } from "@discordjs/voice";
import dotenv from "dotenv";

// .envファイルを読み込む
dotenv.config();

export const joinCommandData = new SlashCommandBuilder()
  .setName("join")
  .setDescription("ボイスチャンネルに接続します");

export async function joinVC(interaction: Interaction) {
  if (!interaction.isCommand()) return;

  const { guild, member } = interaction;
  
  if (!guild) {
    await interaction.reply("このコマンドはギルド内でのみ実行できます。");
    return;
  }
  // `member` が `GuildMember` 型であることを確認
  if (!(member instanceof GuildMember)) {
    await interaction.reply("このコマンドはギルドメンバーに対して実行できます。");
    return;
  }

  // ユーザーがボイスチャンネルに参加しているか確認
  const voiceChannel = member.voice.channel;
  
  if (!voiceChannel) {
    await interaction.reply("ボイスチャンネルに参加してから再度試してください。");
    return;
  }

  try {
    // ボイスチャンネルに接続
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    await interaction.reply(`${voiceChannel.name} チャンネルに接続しました！`);
  } catch (error) {
    console.error(error);
    await interaction.reply("ボイスチャンネルへの接続に失敗しました。");
  }
}
