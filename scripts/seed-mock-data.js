const { randomBytes, scryptSync } = require("crypto");
const mongoose = require("mongoose");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "news-app";
const AUTH_SECRET =
  process.env.AUTH_SECRET || process.env.MONGODB_URI || "newsletter-dev-secret";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from your environment");
}

if (MONGODB_URI.includes("<db_password>")) {
  throw new Error("Replace <db_password> in MONGODB_URI before seeding");
}

const { Schema } = mongoose;

const baseOptions = {
  versionKey: false,
};

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "reader" },
  },
  {
    ...baseOptions,
    collection: "users",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
  },
  {
    ...baseOptions,
    collection: "categories",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const newsBlockSchema = new Schema({}, { _id: false, strict: false });

const newsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    news: { type: [newsBlockSchema], required: true, default: [] },
    thumbnail: { type: String, default: null },
    status: { type: Boolean, required: true, default: false },
    recommended: { type: Boolean, required: true, default: false },
    political_party: { type: String, default: null },
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  {
    ...baseOptions,
    collection: "news",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const commentSchema = new Schema(
  {
    news_id: { type: Schema.Types.ObjectId, ref: "News", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
  },
  {
    ...baseOptions,
    collection: "comments",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
const News = mongoose.models.News || mongoose.model("News", newsSchema);
const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

const hashPassword = (password) => {
  const salt = randomBytes(16).toString("hex");
  const digest = scryptSync(password, salt + AUTH_SECRET, 64).toString("hex");

  return `${salt}:${digest}`;
};

const daysAgo = (days, hour = 9) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date;
};

const users = [
  {
    name: "Admin Editor",
    email: "admin@newsletter.mn",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Mira Reporter",
    email: "mira@newsletter.mn",
    password: "reporter123",
    role: "admin",
  },
  {
    name: "Reader User",
    email: "reader@newsletter.mn",
    password: "reader123",
    role: "reader",
  },
  {
    name: "Bold Reader",
    email: "bold@newsletter.mn",
    password: "reader123",
    role: "reader",
  },
];

const categoryNames = [
  "Politics",
  "Economy",
  "Technology",
  "Society",
  "Environment",
  "Health",
  "Sports",
  "Culture",
  "Education",
  "World",
  "Business",
  "Opinion",
];

const articleTemplates = [
  {
    title: "City Council Approves New Public Transit Plan",
    categories: ["Politics", "Society"],
    political_party: "Civic Coalition",
    recommended: true,
    daysAgo: 0,
    hour: 8,
  },
  {
    title: "Startups See Fresh Investment From Regional Funds",
    categories: ["Business", "Economy"],
    political_party: null,
    recommended: true,
    daysAgo: 0,
    hour: 10,
  },
  {
    title: "New Solar Project Expands Clean Power Capacity",
    categories: ["Environment", "Technology"],
    political_party: "Green Party",
    recommended: true,
    daysAgo: 0,
    hour: 13,
  },
  {
    title: "Hospitals Launch Faster Appointment System",
    categories: ["Health", "Technology"],
    political_party: null,
    recommended: false,
    daysAgo: 1,
    hour: 9,
  },
  {
    title: "National Team Opens Training Camp",
    categories: ["Sports"],
    political_party: null,
    recommended: false,
    daysAgo: 1,
    hour: 11,
  },
  {
    title: "Teachers Test New Digital Classroom Tools",
    categories: ["Education", "Technology"],
    political_party: null,
    recommended: true,
    daysAgo: 1,
    hour: 15,
  },
  {
    title: "Parliament Debates Small Business Tax Package",
    categories: ["Politics", "Economy", "Business"],
    political_party: "Reform Party",
    recommended: false,
    daysAgo: 2,
    hour: 8,
  },
  {
    title: "Festival Lineup Highlights Young Artists",
    categories: ["Culture"],
    political_party: null,
    recommended: false,
    daysAgo: 2,
    hour: 12,
  },
  {
    title: "Food Prices Ease After Strong Supply Week",
    categories: ["Economy", "Society"],
    political_party: null,
    recommended: true,
    daysAgo: 2,
    hour: 17,
  },
  {
    title: "Researchers Publish Air Quality Dashboard",
    categories: ["Environment", "Health", "Technology"],
    political_party: null,
    recommended: true,
    daysAgo: 3,
    hour: 10,
  },
  {
    title: "Regional Leaders Meet For Trade Talks",
    categories: ["World", "Business"],
    political_party: null,
    recommended: false,
    daysAgo: 3,
    hour: 14,
  },
  {
    title: "Opinion: Local Journalism Needs Better Data",
    categories: ["Opinion", "Society"],
    political_party: null,
    recommended: false,
    daysAgo: 4,
    hour: 9,
  },
  {
    title: "Banks Roll Out Mobile Security Upgrades",
    categories: ["Technology", "Business"],
    political_party: null,
    recommended: false,
    daysAgo: 4,
    hour: 16,
  },
  {
    title: "University Opens Climate Research Center",
    categories: ["Education", "Environment"],
    political_party: null,
    recommended: true,
    daysAgo: 5,
    hour: 10,
  },
  {
    title: "Community Clinics Add Weekend Hours",
    categories: ["Health", "Society"],
    political_party: null,
    recommended: false,
    daysAgo: 5,
    hour: 15,
  },
  {
    title: "Draft: Election Calendar Update",
    categories: ["Politics"],
    political_party: "Independent",
    recommended: false,
    status: false,
    daysAgo: 6,
    hour: 11,
  },
];

const makeArticleBody = (title, categories, imageSeed) => [
  {
    type: "p",
    value: `<p>${title} is part of today's mock newsroom package for the ${categories.join(", ")} desk.</p>`,
  },
  {
    type: "p",
    value:
      "<p>Officials and residents described the update as an early step, with follow-up details expected as teams collect more feedback.</p>",
  },
  {
    type: "image",
    src: `https://picsum.photos/seed/${imageSeed}/1200/720`,
  },
  {
    type: "p",
    value:
      "<p>The story is seeded for development, so editors can test listing pages, detail pages, search, category filters, recommendations, and comments.</p>",
  },
];

const comments = [
  "Helpful context. I like seeing the background in one place.",
  "This would be stronger with a few more numbers from the agencies involved.",
  "Good mock story for testing comments and reader interactions.",
  "The category filter picked this up correctly on my side.",
];

const upsertUsers = async () => {
  const seededUsers = new Map();

  for (const user of users) {
    const doc = await User.findOneAndUpdate(
      { email: user.email },
      {
        $setOnInsert: {
          email: user.email,
          password: hashPassword(user.password),
        },
        $set: {
          name: user.name,
          role: user.role,
        },
      },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    );

    seededUsers.set(user.email, doc);
  }

  return seededUsers;
};

const upsertCategories = async () => {
  const seededCategories = new Map();

  for (const name of categoryNames) {
    const doc = await Category.findOneAndUpdate(
      { name },
      { $setOnInsert: { name } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    );

    seededCategories.set(name, doc);
  }

  return seededCategories;
};

const upsertNews = async (seededUsers, seededCategories) => {
  const authors = [
    seededUsers.get("admin@newsletter.mn"),
    seededUsers.get("mira@newsletter.mn"),
  ].filter(Boolean);
  const seededNews = [];

  for (const [index, article] of articleTemplates.entries()) {
    const categoryIds = article.categories
      .map((name) => seededCategories.get(name)?._id)
      .filter(Boolean);
    const publishedAt = daysAgo(article.daysAgo, article.hour);
    const author = authors[index % authors.length];

    const doc = await News.findOneAndUpdate(
      { title: article.title },
      {
        $set: {
          title: article.title,
          news: makeArticleBody(
            article.title,
            article.categories,
            `news-app-${index + 1}`,
          ),
          thumbnail: `https://picsum.photos/seed/news-thumb-${index + 1}/1200/700`,
          status: article.status ?? true,
          recommended: article.recommended,
          political_party: article.political_party,
          author_id: author._id,
          categories: categoryIds,
          created_at: publishedAt,
          updated_at: publishedAt,
        },
      },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    );

    seededNews.push(doc);
  }

  return seededNews;
};

const upsertComments = async (seededUsers, seededNews) => {
  const readers = [
    seededUsers.get("reader@newsletter.mn"),
    seededUsers.get("bold@newsletter.mn"),
  ].filter(Boolean);

  for (const [index, article] of seededNews.slice(0, 10).entries()) {
    const commentCount = index % 2 === 0 ? 2 : 1;

    for (let offset = 0; offset < commentCount; offset += 1) {
      const user = readers[(index + offset) % readers.length];
      const content = comments[(index + offset) % comments.length];

      await Comment.findOneAndUpdate(
        {
          news_id: article._id,
          user_id: user._id,
          content,
        },
        {
          $setOnInsert: {
            news_id: article._id,
            user_id: user._id,
            content,
            created_at: daysAgo(index % 5, 18 + offset),
          },
        },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
      );
    }
  }
};

const seed = async () => {
  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB,
    bufferCommands: false,
  });

  const seededUsers = await upsertUsers();
  const seededCategories = await upsertCategories();
  const seededNews = await upsertNews(seededUsers, seededCategories);
  await upsertComments(seededUsers, seededNews);

  console.log("Mock data seeded");
  console.log(`Users: ${seededUsers.size}`);
  console.log(`Categories: ${seededCategories.size}`);
  console.log(`News: ${seededNews.length}`);
  console.log("Demo logins:");
  console.log("  admin@newsletter.mn / admin123");
  console.log("  reader@newsletter.mn / reader123");
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
