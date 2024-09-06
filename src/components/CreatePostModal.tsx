import { X, ImagePlus, Loader } from "lucide-react";
import { useState } from "react";
import defaultProfilePic from "../assets/default-user.jpg";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../utils/api";
import { addPost } from "../redux/auth/feed-slice";

declare type Props = {
  setCreatePostVisible: (visibility: boolean) => void;
};

const CreatePostModal = ({ setCreatePostVisible }: Props) => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const [images, setImages] = useState<File[]>([]);
  const [visibility, setVisibility] = useState<string>("friends");
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state: any) => state.user);

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedImages = Array.from(event.target.files);
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const handleVisibilityChange = (e: any) => {
    setVisibility(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("content", text);
    formData.append("visibility", visibility);
    if (images.length) {
      for (const image of images) {
        formData.append(`pictures`, image);
      }
    }

    try {
      const data = await createPost(formData);

      setLoading(false);
      if (data.error) {
        toast.error(data.error);
      } else {
        dispatch(addPost({ newPost: data.payload.post }));
        toast.success(data.message);
        setCreatePostVisible(false);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <div className="screen w-screen h-screen flex flex-row items-center justify-center fixed left-0 top-0 z-40">
      <div className="h-full w-full fixed opacity-50 left-0 top-0 bg-slate-100"></div>
      <div className="modal h-auto w-96 mx-auto bg-white rounded-md shadow-md z-10 flex flex-col items-center ">
        <div className="relative flex flex-col pt-2 items-center h-12 w-full justify-self-center">
          <h1 className="font-bold text-lg">Create a new post</h1>
          <button
            onClick={() => setCreatePostVisible(false)}
            className="absolute right-3 bg-slate-200 text-slate-500 rounded-full p-0.5 hover:bg-slate-300 hover:text-slate-600 justify-self-end"
          >
            <X />
          </button>
        </div>
        <hr className="w-full border-r-2 border-slate-300" />
        <div className="flex flex-col w-full items-center p-3">
          <div className="flex flex-row h-16 w-full">
            <img
              src={
                currentUser?.picture
                  ? VITE_BACKEND_URL + currentUser.picture
                  : defaultProfilePic
              }
              className="h-16 w-16 object-cover rounded-full"
              alt="Profile"
            />
            <div className="ml-3 flex flex-col justify-between h-full items-start w-full gap-2 font-bold">
              <p className="text-lg">{currentUser?.userName}</p>
              <select
                value={visibility}
                onChange={handleVisibilityChange}
                className="font-semibold border-none outline-none rounded-md bg-slate-300 px-1"
              >
                <option value="friends">Friends</option>
                <option value="public">Public</option>
                <option value="only_me">Only me</option>
              </select>
            </div>
          </div>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder={`What's in your mind ${currentUser.userName} ?`}
            className={`w-full mt-2 p-2 border-none outline-none ease-in-out duration-200 text-slate-700 min-h-32 max-h-full resize-none ${
              text.length < 100 ? "text-2xl" : "text-md"
            }`}
          ></textarea>

          <div className="w-full my-2 flex flex-row items-center gap-2">
            <div className="w-fit flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index}`}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <button
                    className="absolute top-0 right-0 bg-slate-500 text-white rounded-full p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <label
              className={`flex items-center gap-1 cursor-pointer text-slate-700 hover:text-slate-900 ${
                images.length === 4
                  ? "text-slate-500 cursor-default hover:text-slate-500"
                  : ""
              }`}
            >
              {" "}
              <ImagePlus className="w-12 h-12" />
              <input
                disabled={images.length === 4}
                type="file"
                accept="image/*"
                multiple
                className="hidden group"
                onChange={handleAddImage}
              />
            </label>
          </div>

          <div className="justify-self-end flex flex-row justify-around w-full gap-2 mb-2 mt-1 px-1">
            <button
              onClick={() => setCreatePostVisible(false)}
              className="bg-slate-200 rounded-md text-slate-800 px-4 w-full py-2 font-semibold "
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="bg-slate-800 rounded-md text-white px-4 w-full py-2 font-semibold "
            >
              {loading ? <Loader /> : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
