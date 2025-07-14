import React from 'react';

type IconProps = {
  name: string;
  fill?: string;
};

const Icon: React.FC<IconProps> = ({ name, fill }) => {
  // This is a placeholder. In a real app, you'd load SVG icons dynamically
  // or use an icon library. For now, we'll just display the name.
  return (
    <span style={{ color: fill }}>
      {name}
    </span>
  );
};

export default Icon;


