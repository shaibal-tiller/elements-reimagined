import React from 'react';

const Portfolio: React.FC = () => {
  return (
    <>
      <h1 className="heading-xl text-foreground mb-8">My Portfolio</h1>
      <p className="text-foreground text-lg mb-6">
        Check out my latest projects and creative work.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add your portfolio items here */}
        <div className="card-white p-6">
          <h3 className="text-xl font-bold mb-2">Project 1</h3>
          <p className="text-muted-foreground">Description of project...</p>
        </div>
        
        <div className="card-white p-6">
          <h3 className="text-xl font-bold mb-2">Project 2</h3>
          <p className="text-muted-foreground">Description of project...</p>
        </div>
      </div>
    </>
  );
};

export default Portfolio;