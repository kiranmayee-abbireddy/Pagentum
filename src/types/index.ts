export interface SectionTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
  defaultContent: Record<string, string>;
}

export interface PageSection {
  id: string;
  templateId: string;
  order: number;
  content: Record<string, string>;
  customStyles?: Record<string, string>;
}

export interface Project {
  id: string;
  name: string;
  sections: PageSection[];
  theme: ThemeConfig;
  createdAt: number;
  updatedAt: number;
}

export interface ThemeConfig {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  spacing: string;
}

export interface PageImage {
  id: string;
  fileName: string;
  src: string; // base64 or path
  alt?: string;
}

export interface SectionLayout {
  variant?: 'image-left' | 'image-right';
  carouselStyle?: 'auto-scroll' | 'rail' | 'grid';
  showButton?: boolean;
  buttonLabel?: string;
  buttonHref?: string;
  themeId?: string;
}

export interface PageSection {
  id: string;
  templateId: string;
  order: number;
  content: Record<string, string>;
  customStyles?: Record<string, string>;
  images?: PageImage[];
  layout?: SectionLayout;
}
