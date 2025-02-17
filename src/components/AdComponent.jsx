import React, { useEffect } from 'react';
import styled from '@emotion/styled';

const AdContainer = styled.div`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 160px;
  height: 600px;
  z-index: 1000;
  background-color: transparent;
  display: block;

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }
`;

const AdComponent = ({ position }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <AdContainer className={position}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4853104399113349"
        data-ad-slot="1234567890"
        data-ad-format="vertical"
        data-full-width-responsive="false"
      />
    </AdContainer>
  );
};

export default AdComponent;