import { Button, ButtonBase } from "@app/components/common/buttons";
import { Container } from "@app/components/common/container"
import { listPosts } from "@libs/util/server/posts.server";
import { withPaginationParams } from "@libs/util/withPaginationParams";
import clsx from "clsx";
import { Link } from "react-router";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { limit: postsLimit, offset: postsOffset } = withPaginationParams({
    request: request,
    defaultPageSize: 2,
  });

  const data = await listPosts();

  return {
    count: data?.length,
    limit: postsLimit,
    offset: postsOffset,
    posts: data,
  };
};

export type BlogsIndexRouteLoader = typeof loader;

export default function BlogsIndexRoute() {
  const data = useLoaderData<BlogsIndexRouteLoader>();

  return (
    <Container className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-[110px] font-bold leading-[114px] tracking-0% text-center">THIS IS OUR</h1>
        <p className="font-centuryBook italic text-[125px] leading-[114px] text-center">Blogs</p>
        <p className="text-lg font-montserrat font-normal text-[15px] leading-[26px] text-center max-w-3xl mx-auto">Brings you to a cozy café on a sun-drenched morning. The scent blends rich, freshly brewed coffee with a hint of creamy vanilla and warm spices.</p>
      </div>
      <div className="flex flex-col gap-12">
        {data.posts.map((post, index) => (
          <div key={post.id} className={clsx("flex gap-4", index % 2 === 0 ? "flex-row" : "flex-row-reverse")}>
            <div className="w-[70%] h-full aspect-[2/1] overflow-hidden rounded-lg mb-4">
              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <div className="w-[30%] flex flex-col gap-6 items-start justify-center">
              <h3 className="font-alexandria font-extrabold text-[49.62px] leading-[54.27px] tracking-0%">{post.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: post.description }}></div>
              <Link
                to={`/blogs/${post.slug}`}
                className="button--primary w-[155px] text-white bg-primary hover:bg-primary-800 focus:border-primary-500 !h-12 mt-4 whitespace-nowrap !text-base !font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed !rounded-2xl justify-center items-center flex"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Container>

  );
}