"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEditNews } from "@/hooks/provider-news-editor";
import { useCategories, useNews } from "@/hooks/use-news";
import { defaultPartyScores, politicalParties } from "@/data/political-parties";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GreenBgTitle } from "@/components/general/title";
import { getCategoryDisplayName } from "@/lib/categories";

const STATUS_OPTIONS = [
  { value: "published", label: "Нийтэлсэн" },
  { value: "draft", label: "Ноорог" },
];

const SOURCE_GROUPS = [
  {
    id: "right",
    title: "Right leaning sources",
    shortLabel: "Right",
    partyId: "democratic_party",
    color: "#2563eb",
    sources: ["Right1", "Right2", "Right3", "RightN"],
  },
  {
    id: "neutral",
    title: "Neutral sources",
    shortLabel: "Neutral",
    partyId: "neutral",
    color: "#9ca3af",
    sources: ["Neutral1", "Neutral2", "Neutral3", "NeutralN"],
  },
  {
    id: "left",
    title: "Left leaning sources",
    shortLabel: "Left",
    partyId: "peoples_party",
    color: "#dc2626",
    sources: ["Left1", "Left2", "Left3", "LeftN"],
  },
];

const getDominantParty = (partyScores) => {
  return politicalParties.reduce((dominantParty, party) => {
    const dominantScore = Number(partyScores?.[dominantParty.id] || 0);
    const partyScore = Number(partyScores?.[party.id] || 0);

    return partyScore > dominantScore ? party : dominantParty;
  }, politicalParties[0]);
};

const getSelectedParties = (partyScores) => {
  return politicalParties.filter(
    (party) => Number(partyScores?.[party.id] || 0) > 0,
  );
};

const getPoliticalPartyLabel = (partyScores) => {
  const selectedParties = getSelectedParties(partyScores);

  return selectedParties.length
    ? selectedParties.map((party) => party.label).join(", ")
    : getDominantParty(partyScores).label;
};

const getSourceCounts = (selectedSourceIds) => {
  return SOURCE_GROUPS.map((group) => ({
    ...group,
    count: group.sources.filter((source) => selectedSourceIds.includes(source))
      .length,
  }));
};

const getPartyScoresFromSources = (selectedSourceIds) => {
  const sourceCounts = getSourceCounts(selectedSourceIds);
  const totalSources = sourceCounts.reduce((total, group) => total + group.count, 0);

  if (!totalSources) {
    return defaultPartyScores;
  }

  const rawScores = sourceCounts.map((group) => {
    const rawScore = (group.count / totalSources) * 100;

    return {
      ...group,
      score: Math.floor(rawScore),
      remainder: rawScore - Math.floor(rawScore),
    };
  });
  let remainingScore =
    100 - rawScores.reduce((total, group) => total + group.score, 0);

  rawScores
    .sort((first, second) => second.remainder - first.remainder)
    .forEach((group) => {
      if (remainingScore > 0) {
        group.score += 1;
        remainingScore -= 1;
      }
    });

  return {
    democratic_party:
      rawScores.find((group) => group.partyId === "democratic_party")?.score || 0,
    neutral: rawScores.find((group) => group.partyId === "neutral")?.score || 0,
    peoples_party:
      rawScores.find((group) => group.partyId === "peoples_party")?.score || 0,
  };
};

const getSourceIndicatorLabel = (selectedSourceIds) => {
  const sourceCounts = getSourceCounts(selectedSourceIds);
  const highestCount = Math.max(...sourceCounts.map((group) => group.count));

  if (!highestCount) {
    return "Neutral";
  }

  return sourceCounts
    .filter((group) => group.count === highestCount)
    .map((group) => group.shortLabel)
    .join(", ");
};

export const PanelSidebar = () => {
  const { categories: fetchedCategories, loading: categoriesLoading } =
    useCategories();
  const { uploadNews, loading: uploadLoading } = useNews();
  const {
    news,
    categories,
    status,
    recommended,
    title,
    thumbnailImage,
    politicalParty,
    partyScores,
    setCategories,
    setStatus,
    setRecommended,
    setPoliticalParty,
    resetEditor,
  } = useEditNews();
  const [sources, setSources] = useState("");

  const availableCategories = useMemo(
    () =>
      [
        ...new Set(
          fetchedCategories
            .map((item) => (typeof item === "string" ? item : item?.name))
            .filter(Boolean),
        ),
      ].slice(0, 16),
    [fetchedCategories],
  );

  const toggleCategory = (categoryName) => {
    setCategories((current) =>
      current.includes(categoryName)
        ? current.filter((item) => item !== categoryName)
        : [...current, categoryName],
    );
  };

  const handleSubmit = async (publish = true) => {
    const res = await uploadNews({
      news,
      status: publish,
      categories,
      recommended,
      title: title.trim(),
      thumbnailImage,
      politicalParty:
        politicalParty.trim() || getPoliticalPartyLabel(partyScores),
      partyScores,
      sources,
    });

    if (res?.success) {
      resetEditor();
      setSources("");
    }
  };

  return (
    <section className="rounded-3xl bg-[#d9d9d9] p-6">
      <div className="space-y-6">
        <PanelHeading title="Төлөв ба харагдах байдал" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm">Харагдах байдал</span>
          <Select value={status || "draft"} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-28 rounded-full border-black/70 bg-transparent">
              <SelectValue placeholder="Нийтэлсэн" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {STATUS_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-center justify-between gap-3 text-sm">
          Санал болгох
          <Checkbox
            checked={recommended}
            onCheckedChange={(checked) => setRecommended(Boolean(checked))}
          />
        </label>

        <div className="space-y-2">
          <p className="text-sm">Улс төрийн нам</p>
          <Input
            value={politicalParty}
            onChange={(event) => setPoliticalParty(event.target.value)}
            placeholder="Заавал биш"
            className="h-9 rounded-full border-black/40 bg-transparent"
          />
        </div>

        <PanelHeading title="Ангилал" />
        <div className="grid grid-cols-2 gap-3">
          {categoriesLoading ? (
            <p className="col-span-2 text-xs text-black/45">Ачааллаж байна...</p>
          ) : (
            availableCategories.map((categoryName) => {
              const active = categories.includes(categoryName);

              return (
                <button
                  key={categoryName}
                  type="button"
                  onClick={() => toggleCategory(categoryName)}
                  className={`h-8 rounded-full border border-black/70 px-3 text-xs transition ${
                    active ? "bg-black text-white" : "bg-transparent text-black"
                  }`}
                >
                  {getCategoryDisplayName(categoryName)}
                </button>
              );
            })
          )}
        </div>

        <PanelHeading title="Эх сурвалж" />
        <Textarea
          value={sources}
          onChange={(event) => setSources(event.target.value)}
          placeholder="Эх сурвалжаа оруулна уу..."
          className="min-h-28 resize-none rounded-xl border-black/70 bg-transparent text-xs"
        />

        <div className="space-y-2 text-center">
          <Button
            type="button"
            className="h-8 rounded-none bg-transparent px-4 text-sm font-bold italic text-black shadow-none hover:bg-transparent"
            disabled={uploadLoading || !title.trim() || news.length === 0}
            onClick={() => handleSubmit(true)}
          >
            <GreenBgTitle title={uploadLoading ? "Нийтэлж байна..." : "Нийтлэх"} />
          </Button>
          <button
            type="button"
            disabled={uploadLoading || !title.trim() || news.length === 0}
            onClick={() => handleSubmit(false)}
            className="block w-full text-sm font-bold italic underline disabled:opacity-50"
          >
            Ноорог болгон хадгалах
          </button>
        </div>
      </div>
    </section>
  );
};

export const CoverageDetails = () => {
  const {
    partyScores,
    politicalSources,
    setPartyScores,
    setPoliticalSources,
  } = useEditNews();
  const sourceCounts = getSourceCounts(politicalSources);
  const totalScore = politicalParties.reduce(
    (total, party) => total + Number(partyScores?.[party.id] || 0),
    0,
  );
  const sourceIndicator = getSourceIndicatorLabel(politicalSources);

  const toggleSourceSelection = (source, checked) => {
    const nextSources = checked
      ? [...new Set([...politicalSources, source])]
      : politicalSources.filter((item) => item !== source);

    setPoliticalSources(nextSources);
    setPartyScores(getPartyScoresFromSources(nextSources));
  };

  return (
    <section className="rounded-3xl bg-[#d9d9d9] p-6">
      <PanelHeading title="Хамаарлын мэдээлэл" />
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span>Нийт оноо:</span>
          <span>{totalScore}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Сонгосон эх сурвалж:</span>
          <span>{politicalSources.length}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Индикатор:</span>
          <span>{sourceIndicator}</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-black/70 p-3">
        <div className="overflow-hidden rounded-full bg-white">
          <div className="flex h-4">
            {politicalParties.map((party) => {
              const score = Number(partyScores?.[party.id] || 0);
              const width = totalScore > 0 ? (score / totalScore) * 100 : 0;

              return (
                <span
                  key={party.id}
                  style={{
                    width: `${width}%`,
                    backgroundColor: party.color,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {sourceCounts.map((group) => (
            <div key={group.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  {group.title}
                </span>
                <span>{group.count}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {group.sources.map((source) => (
                  <label
                    key={source}
                    className="flex items-center justify-between gap-2 rounded-xl border border-black/20 bg-white/35 px-3 py-2 text-xs"
                  >
                    <span>{source}</span>
                    <Checkbox
                      checked={politicalSources.includes(source)}
                      onCheckedChange={(checked) =>
                        toggleSourceSelection(source, Boolean(checked))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 border-b border-black/60 pb-2 text-center text-xs text-black/45">
          Эх сурвалжуудын хандлагаар нийтлэлийн улс төрийн индикатор автоматаар
          тооцогдоно.
        </p>
      </div>

      <p className="mt-4 flex gap-2 text-xs text-black/45">
        <Info className="mt-0.5 size-4 shrink-0" />
        Энэ мэдээлэл нийтлэлийн улс төрийн хамаарлын шүүлтүүрт ашиглагдана.
      </p>
    </section>
  );
};

const PanelHeading = ({ title }) => {
  return (
    <div className="space-y-3 text-center">
      <div className="flex items-center justify-center gap-2 text-sm font-bold">
        {title}
        <ChevronDown className="size-3" />
      </div>
      <div className="mx-auto h-px w-36 bg-black/70" />
    </div>
  );
};
