import * as React from 'react';
import { FC, SVGProps } from 'react';

const LiquidLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="#FFF"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m12.4 8.546-.009.005 3.142 5.25a3.84 3.84 0 0 1 .066 4.224L22 16.034 11.986 0 9.575 3.872zM7.017 24l5.029-4.053h-.013c-2.302 0-4.167-1.784-4.167-3.984 0-.795.245-1.534.664-2.156l2.972-4.976-2.47-4.087L2 16.034 7.008 24zM14.172 19.382h-.001L8.452 24h8.486l4.3-6.768z" />
  </svg>
);

export default LiquidLogo;
