import { FormBuilder } from "@/app/core/form-builder";
import { blogFields } from "@/features/blog/domain/blog-field";
import { blogSchema } from "@/features/blog/domain/blog-schema";
import { useBlog } from "./use-blog";

const BlogForm = () => {

  const {handleSubmit,isLoading} = useBlog();

  return (
    <div className="w-1/3">
    <FormBuilder
      fields={blogFields}
      schema={blogSchema}
      onSubmit={handleSubmit}
      submitButtonText={isLoading ? "Creating..." : "Submit Blog"}
      defaultValues={{
        name: "",
        content: "",
        status: "draft",
        tags: [],
        slug: "",
        image: "",
        video: "",
        time_to_read: "",
      }}
    />
    </div>
  );
};

export default BlogForm;
