const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test-poll")
    .setDescription("You can check how a poll is gonna look with this command")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction, client) {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Title")
        .setURL("https://www.peacefulriches.com/")
        .setAuthor({
          name: "Testname",
          iconURL:
            "https://peacefulriches.com/wp-content/uploads/2024/03/cropped-GoldenBlueSeedOfLife2PNG.png",
          url: "https://www.peacefulriches.com/",
        })
        .setDescription("Description")
        .setThumbnail(
          "https://peacefulriches.com/wp-content/uploads/2024/03/cropped-GoldenBlueSeedOfLife2PNG.png"
        )
        .addFields(
          { name: "\u200B", value: "\u200B" },
          { name: " ", value: "**1.** Get Money Now", inline: true },
          { name: "\u200B", value: "\u200B" },
          {
            name: " ",
            value: "21 Day Challenge",
            inline: true,
          },
          { name: "\u200B", value: "\u200B" },
          { name: " ", value: "Money Magic", inline: true }
        )
        .setTimestamp()
        .setFooter({
          text: " The Peaceful Riches Community ",
          iconURL:
            "https://peacefulriches.com/wp-content/uploads/2024/03/cropped-GoldenBlueSeedOfLife2PNG.png",
        });

      // Creating buttons
      const button1 = new ButtonBuilder()
        .setCustomId("button1")
        .setLabel("Option 1")
        .setStyle(ButtonStyle.Primary);

      const button2 = new ButtonBuilder()
        .setCustomId("button2")
        .setLabel("Option 2")
        .setStyle(ButtonStyle.Primary);

      const button3 = new ButtonBuilder()
        .setCustomId("button3")
        .setLabel("Option 3")
        .setStyle(ButtonStyle.Primary);

      // Adding buttons to a row
      const row = new ActionRowBuilder().addComponents(
        button1,
        button2,
        button3
      );

      // Sending the embed with buttons
      await interaction.channel.send({ embeds: [embed], components: [row] });

      interaction.reply({ content: "Message Sent", ephemeral: true });
    } catch (error) {
      console.log(
        `Sending a message using the say command has failed. Here's the error` +
          error
      );
      await interaction.reply({
        content:
          "An error has occurred with saying your message, please try again later!",
        ephemeral: true,
      });
    }
  },
};
