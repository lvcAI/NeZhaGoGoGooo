import { useState, useEffect } from 'react'
import { Card, Table, Select } from 'antd'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import './App.css'
import { mockMovieData } from './mockData'
import confetti from 'canvas-confetti'
import { useTranslation } from 'react-i18next'
import './i18n'
import { Analytics } from "@vercel/analytics/react"
import AdComponent from './components/AdComponent'

const LanguageSelect = styled(Select)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 120px;
  z-index: 1000;

  @media screen and (max-width: 768px) {
    top: 10px;
    right: 10px;
  }
`

const Container = styled.div`
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;

  @media screen and (max-width: 768px) {
    padding: 10px;
  }

  @media screen and (max-width: 576px) {
    padding: 5px;
  }
`

const BattleCard = styled(Card)`
  margin-bottom: 20px;
  .ant-card-head-title {
    text-align: center;
  }
`

const BattleContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 10px;
  }
`

const MovieCard = styled(motion.div)`
  text-align: center;
  width: 200px;
  position: relative;

  @media screen and (max-width: 768px) {
    width: 160px;
  }

  @media screen and (max-width: 576px) {
    width: 140px;
  }
  img {
    width: 100%;
    height: 300px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 10px;
  }
  h3 {
    margin: 8px 0;
    font-size: 16px;
  }
  p {
    color: #f50;
    font-weight: bold;
  }
`

const FloatingNumber = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #52c41a;
  font-weight: bold;
  font-size: 36px;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.25);
  z-index: 1000;
  white-space: nowrap;
  min-width: min-content;
`

const VsText = styled.div`
  font-size: 32px;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(45deg, #ff4d4f, #ff7875);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 77, 79, 0.3);
  animation: pulse 2s ease-in-out infinite;
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`

function App() {
  const { t, i18n } = useTranslation()
  const [movieData, setMovieData] = useState([])
  const [realTimeData, setRealTimeData] = useState(null)

  const formatBox = (value, language) => {
    const numValue = parseFloat(value);
    if (language === 'en') {
      // 将亿转换为十亿（Billion），1 Billion = 10亿
      if (numValue >= 10) {
        // 大于等于10亿的显示为B
        return `${(numValue / 10).toFixed(2)}B`;
      } else {
        // 小于10亿的显示为M，需要将亿转换为百万（Million），1M = 100万
        return `${(numValue * 100).toFixed(0)}M`;
      }
    }
    // 中文模式下保持原有的亿为单位
    return `${numValue.toFixed(2)}亿`;
  };

  const columns = [
    {
      title: t('column.rank'),
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (text) => {
        const containerStyle = {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '32px',
          width: '100%'
        }
        if (text <= 3) {
          return (
            <div style={containerStyle}>
              <img src={`/imgage/rank${text}.png`} alt={`Rank ${text}`} style={{ width: '24px', height: '24px' }} />
            </div>
          )
        }
        return <div style={containerStyle}>{text}</div>
      }
    },
    {
      title: t('column.movieName'),
      dataIndex: i18n.language === 'en' ? 'movieNameEn' : 'movieName',
      key: 'movieName',
      render: (text, record) => (
        <span
          style={{
            color: record.movieId === 1294273  ? '#ff4d4f' : 'inherit',
            fontWeight: record.movieId === 1294273  ? 'bold' : 'normal'
          }}
        >
          {text}
          {record.movieId === 1294273  && ' 🔥'}
        </span>
      )
    },
    {
      title: t('column.releaseTime'),
      dataIndex: 'releaseTime',
      key: 'releaseTime',
      width: 100,
    },
    {
      title: t('column.box'),
      dataIndex: 'box',
      key: 'box',
      width: 120,
      render: (text) => <span style={{ color: '#f50', fontWeight: 'bold' }}>{formatBox(text.replace('亿', ''), i18n.language)}</span>
    },
  ]

  const [showFloatingNumber, setShowFloatingNumber] = useState(false)

  useEffect(() => {
    // 初始化数据
    const initialData = mockMovieData.map(movie => ({ ...movie }));
    setRealTimeData(initialData);
    const sortedInitialData = initialData
      .sort((a, b) => b.rawValue - a.rawValue)
      .map((movie, index) => ({
        ...movie,
        rank: index + 1,
        box: `${movie.box}亿`
      }));
    setMovieData(sortedInitialData);

    const triggerFireworks = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ffd700', '#ff69b4', '#00ff00', '#4169e1']
    });
  };

  const processData = () => {
      const now = new Date().toLocaleString();
      console.log(`[${now}] 开始处理电影数据...`);
      setRealTimeData(prevData => {
        const updatedData = prevData.map((movie) => {
          if (movie.movieId === 1294273) {
            const oldValue = movie.rawValue;
            const randomIncrease = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            const newValue = oldValue + randomIncrease;
            const formattedIncrease = (randomIncrease / 10000).toFixed(0);
            console.log(`[${now}] 哪吒票房更新：${oldValue} -> ${newValue} (增加${formattedIncrease}万)`);
            
            // 检查是否跨过整亿
            const oldBillion = Math.floor(oldValue / 100000000);
            const newBillion = Math.floor(newValue / 100000000);
            if (newBillion > oldBillion) {
              triggerFireworks();
            }
            
            return {
              ...movie,
              rawValue: newValue,
              box: (newValue / 100000000).toFixed(2),
              increase: i18n.language === 'en' ? 
                (randomIncrease >= 100000 ? `+${(randomIncrease / 100000).toFixed(1)}十万` : `+${(randomIncrease / 1000).toFixed(1)}K`) : 
                `+${formattedIncrease}万`
            };
          }
          return movie;
        });

        const sortedData = updatedData
          .sort((a, b) => b.rawValue - a.rawValue)
          .map((movie, index) => {
            const movieData = {
              ...movie,
              rank: index + 1,
              box: `${movie.box}亿`,
              change: movie.increase || null
            };
            if (movie.movieId === 1294273) {
              console.log(`[${now}] 哪吒当前排名：第${movieData.rank}名`);
              // 先重置状态，确保动画可以重新触发
              setShowFloatingNumber(false);
              // 使用setTimeout延迟设置状态，确保状态已经被重置
              setTimeout(() => {
                setShowFloatingNumber(true);
                // 10秒后再重置状态
                setTimeout(() => setShowFloatingNumber(false), 3000);
              }, 100);
            }
            return movieData;
          });

        setMovieData(sortedData);
        return updatedData;
      });
      console.log(`[${now}] 数据处理完成`);
    };
    
    const timer = setInterval(processData, 5000); // 每30秒更新一次数据

    return () => {
      clearInterval(timer);
    };
  }, []); // 只在组件挂载时执行一次

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value)
  }

  return (
    <Container>
      <AdComponent position="left" />
      <AdComponent position="right" />
      <LanguageSelect
        defaultValue="en"
        onChange={handleLanguageChange}
        options={[
          { value: 'en', label: t('language.en') },
          { value: 'zh', label: t('language.zh') }
        ]}
      />
      <BattleCard title={t('title.battle')}>
        <BattleContainer>
          {movieData.map((movie, index) => {
            if (movie.movieId === 1294273) {
              const prevMovie = movieData[index - 1];
              return prevMovie && (
                <>
                  <MovieCard
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <img src={prevMovie.poster} alt={prevMovie.movieName} />
                    <h3>
                      {prevMovie.rank <= 3 ? (
                        <img
                          src={`/imgage/rank${prevMovie.rank}.png`}
                          alt={`Rank ${prevMovie.rank}`}
                          style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}
                        />
                      ) : (
                        <span style={{ 
                          display: 'inline-block',
                          marginRight: '8px',
                          color: '#666',
                          fontSize: '14px',
                          fontWeight: 'normal',
                          verticalAlign: 'middle'
                        }}>
                          {prevMovie.rank}
                        </span>
                      )}
                      {i18n.language === 'en' ? prevMovie.movieNameEn : prevMovie.movieName}
                    </h3>
                    <p>{formatBox(prevMovie.box.replace('亿', ''), i18n.language)}</p>
                  </MovieCard>
                  <VsText>VS</VsText>
              
                  <MovieCard
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <img src={movie.poster} alt={movie.movieName} />
                    <h3>
                      {movie.rank <= 3 ? (
                        <img
                          src={`/imgage/rank${movie.rank}.png`}
                          alt={`Rank ${movie.rank}`}
                          style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}
                        />
                      ) : (
                        <span style={{ 
                          display: 'inline-block',
                          marginRight: '8px',
                          color: '#666',
                          fontSize: '14px',
                          fontWeight: 'normal',
                          verticalAlign: 'middle'
                        }}>
                          {movie.rank}
                        </span>
                      )}
                      {i18n.language === 'en' ? movie.movieNameEn : movie.movieName}
                    </h3>
                    <p>{formatBox(movie.box.replace('亿', ''), i18n.language)}</p>
                    {showFloatingNumber && (
                      <FloatingNumber
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: -100, opacity: 0 }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                      >
                        {movie.increase}
                      </FloatingNumber>
                    )}
                  </MovieCard>
                </>
              );
            }
            return null;
          })}
        </BattleContainer>
      </BattleCard>

      <Card title={t('title.ranking')}>
        <Table
          columns={columns}
          dataSource={movieData}
          rowKey="movieId"
          pagination={false}
        />
      </Card>
    </Container>
  )
}

export default App
