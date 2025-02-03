import { Toastify } from "../../components/toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NetworkServices } from "../../network/index";
import { PrimaryButton } from "../../components/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { networkErrorHandeller } from "../../utils/helper";
import { TextInput } from "../../components/input";

export const WebSettingEdit = () => {
    const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedunitIds, setSelectedunitIds] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [data, setData] = useState({});
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm();
  /* submit reosurce */
  //   single image set in state
  const handleSingleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSingleImage(file);
    }
  };
  const onSubmit = async (data) => {
    try {
      
      setButtonLoading(true);
       
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("bio", data.bio);
      formData.append("location", data.location);
      formData.append("linkedin", data.linkedin);
      formData.append("instagram", data.instagram);
      formData.append("facebook", data.facebook);
      formData.append("youtube", data.youtube);
      formData.append("twitter", data.twitter);

      formData.append("logo", singleImage);

      const response = await NetworkServices.WebSetting.store(formData);
      if (response && (response.status === 201 || response?.status === 200)) {
        navigate("/dashboard/web-setting");
        setButtonLoading(false);
        return Toastify.Success("Color Created.");
      }
    } catch (error) {
      setButtonLoading(false);
      networkErrorHandeller(error);
    }
  };
  const fetchData = useCallback(async () => {
    try {
      const response = await NetworkServices.WebSetting.show(id); 
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
  }, [id]);
  useEffect(() => {
    fetchData();
   }, []);  

  return (
    <>
      <section className="flex justify-between shadow-md p-4 px-6 rounded-md bg-white mb-3">
        <h2 className=" font-semibold text-xl">Web Setting  Edit</h2>
        <Link to="/dashboard/web-setting">
          <span className="border border-green-500 rounded-full material-symbols-outlined p-1">
            list
          </span>
        </Link>
      </section>

      <section className="shadow-md my-5 p-4 px-6">
        <form className="px-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex lg:flex-row flex-col gap-4">
            {/* title  */}
            <div className="mb-6 lg:mb-2 w-full ">
              <TextInput
                label="Tittle"
                name="title"
                type="text"
                placeholder="Enter Title name"
                 defaultvalue = {data?data?.title:''}
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "Color Name is required" }}
              />
            </div>
            {/* email  */}
            <div className="mb-6 lg:mb-2 w-full">
              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter  Email"
                defaultvalue = {data?data?.email:''}
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "Email is required" }}
              />
            </div>
            {/* phone  */}
            <div className="mb-6 lg:mb-2 w-full">
              <TextInput
                label="Phone"
                name="phone"
                type="text"
                defaultvalue = {data?data?.phone:''}
                placeholder="Enter Phone Number"
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "Phone Number is required" }}
              />
            </div>
          </div>
          <div className="flex lg:flex-row flex-col gap-4">
            {/* location */}
            <div className="mb-6 lg:mb-2 w-full ">
              <TextInput
                label="Location"
                name="location"
                type="text"
                defaultvalue = {data?data?.location:''}
                placeholder="Enter Location"
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "Location is required" }}
              />
            </div>

            {/* Biodata */}
            <div className="mb-6 lg:mb-2 w-full">
              <TextInput
                label="Bio"
                name="bio"
                type="text"
                defaultvalue = {data?data?.bio:''}
                placeholder="Enter Bio "
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "Bio is required" }}
              />
            </div>
          </div>
          <div className="flex lg:flex-row flex-col gap-4">
            {/* Logo */}
            <div className="mb-6 lg:mb-2 w-full">
              <p className="text-sm mb-1 text-gray-500">
                Logo
                <span className="text-red-500">*</span>
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleSingleImageChange}
                className="cursor-pointer w-full text-sm bg-white disabled:bg-gray-300 rounded-md outline-none p-[14px] border disabled:border-gray-300"
              />
            </div>

            <div className="mb-6 lg:mb-2 w-full ">
              <TextInput
                label="Facebook"
                name="facebook"
                type="text"
                defaultvalue = {data?data?.facebook:''}
                placeholder="Enter facebook url"
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "Facebook is required" }}
              />
            </div>

            {/* youtube  */}
            <div className="mb-6 lg:mb-2 w-full">
              <TextInput
                label="Youtube"
                name="youtube"
                type="text"
                defaultvalue = {data?data?.youtube:''}
                placeholder="Enter you tube link"
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "youtube is required" }}
              />
            </div>
          </div>
          <div className="flex lg:flex-row flex-col gap-4">
            {/* link of social media
             */}
            <div className="mb-6 lg:mb-2 w-full ">
              <TextInput
                label="Linkedin"
                name="linkedin"
                type="text"
                defaultvalue = {data?data?.linkedin:''}
                placeholder="Enter Linkedin"
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "linkedin is required" }}
              />
            </div>
            <div className="mb-6 lg:mb-2 w-full ">
              <TextInput
                label="Twitter"
                name="twitter"
                type="text"
                defaultvalue = {data?data?.twitter:''}
                placeholder="Enter Twitter"
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "twitter is required" }}
              />
            </div>

            {/* Biodata */}
            <div className="mb-6 lg:mb-2 w-full">
              <TextInput
                label="Instagram"
                name="instagram"
                type="text"
                defaultvalue = {data?data?.instagram:''}
                placeholder="Enter insta link"
                control={control}
                error={errors.name && errors.name.message}
                rules={{ required: "insta link required" }}
              />
            </div>
          </div>

          {/* submit button */}
          <div className="my-4 flex justify-center">
            <PrimaryButton
              loading={buttonLoading}
              name="Web Setting create"
            ></PrimaryButton>
          </div>
        </form>
      </section>
    </>
  );
};
