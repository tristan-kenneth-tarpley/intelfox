import { appConfig } from '@/config';
import axios from 'axios';

const spyfuAuthAsB64 = Buffer.from(`${appConfig.spyfuAppId}:${appConfig.spyfuSecretKey}`).toString('base64');

const spyfuAxios = axios.create({
  baseURL: 'https://www.spyfu.com/apis',
  headers: {
    Authorization: `Basic ${spyfuAuthAsB64}`,
  },
});

export interface SEOKeywordsForDomainResponse {
  resultCount: number;
  results: Array<{
    keyword: string;
    topRankedUrl: string;
    rank: number;
    rankChange: number;
    searchVolume: number;
    keywordDifficulty: number;
    broadCostPerClick: number;
    phraseCostPerClick: number;
    exactCostPerClick: number;
    seoClicks: number;
    seoClicksChange: number;
    totalMonthlyClicks: number;
    percentMobileSearches: number;
    percentDesktopSearches: number;
    percentNotClicked: number;
    percentPaidClicks: number;
    percentOrganicClicks: number;
    broadMonthlyCost: number;
    phraseMonthlyCost: number;
    exactMonthlyCost: number;
    paidCompetitors: number;
    rankingHomepages: number;
  }>;
  totalMatchingResults: number;
}

interface CompetitorInfo {
  domain: string;
  commonTerms: number;
}

export interface CompetitorAPIResponse {
  resultCount: number;
  totalMatchingResults: number;
  results: CompetitorInfo[];
}

interface PPCKeywordResult {
  keyword: string;
  searchVolume: number;
  rankingDifficulty: number;
  totalMonthlyClicks: number;
  percentMobileSearches: number;
  percentDesktopSearches: number;
  percentSearchesNotClicked: number;
  percentPaidClicks: number;
  percentOrganicClicks: number;
  broadCostPerClick: number;
  phraseCostPerClick: number;
  exactCostPerClick: number;
  broadMonthlyClicks: number;
  phraseMonthlyClicks: number;
  exactMonthlyClicks: number;
  broadMonthlyCost: number;
  phraseMonthlyCost: number;
  exactMonthlyCost: number;
  paidCompetitors: number;
  distinctCompetitors: string[];
  rankingHomepages: number;
  serpFeaturesCsv: string;
  serpFirstResult: string;
  isQuestion: boolean;
  isNotSafeForWork: boolean;
  adPosition: number;
}

export interface PPCKeywordAPIResponse {
  resultCount: number;
  totalMatchingResults: number;
  results: PPCKeywordResult[];
}

export const spyfuService = {
  getPPCCompetitors: (domain: string) => spyfuAxios.get<CompetitorAPIResponse>(`/competitors_api/v2/ppc/getTopCompetitors?${new URLSearchParams({
    domain,
    startingRow: '1',
    pageSize: '5',
    countryCode: 'US',
  }).toString()}`),
  getSEOCompetitors: (domain: string) => spyfuAxios.get<CompetitorAPIResponse>(`/competitors_api/v2/seo/getTopCompetitors?${new URLSearchParams({
    domain,
    startingRow: '1',
    pageSize: '5',
    countryCode: 'US',
  }).toString()}`),
  getMostSuccessfulPPCKeywords: (query: string) => spyfuAxios.get<PPCKeywordAPIResponse>(`/keyword_api/v2/ppc/getMostSuccessful?${new URLSearchParams({
    query,
    startingRow: '1',
    pageSize: '5',
    countryCode: 'US',
  }).toString()}`),
  getSEOKeywordsByValue: (query: string) => spyfuAxios.get<SEOKeywordsForDomainResponse>(`/serp_api/v2/seo/getMostValuableKeywords?${new URLSearchParams({
    query,
    startingRow: '1',
    pageSize: '5',
    countryCode: 'US',
  }).toString()}`),
};
