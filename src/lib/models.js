import { mongoose } from "@/lib/db";

const { Schema, Types, model, models } = mongoose;

const toId = (value) => {
  if (!value) {
    return null;
  }

  if (value._id) {
    return value._id.toString();
  }

  if (typeof value === "object" && value.id) {
    return value.id.toString();
  }

  return value.toString();
};

const serializeDate = (value) => {
  if (!value) {
    return value;
  }

  return value instanceof Date ? value.toISOString() : value;
};

const baseSchemaOptions = {
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
    ...baseSchemaOptions,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const sessionSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token_hash: { type: String, required: true, unique: true },
    expires_at: { type: Date, required: true, expires: 0 },
  },
  {
    ...baseSchemaOptions,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
  },
  {
    ...baseSchemaOptions,
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
    ...baseSchemaOptions,
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
    ...baseSchemaOptions,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const advertisingRequestSchema = new Schema(
  {
    company_name: { type: String, required: true, trim: true },
    contact_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: null, trim: true },
    placement: { type: String, default: "homepage", trim: true },
    budget: { type: String, default: null, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, required: true, default: "new" },
    user_id: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    ...baseSchemaOptions,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

userSchema.index({ email: 1 }, { unique: true });
sessionSchema.index({ token_hash: 1 }, { unique: true });
categorySchema.index({ name: 1 }, { unique: true });
newsSchema.index({ created_at: -1 });
newsSchema.index({ status: 1, created_at: -1 });
newsSchema.index({ categories: 1, created_at: -1 });
commentSchema.index({ news_id: 1, created_at: -1 });

export const User = models.User || model("User", userSchema);
export const Session = models.Session || model("Session", sessionSchema);
export const Category = models.Category || model("Category", categorySchema);
export const News = models.News || model("News", newsSchema);
export const Comment = models.Comment || model("Comment", commentSchema);

export const isObjectId = (value) => Types.ObjectId.isValid(String(value || ""));

export const AdvertisingRequest =
  models.AdvertisingRequest ||
  model("AdvertisingRequest", advertisingRequestSchema);

export const serializeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: toId(user),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const serializeCategory = (category) => {
  if (!category) {
    return null;
  }

  return {
    id: toId(category),
    name: category.name,
    created_at: serializeDate(category.created_at),
    updated_at: serializeDate(category.updated_at),
  };
};

export const serializeNews = (news) => {
  if (!news) {
    return null;
  }
  

  const author = news.author_id && news.author_id.name ? news.author_id : null;
  const categories = Array.isArray(news.categories) ? news.categories : [];

  return {
    id: toId(news),
    title: news.title,
    news: Array.isArray(news.news) ? news.news : [],
    thumbnail: news.thumbnail,
    status: Boolean(news.status),
    recommended: Boolean(news.recommended),
    political_party: news.political_party || null,
    author_id: toId(news.author_id),
    author_name: author?.name,
    author_email: author?.email,
    categories: categories
      .map((category) => (category?.name ? category.name : null))
      .filter(Boolean),
    created_at: serializeDate(news.created_at),
    updated_at: serializeDate(news.updated_at),
  };
};

export const serializeComment = (comment) => {
  if (!comment) {
    return null;
  }

  const user = comment.user_id && comment.user_id.name ? comment.user_id : null;

  return {
    id: toId(comment),
    content: comment.content,
    created_at: serializeDate(comment.created_at),
    updated_at: serializeDate(comment.updated_at),
    user_id: toId(comment.user_id),
    user_name: user?.name,
    user_role: user?.role,
  };
};

export const serializeAdvertisingRequest = (request) => {
  if (!request) {
    return null;
  }

  return {
    id: toId(request),
    company_name: request.company_name,
    contact_name: request.contact_name,
    email: request.email,
    phone: request.phone,
    placement: request.placement,
    budget: request.budget,
    message: request.message,
    status: request.status,
    user_id: toId(request.user_id),
    created_at: serializeDate(request.created_at),
    updated_at: serializeDate(request.updated_at),
  };
};