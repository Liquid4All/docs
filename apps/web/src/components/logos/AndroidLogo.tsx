import { FC, SVGProps } from 'react';

const AndroidLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="-147 -70 294 345"
    {...props}
  >
    <g fill="#a4c639">
      <use xlinkHref="#a" stroke="#FFF" strokeWidth={14.4} />
      <use xlinkHref="#b" transform="scale(-1 1)" />
      <g id="b" stroke="#FFF" strokeWidth={7.2}>
        <rect width={13} height={86} x={14} y={-86} rx={6.5} transform="rotate(29)" />
        <rect id="c" width={48} height={133} x={-143} y={41} rx={24} />
        <use xlinkHref="#c" x={85} y={97} />
      </g>
      <g id="a">
        <ellipse cy={41} rx={91} ry={84} />
        <rect width={182} height={182} x={-91} y={20} rx={22} />
      </g>
    </g>
    <g fill="#FFF" stroke="#FFF" strokeWidth={7.2}>
      <path d="M-95 44.5H95" />
      <circle cx={-42} r={4} />
      <circle cx={42} r={4} />
    </g>
  </svg>
);
export default AndroidLogo;
