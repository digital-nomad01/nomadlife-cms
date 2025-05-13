import { FormBuilder } from "@/app/core/form-builder";
import { blogFields } from "@/features/blog/domain/blog-field";
import { blogSchema } from "@/features/blog/domain/blog-schema";

const BlogForm = () => {
  const handleSubmit = (data: any) => {
    console.log("Blog form data is submitted>>>", data);
  };

  return (
    <FormBuilder
      fields={blogFields}
      schema={blogSchema}
      onSubmit={handleSubmit}
      submitButtonText="Submit Blog"
      defaultValues={{
        name: "",
        content: "",
        status: "draft",
        tags: "",
        slug: "",
        image: "",
        video: "",
        time_to_read: 0,
      }}
    />
  );
};

export default BlogForm;
