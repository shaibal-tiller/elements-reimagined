import React from 'react';
import { Calendar, Clock, ExternalLink, Tag } from 'lucide-react';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "React Ecosystem Trends in 2024",
      excerpt: "Exploring the latest developments in React's vibrant ecosystem, including state management with Zustand, data visualization tools, and emerging patterns that are shaping modern frontend development.",
      date: "April 3, 2024",
      readTime: "8 min read",
      tags: ["React", "Frontend", "Web Development"],
      source: "dev.to",
      link: "https://dev.to/avinashvagh/react-ecosystem-in-2024-418k"
    },
    {
      id: 2,
      title: "Next.js vs React: The 2024 Framework Showdown",
      excerpt: "A comprehensive comparison of React.js and Next.js, examining server-side rendering, performance optimization, and when to choose each framework for your projects. Understanding the strengths of both helps developers make informed decisions.",
      date: "February 12, 2024",
      readTime: "10 min read",
      tags: ["Next.js", "React", "Comparison"],
      source: "medium.com",
      link: "https://medium.com/@stevejacob45678/next-js-vs-react-js-2024-showdown-choosing-your-front-end-champion-1ceacbdb55b4"
    },
    {
      id: 3,
      title: "Building Scalable Applications with Next.js & TypeScript",
      excerpt: "Learn how to architect large-scale frontend systems using Next.js, React, Tailwind CSS, and TypeScript. This comprehensive guide covers SSR, SSG, and best practices for enterprise-level applications that scale efficiently.",
      date: "September 30, 2024",
      readTime: "12 min read",
      tags: ["Next.js", "TypeScript", "Architecture"],
      source: "medium.com",
      link: "https://medium.com/@priyanklad52/front-end-system-design-building-scalable-applications-with-next-js-2919438eeb67"
    },
    {
      id: 4,
      title: "Why React Won the Front-End Race",
      excerpt: "An insightful look at how React became the dominant force in frontend development. From Meta's backing to the vibrant ecosystem and timing of its release, we explore the factors that led to React's widespread adoption.",
      date: "September 16, 2024",
      readTime: "7 min read",
      tags: ["React", "History", "Web Development"],
      source: "dev.to",
      link: "https://dev.to/pranta/why-react-won-the-front-end-race-4e55"
    },
    {
      id: 5,
      title: "Frontend Development Roadmap 2024",
      excerpt: "A thorough roadmap for React developers covering everything from fundamentals to advanced concepts. Includes hooks, Context API, routing with React Router, testing strategies, and modern deployment practices with CI/CD pipelines.",
      date: "January 24, 2024",
      readTime: "15 min read",
      tags: ["React", "Roadmap", "Learning"],
      source: "medium.com",
      link: "https://medium.com/@hurairmirza19/the-react-js-developer-roadmap-2024-navigating-the-future-of-front-end-development-e8a438fee98a"
    }
  ];

  return (
    <>
      {/* Blog Posts Grid */}
      <div className="space-y-6">
        {blogPosts.map((post, index) => (
          <article
            key={post.id}
            className="card-white p-6 hover:shadow-xl transition-all duration-300 animate-fadeUp"
            
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
              <a href={post.link} target="_blank" rel="noopener noreferrer">
                {post.title}
              </a>
            </h2>

            {/* Excerpt */}
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                  {post.source}
                </span>
              </div>
            </div>

            {/* Read More Link */}
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              Read Full Article
              <ExternalLink className="w-4 h-4" />
            </a>
          </article>
        ))}
      </div>

      {/* CTA Section */}
      <div className="card-white p-8 text-center mt-12 animate-fadeUp" s>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Want to stay updated?
        </h3>
        <p className="text-muted-foreground mb-6">
          Follow me on social media for more frontend development insights and tutorials.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/shaibalsharif"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lime"
          >
            Follow on GitHub
          </a>
        </div>
      </div>
    </>
  );
};

export { Blog };