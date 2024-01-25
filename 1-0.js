const { Client, GatewayIntentBits, Permissions } = require("discord.js");

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.info("Start v2 has started");

  client.user.setPresence({
    status: "idle", // "online", "idle", "dnd" (do not disturb), or "invisible"
    activities: [
      {
        name: "moderate human",
        type: "PLAYING", // Types: "PLAYING", "WATCHING", "LISTENING", "STREAMING"
      },
    ],
  });
});

client.on("messageCreate", (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Command handling
  if (message.content.startsWith("!")) {
    handleCommand(message);
  }
});

async function handleCommand(message) {
  const [command, ...args] = message.content.slice(1).split(" ");

  // Individual command handling
  switch (command) {
    case "bear":
      message.channel.send("i bear");
      console.log("bear command received");
      break;

    case "ping":
      message.channel.send("pong!");
      console.log("pong command received");
      break;

    case "help":
      message.reply(
        "hey! we've switched to a new handler, so you may not be able to all of the old commands. we've also fixed some bugs, but here are the commands.",
      );
      message.channel.send("> bear\n> ping\n> help\n> kick\n > and of course easter eggs");
      console.log("help command received");

      break;

    case "-+witch":
      for (let i = 0; i < 16; i++) {
        message.reply("burn the witch");
        console.log("DISABLED - witch command received");
      }
      break;

    case "kick": // Update this line
      handleKickCommand(message, args);
      break;

    default:
      message.reply(
        "you've input a unknown command. please try **!help** for commands",
        console.log("unknown command received")
      );
      break;

     case "pee":
      message.reply("bruh.");
      console.log("pee command received");
      break;
  }
}

async function handleKickCommand(message, args) {
  // Check if the message is sent in a guild
  if (!message.guild) {
    message.channel.send("This command can only be used in a server (guild).");
    return;
  }

  // Check if the member has the 'KICK_MEMBERS' permission
  const botMember = message.guild.me;

  if (!botMember || !botMember.permissions.has("KICK_MEMBERS")) {
    message.channel.send(
      "I require the 'KICK_MEMBERS' permission to kick members.",
    );
    return;
  }

  // Get the user mentioned
  const user = message.mentions.users.first();

  // Extract the reason from the message
  const reason = args.slice(1).join(" ");

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

    // Optional: Send a direct message to the kicked user
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

client.login('MTE5NTc3MTEzMzU4NTI3NjkzOA.GkVsnl.h78Q1IfMPPjdmjV9sJ8QQMouB6be1hJve5j_9o');
