const redis = require('./redis'); // your redis client

const clearRedis = async () => {
  try {
    await redis.flushall();
    console.log("✅ All Redis data cleared");
  } catch (err) {
    console.error("❌ Error clearing Redis:", err);
  }
};

// Call when needed
clearRedis();
