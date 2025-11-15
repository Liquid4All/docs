import { IconProps, TablerIcon } from '@tabler/icons-react';
import React, { ComponentType, useId } from 'react';

export interface GradientIconProps extends Omit<IconProps, 'color'> {
  Icon: TablerIcon;
  size?: number | string;
  strokeWidth?: number;
}

export const GradientIcon: React.FC<GradientIconProps> = ({
  Icon,
  size = 24,
  strokeWidth = 1.5,
  style,
  className,
  ...iconProps
}) => {
  const rawId = useId().replace(/:/g, '');
  const gradId = `grad-${rawId}`;

  const sizeNum = typeof size === 'string' ? parseInt(size, 10) || 24 : size;

  return (
    <Icon
      size={sizeNum}
      strokeWidth={strokeWidth}
      // Tabler maps `color` -> `stroke`, so this applies the gradient to strokes:
      color={`url(#${gradId})`}
      // Keep fill none so only strokes pick up the gradient
      fill="none"
      className={className}
      style={style}
      {...iconProps}
    >
      <defs>
        {/* Tabler icons use viewBox 0 0 24 24. Use userSpaceOnUse to avoid vertical-line bugs. */}
        <linearGradient
          id={gradId}
          x1="-1.5"
          y1="14"
          x2="31"
          y2="-0.499999"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#62D9FE" />
          <stop offset="0.5" stopColor="#B03EF7" />
        </linearGradient>
      </defs>
    </Icon>
  );
};
