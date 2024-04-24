const {
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const { dbclient } = require("./connectToDB");

module.exports = async (interaction) => {
  if (interaction.customId === "email_capture") {
    console.log("Email Capture Button Was Clicked");
    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("emailCaptureModal")
      .setTitle("Sign up to our newsletter!");

    // Add components to modal

    // Create the text input components
    const nameInput = new TextInputBuilder()
      .setCustomId("nameInput")
      // The label is the prompt the user sees for this input
      .setLabel("Please enter your name:")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short);

    const emailInput = new TextInputBuilder()
      .setCustomId("emailInput")
      .setLabel("Please enter your E-mail")
      // Paragraph means multiple lines of text.
      .setStyle(TextInputStyle.Short);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(emailInput);

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  } else if (interaction.customId.startsWith("poll")) {
    const idOfInteraction = interaction.customId;
    const pollUUID = idOfInteraction.match(/\[(.*?)\]/);
    const optionTitle = idOfInteraction.match(/\((.*?)\)/);
    const userId = interaction.user.username;

    console.log(optionTitle[1], pollUUID[1]);

    // Check if the user has already voted on this poll
    const previousVote = await dbclient.query(
      "SELECT * FROM Votes WHERE poll_uuid = $1 AND user_id = $2",
      [pollUUID[1], userId]
    );

    if (previousVote.rows.length > 0) {
      console.log("User has already voted on this poll.");
      interaction.reply(
        "You have already voted on this poll. Thank you! :slight_smile:",
        idOfInteraction
      );
      return;
    }

    // Select the option based on poll_uuid and option_text
    const optionResult = await dbclient.query(
      "SELECT option_id FROM Options WHERE poll_uuid = $1 AND option_text = $2",
      [pollUUID[1], optionTitle[1]]
    );

    // Check if the query returned any rows
    if (optionResult.rows.length > 0) {
      // Extract option_id from the result
      const optionId = optionResult.rows[0].option_id;

      // Increment the vote_count for the selected option
      await dbclient.query(
        "UPDATE Options SET vote_count = vote_count + 1 WHERE option_id = $1",
        [optionId]
      );
      //Register the fact that this person voted on this poll already
      await dbclient.query(
        "INSERT INTO Votes (poll_uuid, option_id, user_id) VALUES ($1, $2, $3)",
        [pollUUID[1], optionId, userId]
      );

      console.log("A vote button was pressed", idOfInteraction);
      interaction.reply(
        'You Have Successfully Voted for **"' +
          optionTitle[1] +
          '"**, Thank you!'
      );
    } else {
      console.log("Option not found.");
      interaction.reply("Option not found.", idOfInteraction);
    }
  }
};
