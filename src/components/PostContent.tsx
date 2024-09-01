type PostContentProps = {
  content: string;
};

const PostContent = ({ content }: PostContentProps) => {
  return <p className="text-slate-700 px-3">{content}</p>;
};

export default PostContent;
