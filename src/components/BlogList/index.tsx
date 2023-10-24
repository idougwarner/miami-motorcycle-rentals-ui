import { blogs } from "@/constants/blogs";
import BlogCard from "../BlogCard";
import { DivBlogListContainer, DivBlogListWrapper, H2Title } from "./styles";

function BlogList() {

  return (
    <>
      <DivBlogListContainer>
        <H2Title>Blog</H2Title>

        <DivBlogListWrapper>
          {blogs?.map((blog, idx) => (
            <BlogCard key={idx} blog={blog} />
          ))}
        </DivBlogListWrapper>
      </DivBlogListContainer>
    </>
  );
}

export default BlogList;
