import { useParams } from "react-router-dom";
import { TextInput } from "../../../components/input";
import { Toastify } from "../../../components/toastify";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NetworkServices } from "../../../network/index";
import { PrimaryButton } from "../../../components/button";
import { useCallback, useEffect, useState } from "react";
import { networkErrorHandeller } from "../../../utils/helper";
import { SkeletonForm } from "../../../components/loading/skeleton-table";

const AttributeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [unitId, setUnitId] = useState(null);

  const [unitData, setUnitData] = useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* reosure show */
  const fetchData = useCallback(async () => {
    try {
      const response = await NetworkServices.Attribute.show(id);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
  }, [id]);

  /* submit reosurce */
  const onSubmit = async (dat) => {
    try {
    
      const payload = {
        ...dat,
        unit_id: unitId ? unitId : data?.unit_id,
      }; 
 
      const response = await NetworkServices.Attribute.update(id, payload);
 
      if (response.status === 200) {
        navigate("/dashboard/attribute");
        return Toastify.Success(response.data.message);
      }
    } catch (error) {
    //   setLoading(false);
      networkErrorHandeller(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // find unit litre

  const fetchDataForUnit = useCallback(async (category) => {
    try {
      setLoading(true);
      const response = await NetworkServices.Unit.index();
  
      if (response?.status === 200 || response?.status === 201) {
        setUnitData(response?.data?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      if (error) {
        networkErrorHandeller(error);
      }
    }
  }, []);
  useEffect(() => {
    fetchDataForUnit();
  }, []);
  return (
    <>
      {loading ? (
        <SkeletonForm />
      ) : (
        <>
          {" "}
          <section className="flex justify-between shadow-md p-4 px-6 rounded-md bg-white mb-3">
            <h2 className=" font-semibold text-xl">attribute Update</h2>
            <Link to="/dashboard/attribute">
              <span className="border border-green-500 rounded-full material-symbols-outlined p-1">
                list
              </span>
            </Link>
          </section>
          <section className="shadow-md my-5 p-4 px-6">
            <form className="px-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6 lg:mb-2">
                <p>Unit IDs</p>
                <div className="grid grid-cols-2 md:grid-cols-4 ">
                  {unitData.map((unit) => (
                    <div key={unit?.unit_id}>
                      <label className="space-x-2">
                        <div className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            checked={unit?.unit_id === unitId}
                            onChange={() => setUnitId(unit?.unit_id)} // Handle checkbox selection
                            className="cursor-pointer"
                          />
                          <span>{unit?.name}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {/* Brand name */}
                <TextInput
                  label="attribute Name"
                  name="name"
                  type="text"
                  placeholder="Enter attribute name"
                  control={control}
                  error={errors.name && errors.name.message}
                  defaultvalue={data ? data?.name : "s"}
                  rules={{ required: "attribute name is required" }}
                />
              </div>

              {/* submit button */}
              <div className="my-4 flex justify-center">
                <PrimaryButton
                  loading={loading}
                  name="attribute Update"
                ></PrimaryButton>
              </div>
            </form>
          </section>
        </>
      )}
    </>
  );
};
export default AttributeEdit;
