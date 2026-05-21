import type { HTMLAttributes } from 'react';

export default ({ color = '#FFFFFF80', ...props }: HTMLAttributes<HTMLOrSVGElement>) => (
  <svg width="28" height="28" viewBox="0 0 28 28" {...props} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.8751 2.31763H17.3959C15.8581 2.31763 14.3832 2.92855 13.2957 4.016C12.2083 5.10345 11.5973 6.57835 11.5973 8.11624V11.5954H8.11816V16.2343H11.5973V25.5121H16.2362V16.2343H19.7154L20.8751 11.5954H16.2362V8.11624C16.2362 7.80866 16.3584 7.51368 16.5759 7.29619C16.7934 7.0787 17.0884 6.95652 17.3959 6.95652H20.8751V2.31763Z" fill="white" fill-opacity="0.5" />
  </svg>
);
