// If you want to copy this code, you will not be able to get support for the original version as you lose your support. Check l.txt for licenses.

const { Client, GatewayIntentBits } = require("discord.js");
const { Permissions } = require("discord.js");

const TOKEN = process.env.TOKEN;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Ready!");
  client.user.setPresence({
    status: "idle",
    activities: [
      {
        name: "Playing a game",
        type: "PLAYING",
      },
    ],
  });
});

client.on("messageCreate", (message) => {
  if (message.content === "!bear") {
    message.channel.send("i bear");
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    message.channel.send("pong!");
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "!help") {
    message.reply(
      "we've been working hard, but this command isn't ready yet! please check back soon.",
    );
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "!witch") {
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
    message.reply("burn the witch");
  }
});

client.on("messageCreate", async (message) => {
  // Check if the message starts with '!kick' and is in a guild
  if (message.content.startsWith("!kick") && message.guild) {
    message.channel.send(
      "This command is currently being tested; it may not work.",
    );

    // Check if the member exists and has the 'KICK_MEMBERS' permission
    if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      message.channel.send("You don't have permission to kick members.");
      return;
    }

    // Get the user mentioned
    const user = message.mentions.users.first();

    // Extract the reason from the message
    const reason = message.content.split(" ").slice(2).join(" ");

    if (!user) {
      message.channel.send(
        "Please mention a user to kick. Usage: !kick @user [reason]",
      );
      return;
    }

    // Resolve the member from the user
    const member = message.guild.members.resolve(user);

    if (!member) {
      message.channel.send("That user is not in this server.");
      return;
    }

    try {
      // Kick the member
      const kickOptions = reason ? { reason } : undefined;
      await member.kick(kickOptions);

      const kickMessage = reason
        ? `${user.tag} has been kicked from the server. Reason: ${reason}`
        : `${user.tag} has been kicked from the server. No reason specified.`;
      message.channel.send(kickMessage);

      // Optional: Send a direct message to the user
      try {
        await user.send(
          `You have been kicked from the server. Reason: ${
            reason || "No reason specified"
          }`,
        );
      } catch (dmError) {
        console.error("Failed to send DM:", dmError);
      }
    } catch (error) {
      console.error("Failed to kick the user:", error);
      message.channel.send("An error occurred while trying to kick the user.");
    }
  }
});

// ban

// ban
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!ban")) {
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      message.channel.send("You don't have permission to ban members.");
      return;
    }
    const user = message.mentions.users.first();
    const reason = message.content.split(" ").slice(2).join(" "); // Extract the reason from the message
    if (user) {
      const member = message.guild.members.resolve(user);
      if (member) {
        try {
          const banOptions = reason ? { reason } : undefined; // Pass the reason only if it's specified
          await member.ban({ days: 7, ...banOptions }); // Pass the reason to the ban method if it's specified
          const banMessage = reason
            ? `${user.tag} has been banned from the server. Reason: ${reason}`
            : `${user.tag} has been banned from the server. No reason specified`;
          message.channel.send(banMessage); // Send the reason in the message if specified; otherwise, send a default message
        } catch (error) {
          console.error("Failed to ban the user:", error);
          message.channel.send(
            "An error occurred while trying to ban the user. Please check the logs for more information.",
          );
        }
      } else {
        message.channel.send("That user is not in this server");
      }
    } else {
      message.channel.send(
        "You need to specify a user to ban. Usage: !ban @user [reason]",
      );
    }
  }
});

// mute
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!mute")) {
    if (!message.member.permissions.has("MODERATE_MEMBERS")) {
      message.channel.send("You don't have permission to mute users.");
      return;
    }
    const params = message.content.split(" ");
    const user = message.mentions.users.first();
    const durationInMinutes = parseInt(params[2]);
    if (user && !isNaN(durationInMinutes)) {
      const member = message.guild.members.resolve(user);
      if (member) {
        try {
          const muteRole = message.guild.roles.cache.find(
            (role) => role.name === "Muted",
          );
          if (!muteRole) {
            message.channel.send(
              "The Muted role was not found. Please create a Muted role and try again. (ps. sorry! we are working hard to fix these annoying role requirements.)",
            );
            return;
          }
          await member.roles.add(muteRole);
          message.channel.send(
            `${user.tag} has been muted for ${durationInMinutes} minutes.`,
          );
          // Set a timeout to remove the mute role after the specified duration
          setTimeout(
            () => {
              member.roles.remove(muteRole);
              message.channel.send(
                `${user.tag} has been unmuted after the timeout.`,
              );
            },
            durationInMinutes * 60 * 1000,
          ); // Convert minutes to milliseconds
        } catch (error) {
          console.error("Failed to mute the user:", error);
          message.channel.send(
            "An error occurred while trying to mute the user. Please check the logs for more information.",
          );
        }
      } else {
        message.channel.send(
          "You need to specify a valid user to mute. Usage: !mute @user [duration in minutes]",
        );
      }
    } else {
      message.channel.send(
        "Invalid command usage. Usage: !mute @user [duration in minutes]",
      );
    }
  }
});

// Login to Discord with your client's token
client.login('MTE5NTc3MTEzMzU4NTI3NjkzOA.GYtQAU.RAEJzuvuXkTFeaIqjyT-KQk3OiTu_xRdDQTfXg');

const express = require("express");
const app = express();
const port = 3000;
app.get("/", (req, res) => {
  res.send("Start v2");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
