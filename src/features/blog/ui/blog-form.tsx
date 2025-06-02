import { FormBuilder } from "@/app/core/form-builder";
import { blogFields } from "@/features/blog/domain/blog-field";
import { blogSchema } from "@/features/blog/domain/blog-schema";

const BlogForm = () => {
  const handleSubmit = (data: any) => {
    console.log("Blog form data is submitted>>>", data);
  };

  return (
    <div className="w-1/3">
    <FormBuilder
      fields={blogFields}
      schema={blogSchema}
      onSubmit={handleSubmit}
      submitButtonText="Submit Blog"
      defaultValues={{
        name: "",
        content: "",
        status: "Draft",
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
