import { StaticImageData } from 'next/image';
import React from 'react';

import iOSQRCode from '@/assets/images/apollo-ios-qr-code.png';

type DisplayType = 'badge' | 'qr' | 'icon' | 'badge-qr' | 'badge-icon' | 'qr-icon' | 'all';

interface AppStoreLinkProps {
  platform: 'android' | 'ios';
  link: string;
  theme?: 'dark' | 'light';
  className?: string;
  height?: number;
  display?: DisplayType;
  qrCodePath?: string | StaticImageData;
  appIconUrl?: string;
}

const AppStoreLink: React.FC<AppStoreLinkProps> = ({
  platform,
  link,
  theme = 'dark',
  className = '',
  height = 82,
  display = 'badge',
  qrCodePath = iOSQRCode,
  appIconUrl = 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/bc/f9/fd/bcf9fde9-3c42-8902-9106-cb8e1e9cf3e8/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/540x540bb.jpg',
}) => {
  const badgeUrl =
    platform === 'ios'
      ? `https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/${theme === 'dark' ? 'black' : 'white'}/en-us?releaseDate=1721692800`
      : '';

  const qrImageSrc = typeof qrCodePath === 'string' ? qrCodePath : qrCodePath.src;
  const badgeWidth = Math.round((height * 246) / 82);
  const iconSize = height;

  const themeClasses = {
    dark: 'bg-black text-white hover:bg-slate-800',
    light: 'bg-white text-black border border-neutral-100 hover:bg-[var(--bg-primary)]',
  };

  const showBadge = display.includes('badge');
  const showQR = display.includes('qr');
  const showIcon = display.includes('icon');

  if (platform === 'android') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${themeClasses[theme]} ${className}`}
      >
        <span>Coming Soon!</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-4 ${className}`}>
      {showBadge && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block">
          <img
            src={badgeUrl}
            alt="Download on the App Store"
            className="object-contain"
            style={{ width: `${badgeWidth}px`, height: `${height}px` }}
          />
        </a>
      )}

      {showQR && (
        <div>
          <img
            src={qrImageSrc}
            alt="QR Code for App Store"
            className="object-contain"
            style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
          />
        </div>
      )}

      {showIcon && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block align-middle overflow-hidden"
          style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
        >
          <img
            src={appIconUrl}
            alt="App Icon"
            className="w-full h-full object-contain"
            style={{
              maskImage: 'var(--app-icon-mask)',
              WebkitMaskImage: 'var(--app-icon-mask)',
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 230.5 230.5"
            className="absolute top-0 left-0 w-full h-full pointer-events-none box-border"
          >
            <path
              fill="none"
              stroke="#000"
              strokeLinejoin="round"
              strokeMiterlimit="1.4"
              strokeOpacity=".1"
              strokeWidth="1"
              d="M158.2 230H64.1a320 320 0 0 1-7-.1c-5 0-10-.5-15-1.3a50.8 50.8 0 0 1-14.4-4.8 48.2 48.2 0 0 1-21-21 50.9 50.9 0 0 1-4.8-14.4 100.7 100.7 0 0 1-1.3-15v-7l-.1-8.2V64.1a320 320 0 0 1 .1-7c0-5 .5-10 1.3-15a50.7 50.7 0 0 1 4.8-14.4 48.2 48.2 0 0 1 21-21 51 51 0 0 1 14.4-4.8c5-.8 10-1.2 15-1.3a320 320 0 0 1 7 0l8.2-.1h94.1a320 320 0 0 1 7 .1c5 0 10 .5 15 1.3a52 52 0 0 1 14.4 4.8 48.2 48.2 0 0 1 21 21 50.9 50.9 0 0 1 4.8 14.4c.8 5 1.2 10 1.3 15a320 320 0 0 1 .1 7v102.3l-.1 7c0 5-.5 10-1.3 15a50.7 50.7 0 0 1-4.8 14.4 48.2 48.2 0 0 1-21 21 50.8 50.8 0 0 1-14.4 4.8c-5 .8-10 1.2-15 1.3a320 320 0 0 1-7 0l-8.2.1z"
            />
          </svg>
        </a>
      )}
    </div>
  );
};

export default AppStoreLink;
