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

export const categoryDisplayNames = {
  Politics: "Улстөр",
  Economy: "Эдийн засаг",
  Technology: "Технологи",
  Society: "Нийгэм",
  Environment: "Байгаль орчин",
  Health: "Эрүүл мэнд",
  Sports: "Спорт",
  Culture: "Соёл",
  Education: "Боловсрол",
  World: "Олон улс",
  Business: "Бизнес",
  Opinion: "Үзэл бодол",
};

export const getCategoryDisplayName = (category) => {
  const categoryName =
    typeof category === "string" ? category : category?.name || "";

  return categoryDisplayNames[categoryName] || categoryName;
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
