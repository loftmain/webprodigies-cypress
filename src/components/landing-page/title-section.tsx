import React from "react";

interface TitleSectionProps {
  title: string;
  subheading?: string;
  pill: string;
}

const TitleSection = ({ title, subheading, pill }: TitleSectionProps) => {
  return (
    <React.Fragment>
      <section
        className="flex
    flex-col
    gap-4
    justify-center
    items-center
    md:items-center
    "
      >
        <article
          className="rounded-full
        p-[1px]
        text-sm
        dark:bg-gradient-to-r
        dark:from-brand/brand-primaryBlue
        dark:to-brand/brand-primaryPurple"
        >
          <div
            className="rounded-full
            px-3
            py-1
            dark:bg-black"
          >
            {pill}
          </div>
        </article>
        {subheading ? (
          <>
            <h2
              className="text-left
              text-3xl
              sm:text-5xl
              sm:max-w-[750px]
              md:text-center
              font-semibold
              text-brand/brand-washedPurple
              "
            >
              {title}
            </h2>
            <p
              className="
            text-washed-Purple/washed-purple-700
            "
            >
              {subheading}
            </p>
          </>
        ) : (
          <h1
            className="text-left
            text-4xl
            sm:text-6xl
            sm:max-w-[850px]
            md:text-center
            font-semibold
            text-brand/brand-washedPurple
            "
          >
            {title}
          </h1>
        )}
      </section>
    </React.Fragment>
  );
};

export default TitleSection;
