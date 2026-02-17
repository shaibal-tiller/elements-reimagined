import React from 'react';

const MarqueeRow = ({ icons, direction, duration }) => {
  const IconList = () => (
    <>
      {icons.map((Icon, idx) => <Icon key={idx} className="w-12 h-12 text-slate-900" />)}
    </>
  );

  return (
    <div
      className="flex gap-12 min-w-max"
      style={{
        animation: `marquee-${direction} ${duration} linear infinite`
      }}
    >
      <IconList />
      <IconList />
      <IconList />
      <IconList />
    </div>
  );
};

export default MarqueeRow;
