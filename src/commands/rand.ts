import { SlashCommandBuilder, } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('rand')
	.setDescription('乱数を返します')
	.addIntegerOption(option =>
		option.setName('randkosu')
			.setDescription('乱数の個数')
			.setMinValue(1)
			.setMaxValue(38)
			.setRequired(true))

export async function rand(interaction: any) {
	try {
		const randkosu = await interaction.options.getInteger('randkosu');
		const randnumbers: number[] = new Array<number>();
		for(let i=0; i<randkosu; ) {
			const randnum: number = Math.ceil(Math.random() * 38);
			if (!randnumbers.includes(randnum)) { //値がrandnumbersに追加されていなければ真
				randnumbers.push(randnum);
				i++;
			}
		}
		
		randnumbers.sort((a, b) => a - b);

		// output
		await interaction.reply('Random Numbers: ' + randnumbers.toString());
	}
	catch (e) {
		console.log('rand.ts error')
		console.error(e);
	}
}