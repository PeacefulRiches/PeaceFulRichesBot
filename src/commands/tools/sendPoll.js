const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder, // Import ActionRowBuilder
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send-poll-to-all")
    .setDescription("Send a poll to every member of the server in DM's")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Set the Title of the poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Set the Description of the poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("choice1")
        .setDescription("First Possible Choice of the Poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("choice2")
        .setDescription("Second Possible Choice of the Poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("choice3")
        .setDescription("Third Possible Choice of the Poll")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("choice4")
        .setDescription("Fourth Possible Choice of the Poll")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("choice5")
        .setDescription("Fifth Possible Choice of the Poll")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction, client) {
    if (!interaction.guild) {
      // Reply with an ephemeral message for non-server channels
      await interaction.reply({
        content:
          "This command can only be used in server channels by an authorized Admin.",
        ephemeral: true,
      });
      return;
    }

    let pollChoices = [
      interaction.options.getString("choice1"),
      interaction.options.getString("choice2"),
      interaction.options.getString("choice3") || null,
      interaction.options.getString("choice4") || null,
      interaction.options.getString("choice5") || null,
    ];
    const pollTitle = interaction.options.getString("title");
    const pollDescription = interaction.options.getString("description");

    console.log(pollChoices);

    const embedFields = [
      { name: " ", value: `**1.** ${pollChoices[0]}` },

      { name: " ", value: `**2.** ${pollChoices[1]}` },

      pollChoices[2]
        ? { name: " ", value: `**3.** ${pollChoices[2]}` }
        : { name: " ", value: " " },
      pollChoices[3]
        ? { name: " ", value: `**4.** ${pollChoices[3]}` }
        : { name: " ", value: " " },
      pollChoices[4]
        ? { name: " ", value: `**5.** ${pollChoices[4]}` }
        : { name: " ", value: " " },
    ];

    // Creating the embed
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(pollTitle)
      .setURL("https://www.peacefulriches.com/")
      .setAuthor({
        name: "Peaceful Riches",
        iconURL:
          "https://peacefulriches.com/wp-content/uploads/2024/03/cropped-GoldenBlueSeedOfLife2PNG.png",
        url: "https://www.peacefulriches.com/",
      })
      .setDescription(pollDescription)
      .setThumbnail(
        "https://peacefulriches.com/wp-content/uploads/2024/03/cropped-GoldenBlueSeedOfLife2PNG.png"
      )
      .addFields(embedFields)
      .setTimestamp()
      .setFooter({
        text: "- The Peaceful Riches Community",
        iconURL:
          "https://peacefulriches.com/wp-content/uploads/2024/03/cropped-GoldenBlueSeedOfLife2PNG.png",
      });

    // Creating buttons

    let button1;
    let button2;
    let button3;
    let button4;
    let button5;

    button1 = new ButtonBuilder()
      .setCustomId("pollOption1")
      .setLabel(pollChoices[0])
      .setStyle(ButtonStyle.Primary);

    button2 = new ButtonBuilder()
      .setCustomId("pollOption2")
      .setLabel(pollChoices[1])
      .setStyle(ButtonStyle.Primary);

    if (pollChoices[2] !== null) {
      button3 = new ButtonBuilder()
        .setCustomId("pollOption3")
        .setLabel(pollChoices[2])
        .setStyle(ButtonStyle.Primary);
    } else {
      button3 = null;
    }

    if (pollChoices[3] !== null) {
      button4 = new ButtonBuilder()
        .setCustomId("pollOption4")
        .setLabel(pollChoices[3])
        .setStyle(ButtonStyle.Primary);
    } else {
      button4 = null;
    }

    if (pollChoices[4] !== null) {
      button5 = new ButtonBuilder()
        .setCustomId("pollOption5")
        .setLabel(pollChoices[4])
        .setStyle(ButtonStyle.Primary);
    } else {
      button5 = null;
    }

    //Add all buttons to an array so i can filter out the ones that are null, preventing API errors
    const buttonsArray = [button1, button2];
    if (button3 !== null) {
      buttonsArray.push(button3);
    }
    if (button4 !== null) {
      buttonsArray.push(button4);
    }
    if (button5 !== null) {
      buttonsArray.push(button5);
    }

    // Adding buttons to a row
    const row = new ActionRowBuilder();

    buttonsArray.map((button) => {
      row.addComponents(button);
    });

    messageObjectToSend = { embeds: [embed], components: [row] };

    //Fetch the latest version of all guild members
    await interaction.guild.members.fetch();
    // Fetch all members of the guild
    const guildMembers = Array.from(interaction.guild.members.cache);

    // Define the rate limit parameters
    const messagesPerMinute = 20; // Maximum number of messages per minute
    const interval = 60000 / messagesPerMinute; // Interval between each message in milliseconds

    // Iterate over each member and send the message with the row component
    for (const [index, guildMember] of guildMembers.entries()) {
      setTimeout(async () => {
        try {
          // Clone the original messageObjectToSend to avoid affecting other users
          const personalizedMessage = { ...messageObjectToSend };
          // Add "Hello [username]" to the message content
          personalizedMessage.content = `Hello <@${guildMember[1].user.id}>`;

          // Send the message with the row component
          await guildMember[1].send(personalizedMessage);
          console.log(
            "Successfully sent a message to member " + guildMember[1].user.tag
          );
          console.log(`Current Index: ${index}`);
          console.log(`Remaining: ${guildMembers.length - index - 1}`);
        } catch (error) {
          console.error(
            "Failed to send DM to member " + guildMember[1].user.tag
          );
          console.error(error);
        }

        // Check if it's the last member or if the interval has passed
        if (
          index === guildMembers.length - 1 ||
          (index + 1) % messagesPerMinute === 0
        ) {
          console.log("Waiting for the next batch of messages...");
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
      }, index * interval); // Set individual timeouts for each member
    }

    try {
      await interaction.reply({
        content:
          "Message sent to all members successfully! Have a Wonderful day filled with prosperity!",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  },
};
