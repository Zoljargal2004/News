export const slugifyCategory = (value = "") => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

export const normalizeCategorySlug = (value = "") => {
  try {
    return slugifyCategory(decodeURIComponent(String(value || "")));
  } catch {
    return slugifyCategory(value);
  }
};

export const categoryMatchesSlug = (category, slug) => {
  const normalizedSlug = normalizeCategorySlug(slug);
  const categoryName =
    typeof category === "string" ? category : category?.name || "";
  const categorySlug =
    typeof category === "string"
      ? slugifyCategory(category)
      : category?.slug || slugifyCategory(categoryName);

  return (
    categorySlug === normalizedSlug || slugifyCategory(categoryName) === normalizedSlug
  );
};
