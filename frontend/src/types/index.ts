export interface BaseParams {
  [key: string]: string | string[] | undefined;
}

export interface RouteParams extends BaseParams {
  documentId?: string;
}

export type Params = Promise<RouteParams>;
export type SearchParams = Promise<BaseParams>;

export type TImage = {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
};

export type TLink = {
  id: number;
  href: string;
  label: string;
  isExternal?: boolean;
};

export type TFeature = {
  id: number;
  heading: string;
  subHeading: string;
  icon: string;
};

export type THomePage = {
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks: any;
};

export type THeader = {
  logoText: TLink;
  ctaButton: TLink;
};

export type TFooter = {
  logoText: TLink;
  text: string;
  socialLink: TLink[];
};

export type TGlobal = {
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  header: THeader;
  footer: TFooter;
};

export type TMetaData = {
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type TSummary = {
  documentId: string;
  videoId: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type TAuthUser = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  credits?: number;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type TStrapiResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  status: number;
};

export interface IHeroSectionProps {
  id: number;
  documentId: string;
  __component: string;
  heading: string;
  subHeading: string;
  image: TImage;
  link: TLink;
}

export interface IFeaturesSectionProps {
  id: number;
  documentId: string;
  __component: string;
  heading: string;
  subHeading: string;
  features: TFeature[];
}

export type TTour = {
  id: string;
  url: string;
  category: string | null;
  shortCategory: string;
  device: string | null;
  carousel?: boolean;
  title?: string | null;
  description?: string | null;
  cover?: string | null;
};

export type TVr = {
  id: string;
  url: string;
  category: string | null;
  shortCategory: string;
  device: string | null;
  title?: string | null;
  description?: string | null;
  cover?: string | null;
  assetCover?: string;
  remoteCover?: string | null;
  author?: number | null;
};

export type TVrDevice = {
  id: string;
  name: string;
};

export type TVrTag = {
  id: string;
  type: "category" | "device" | "misc";
  label: string;
};

export type TVrTagMap = {
  vrId: string;
  tagId: string;
};

export type TProfessional = {
  id: number;
  name: string;
  slug?: string;
  shortBio?: string;
  aboutTheCreator?: string;
  Location?: string;
  Website?: string;
  email?: string;
  CountryTag?: string;
  CityTag?: string;
  vrIds?: string[];
  youtubeId?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  vimeo?: string;
  blogArticle?: string;
  behindScenesVideo?: string;
};

export type TCarouselEntry = {
  vrId: string;
  order?: number;
  title?: string | null;
  description?: string | null;
  cover?: string | null;
  imagePath?: string | null;
  assetPath?: string | null;
};
