import { Container } from "@app/components/common/container"
import { getPostBySlug } from "@libs/util/server/posts.server";
import clsx from "clsx";
import { Link } from "react-router";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
interface BlogPost {
  id: string;
  title: string;
  description: string;
  slug: string;
  sub_title: string;
  content: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const slugHandle = params.slugHandle as string;
  const { post }: { post: BlogPost } = await getPostBySlug(slugHandle);

  const postData = post?.length > 0 ? post[0] : null;

  return {
    post: postData,
  };
};

export type BlogsIndexRouteLoader = typeof loader;

export default function BlogsIndexRoute() {
  const { post } = useLoaderData<BlogsIndexRouteLoader>();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log(post);
  return (
    <section>
      <Container className="flex flex-col gap-12">
        {post && (
          <>
            <div className="flex flex-col gap-4">
              <h1 className="text-[110px] font-bold leading-[114px] tracking-0% text-center">{post.title}</h1>
              <p className="font-centuryBook italic text-[125px] leading-[114px] text-center">{post.sub_title}</p>
              <p className="text-lg font-montserrat font-normal text-[15px] leading-[26px] text-center max-w-3xl mx-auto">
                {post.description}
              </p>
            </div>
            <div className="flex flex-col gap-12">
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
          </>
        )}
        <div className="flex justify-center items-center relative mb-[100px]">
          <img src="/assets/images/blog-btn.webp" className="max-w-[500px]" alt="explore more thought" />
          <Link
            to="/blogs"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-white px-6 rounded-full border border-primary text-primary bg-outline-primary hover:bg-primary-800 focus:border-primary-500 py-2 whitespace-nowrap !font-bold transition-colors duration-200 justify-center items-center flex"
          >
            explore more thought
          </Link>
        </div>
      </Container>
      <button
        id="back-to-top"
        onClick={scrollToTop}
        className={clsx(
          "fixed bottom-8 right-8 z-50 transition-all duration-300 hover:scale-110 cursor-pointer",
          showBackToTop ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        aria-label="Back to top"
      >
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="28" cy="28" r="28" transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 56 56)" fill="black" />
          <path d="M26.5858 17.97C27.3668 17.189 28.6332 17.189 29.4142 17.97L42.1421 30.6979C42.9232 31.479 42.9232 32.7453 42.1421 33.5264C41.3611 34.3074 40.0948 34.3074 39.3137 33.5264L28 22.2127L16.6863 33.5264C15.9052 34.3074 14.6389 34.3074 13.8579 33.5264C13.0768 32.7453 13.0768 31.479 13.8579 30.6979L26.5858 17.97ZM28 21.5381L26 21.5381L26 19.3842L28 19.3842L30 19.3842L30 21.5381L28 21.5381Z" fill="white" />
        </svg>
      </button>
    </section>
  );
}