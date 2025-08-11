'use client';

import React from 'react';

import iOSQRCode from '@/assets/images/apollo-ios-qr-code.png';
import { cn } from '@/lib/utils';

const ORIGINAL_iOS_BADGE_WIDTH = 246;
const ORIGINAL_iOS_BADGE_HEIGHT = 82;

type DisplayType = 'badge' | 'qr' | 'badge-qr';

interface AppStoreLinkProps {
  link: string;
  className?: string;
  height?: number;
  display?: DisplayType;
}

const AppStoreLink: React.FC<AppStoreLinkProps> = ({
  link,
  className = '',
  height = ORIGINAL_iOS_BADGE_HEIGHT,
  display = 'badge',
}) => {
  const theme = 'light';

  const badgeUrl = `https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/white/en-us?releaseDate=1721692800`;
  const badgeWidth = Math.round((height * ORIGINAL_iOS_BADGE_WIDTH) / ORIGINAL_iOS_BADGE_HEIGHT);

  const showBadge = display === 'badge' || display === 'badge-qr';
  const showQR = display === 'qr' || display === 'badge-qr';

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {showBadge && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block">
          <img
            src={badgeUrl}
            alt="Download Apollo from the App Store"
            className="object-contain"
            style={{ width: `${badgeWidth}px`, height: `${height}px`, background: 'transparent' }}
          />
        </a>
      )}

      {showQR && (
        <div className="bg-white rounded rounded-lg border  border-[0.09rem] overflow-hidden border-black">
          <img
            src={iOSQRCode.src}
            alt="QR Code for Apollo App in iOS App Store"
            className="object-contain"
            style={{ width: `${height - 2}px`, height: `${height - 2}px` }}
          />
        </div>
      )}
    </div>
  );
};

export default AppStoreLink;
