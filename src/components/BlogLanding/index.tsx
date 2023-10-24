import { blogs } from "@/constants/blogs";
import BlogCard from "../BlogCard";
import {
  DivBlogListWrapper,
  DivHeaderWrapper,
  DivLandingBannerWrapper,
  H1Title,
  PDescription,
} from "./styles";

function BlogLanding() {

  return (
    <>

      <div>
        <DivLandingBannerWrapper>
          <DivHeaderWrapper>
            <H1Title>Blog</H1Title>
            <PDescription>
              For the latest and most comprehensive information on top motorcycle trails, 
              exciting events in the motorcycle industry, and valuable tips for riders of all levels, 
              look no further. Whether youre searching for the perfect cruiser, sportbike, standard, or
              touring model motorcycle, we have you covered. Explore our content now and make an informed 
              decision that suits your preferences and needs.
            </PDescription>
          </DivHeaderWrapper>
        </DivLandingBannerWrapper>

        <DivBlogListWrapper>
          {blogs?.map((blog, idx) => (
            <BlogCard key={idx} blog={blog} isLanding />
          ))}
        </DivBlogListWrapper>
      </div>
    </>
  );
}

export default BlogLanding;
