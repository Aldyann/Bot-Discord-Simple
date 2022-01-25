module.exports = async (client) => {
  console.log(`[API] Logged in as ${client.user.username}`);
  await client.user.setActivity(`My users - ${client.users.cache.size}`, {
    type: "LISTENING"//can be LISTENING, WATCHING, PLAYING, STREAMING
  });
};
