import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'title.battle': 'Nezha Real-time Ranking Battle',
      'title.ranking': 'Global Box Office Ranking',
      'column.rank': 'Rank',
      'column.movieName': 'Movie Name',
      'column.releaseTime': 'Release Year',
      'column.box': 'Box Office (CNY)',
      'language': 'Language',
      'language.en': 'English',
      'language.zh': '中文'
    }
  },
  zh: {
    translation: {
      'title.battle': '哪吒 GO!GO!GO!!! 实时冲榜',
      'title.ranking': '全球影史天梯榜',
      'column.rank': '排名',
      'column.movieName': '电影名称',
      'column.releaseTime': '上映年份',
      'column.box': '总票房(单位:元)',
      'language': '语言',
      'language.en': 'English',
      'language.zh': '中文'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;