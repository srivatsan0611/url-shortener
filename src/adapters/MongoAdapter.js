import mongoose from "mongoose";

// URL Schema (based on your existing model)
const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ 
      timestamp: { type: Number, default: Date.now },
      ip: String,
      userAgent: String,
      referrer: String
    }],
  },
  { timestamps: true }
);

class MongoAdapter {
  constructor(mongoUri) {
    this.mongoUri = mongoUri;
    this.URL = null;
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      try {
        await mongoose.connect(this.mongoUri);
        this.URL = mongoose.model("URL", urlSchema);
        this.connected = true;
        console.log("Connected to MongoDB via URLShortener SDK");
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
      }
    }
  }

  async create(data) {
    await this.connect();
    return await this.URL.create(data);
  }

  async findByShortId(shortId) {
    await this.connect();
    return await this.URL.findOne({ shortId });
  }

  async incrementClicks(shortId, metadata = {}) {
    await this.connect();
    
    const visitEntry = {
      timestamp: Date.now(),
      ip: metadata.ip,
      userAgent: metadata.userAgent,
      referrer: metadata.referrer
    };

    return await this.URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: visitEntry
        }
      },
      { new: true }
    );
  }

  async getAnalytics(shortId) {
    await this.connect();
    
    const url = await this.URL.findOne({ shortId });
    if (!url) {
      throw new Error('URL not found');
    }

    const totalClicks = url.visitHistory.length;
    const uniqueClicks = new Set(url.visitHistory.map(visit => visit.ip)).size;
    
    // Get clicks per day for the last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentClicks = url.visitHistory.filter(visit => visit.timestamp > thirtyDaysAgo);
    
    return {
      shortId,
      originalUrl: url.redirectURL,
      totalClicks,
      uniqueClicks,
      recentClicks: recentClicks.length,
      createdAt: url.createdAt,
      lastClicked: totalClicks > 0 ? new Date(Math.max(...url.visitHistory.map(v => v.timestamp))) : null,
      clicksToday: url.visitHistory.filter(visit => {
        const today = new Date();
        const visitDate = new Date(visit.timestamp);
        return visitDate.toDateString() === today.toDateString();
      }).length
    };
  }

  async delete(shortId) {
    await this.connect();
    const result = await this.URL.deleteOne({ shortId });
    return result.deletedCount > 0;
  }

  async list(options = {}) {
    await this.connect();
    
    const { limit = 50, skip = 0, sortBy = 'createdAt', sortOrder = -1 } = options;
    
    return await this.URL
      .find({})
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('shortId redirectURL visitHistory createdAt');
  }
}

export default MongoAdapter;