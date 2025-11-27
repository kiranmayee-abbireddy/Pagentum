import { getCategoryKeywords, sectionTemplates } from '../data/templates';
import { PageSection } from '../types';

export function parseInputToSections(input: string): PageSection[] {
  const sections: PageSection[] = [];
  const categoryKeywords = getCategoryKeywords();

  const lines = input
    .toLowerCase()
    .split(/[,\n]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  lines.forEach((line, index) => {
    let matchedCategory: string | null = null;
    let matchScore = 0;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (line.includes(keyword)) {
          const currentScore = keyword.length;
          if (currentScore > matchScore) {
            matchScore = currentScore;
            matchedCategory = category;
          }
        }
      }
    }

    if (matchedCategory) {
      const categoryTemplates = sectionTemplates.filter(t => t.category === matchedCategory);
      const template = categoryTemplates[0];

      if (template) {
        const section: PageSection = {
          id: `section-${Date.now()}-${index}`,
          templateId: template.id,
          order: sections.length,
          content: { ...template.defaultContent }
        };
        sections.push(section);
      }
    }
  });

  if (sections.length === 0 && lines.length > 0) {
    const heroTemplate = sectionTemplates.find(t => t.category === 'hero');
    if (heroTemplate) {
      sections.push({
        id: `section-${Date.now()}-0`,
        templateId: heroTemplate.id,
        order: 0,
        content: { ...heroTemplate.defaultContent }
      });
    }
  }

  return sections;
}

export function generateSectionSuggestions(query: string): string[] {
  const suggestions: string[] = [];
  const categoryKeywords = getCategoryKeywords();
  const lowerQuery = query.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (keyword.includes(lowerQuery) || lowerQuery.includes(keyword)) {
        const templates = sectionTemplates.filter(t => t.category === category);
        suggestions.push(...templates.map(t => t.name));
      }
    }
  }

  return Array.from(new Set(suggestions)).slice(0, 5);
}
