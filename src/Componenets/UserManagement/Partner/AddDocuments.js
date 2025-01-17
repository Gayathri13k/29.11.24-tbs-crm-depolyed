import { Button, Modal, Progress, Upload } from "antd";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  SubmitAddressData,
  SubmitCompanyData,
  SubmitDocumentsData,
} from "../../../Api/UserManagement/SuperAdmin";
import { GetEmpDocumentById } from "../../../Api/UserManagement/Employee";
import {
  GetPatDocumentById,
  SubmitPatDocumentsData,
} from "../../../Api/UserManagement/Partner";

const FILE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_FORMATS = [
  "application/pdf",
  "image/jpg",
  "image/jpeg",
  "image/png",
];

const validationSchema = Yup.object().shape({
  aadhar_number: Yup.string()
    .required("Aadhar number is required")
    .length(12, "Aadhar number must be exactly 12 digits")
    .matches(/^\d{12}$/, "Aadhar must be a valid 12-digit number"),
  pan_number: Yup.string()
    .required("PAN number is required")
    .length(10, "PAN number must be exactly 10 characters")
    .matches(
      /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
      "PAN must be in the format ABCDE1234F"
    ),

  aadhar_fr_doc: Yup.mixed()
    .required("Aadhar Front Page is required")
    .test("fileSize", "File too large", (value) =>
      typeof value === "string" ? true : value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Unsupported Format", (value) =>
      typeof value === "string"
        ? true
        : value && SUPPORTED_FORMATS.includes(value.type)
    ),
  aadhar_bk_doc: Yup.mixed()
    .required("Aadhar Back Page is required")
    .test("fileSize", "File too large", (value) =>
      typeof value === "string" ? true : value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Unsupported Format", (value) =>
      typeof value === "string"
        ? true
        : value && SUPPORTED_FORMATS.includes(value.type)
    ),

  pan_fr_doc: Yup.mixed()
    .required("Pan Front Page is required")
    .test("fileSize", "File too large", (value) =>
      typeof value === "string" ? true : value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Unsupported Format", (value) =>
      typeof value === "string"
        ? true
        : value && SUPPORTED_FORMATS.includes(value.type)
    ),
  pan_bk_doc: Yup.mixed()
    .required("Pan Back Page is required")
    .test("fileSize", "File too large", (value) =>
      typeof value === "string" ? true : value && value.size <= FILE_SIZE
    )
    .test("fileFormat", "Unsupported Format", (value) =>
      typeof value === "string"
        ? true
        : value && SUPPORTED_FORMATS.includes(value.type)
    ),

  // pan_fr_doc: Yup.mixed()
  // .required("Aadhar Back Page is required")
  // .test("fileSize", "File too large", (value) =>
  //   typeof value === "string" ? true : value && value.size <= FILE_SIZE
  // )
  // .test("fileFormat", "Unsupported Format", (value) =>
  //   typeof value === "string"
  //     ? true
  //     : value && SUPPORTED_FORMATS.includes(value.type)
  // ),
  // pan_bk_doc: Yup.mixed()
  // .required("Aadhar Back Page is required")
  // .test("fileSize", "File too large", (value) =>
  //   typeof value === "string" ? true : value && value.size <= FILE_SIZE
  // )
  // .test("fileFormat", "Unsupported Format", (value) =>
  //   typeof value === "string"
  //     ? true
  //     : value && SUPPORTED_FORMATS.includes(value.type)
  // ),

  // other_doc: Yup.mixed()
  //   .required("Pan Back Page is required")
  //   .test("fileSize", "File too large", (value) =>
  //     typeof value === "string" ? true : value && value.size <= FILE_SIZE
  //   )
  //   .test("fileFormat", "Unsupported Format", (value) =>
  //     typeof value === "string"
  //       ? true
  //       : value && SUPPORTED_FORMATS.includes(value.type)
  //   ),
  // edu_cer_doc: Yup.mixed()
  //   .required("MSME Image is required")
  //   .test("fileSize", "File too large", (value) =>
  //     typeof value === "string" ? true : value && value.size <= FILE_SIZE
  //   )
  //   .test("fileFormat", "Unsupported Format", (value) =>
  //     typeof value === "string"
  //       ? true
  //       : value && SUPPORTED_FORMATS.includes(value.type)
  //   ),
});

export default function AddDocuments({
  setCurrentpage,
  currentpage,
  SPA_ID,
  superadmindata,
  EmployeeID,
  setEmployeeID,
  operatorID,
  setDocumentBack,
  updatedata,
  addressback,
  PartnerID,
  setModalIsOpen
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [enable, setEnable] = useState(false);
  const [viewImg,setViewImg] = useState("")


  // const handlePreview = (file) => {
  //   console.log(file,"imageview");
    
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     // setPreviewImage(reader.result?reader.result:tempImg);
  //     setPreviewImage(reader.result);
  //     setPreviewTitle(file.name);
  //   };
  //   reader?.readAsDataURL(file);
  // };
  const handlePreview = (file) => {
    if (!file) {
        console.error('No file selected');
        return;
    }

    console.log(file, "imageview");
    const reader = new FileReader();
    reader.onload = () => {
        setPreviewImage(reader.result);
        setPreviewTitle(file.name);
    };
    reader.readAsDataURL(file);
};
  console.log(updatedata, "asdidididid");

  // const handleSubmit = async (values) => {
  //   if (operatorID) {
  //     setCurrentpage(5);
  //   } else {
  //     try {
  //       const data = await SubmitDocumentsData(values);
  //       toast.success(data?.message);
  //       setCurrentpage(5);
  //     } catch (error) {
  //       console.error("Error uploading data", error);
  //     }
  //   }
  // };
  const handleSubmit = async (values) => {
    console.log(values, "docvalues");

    try {
      if (enable === false) {
        setModalIsOpen(false); // Assuming setCurrentPage is a function in your component
      } else {
        const data = await SubmitPatDocumentsData(values); // Replace with actual API call function
        toast.success(data)
        setModalIsOpen(false); 
        // Assuming setCurrentPage is a function in your component
        // console.log(values,actions,"docvalues");
      }
    } catch (error) {
      console.error("Error uploading data", error);
      toast.error("Failed to submit document. Please try again."); // Notify user of error
    } finally {
      // actions.setSubmitting(false);
    }
  };
  console.log(currentpage, "currentpagecurrentpage");
  const handleCancel = () =>{ setPreviewOpen(false)
    if(updatedata)
    setViewImg("")
    setPreviewImage("")
  };
  const [empproffesionaldata, setEmpProffesionalData] = useState("");
  const fetchGetUser = async () => {
    try {
      const data = await GetPatDocumentById(
        EmployeeID,
        setEmployeeID,
        setEmpProffesionalData,
        updatedata
      );
      setEmpProffesionalData(data);
    } catch (error) {
      console.error("Error fetching additional user data", error);
    }
  };

  console.log(empproffesionaldata.aadhar_card_front, "getdata");
  useEffect(() => {
    if (updatedata != null) {
      fetchGetUser();
    }
  }, [EmployeeID, setEmployeeID, setEmpProffesionalData, updatedata]);
  return (
    <div>
      <div className="border-l-[0.1vw] h-[28vw] overflow-y-auto  relative  px-[2vw] border-t-[0.1vw] border-b-[0.3vw] border-r-[0.1vw] rounded-[1vw] border-[#1f4b7f]">
        <div className="h-[4vw] w-full flex items-center justify-between">
          <label className="text-[1.5vw] font-semibold text-[#1f4b7f]">
            Documents
          </label>
          {updatedata ? (
            <button
              className={`${
                enable
                  ? "bg-[#1f4b7f] text-white"
                  : "text-[#1f4b7f] bg-white border-[#1f4b7f]"
              } rounded-full font-semibold w-[10vw] h-[2vw] flex items-center justify-center border-l-[0.1vw] border-t-[0.1vw] border-b-[0.3vw] border-r-[0.1vw] text-[1.1vw] `}
              onClick={() => {
                setEnable(!enable);
              }}
            >
              Enable to Edit
            </button>
          ) : (
            ""
          )}
          {/* <button className="rounded-full font-semibold w-[6vw] h-[2vw] flex items-center justify-center border-l-[0.1vw] border-t-[0.1vw] border-b-[0.3vw] border-r-[0.1vw] border-[#34AE2A] text-[1.1vw] text-[#34AE2A]">
            Save
          </button> */}
        </div>
        <div className="pb-[1vw]">
          <div className="border-b-[0.1vw] w-full border-[#1f4b7f]"></div>
        </div>
        <Formik
          initialValues={{
            aadhar_number: empproffesionaldata?.aadhar_card_number || "",
            pan_number: empproffesionaldata?.pan_card_number || "",
            aadhar_fr_doc: empproffesionaldata?.aadhar_card_front || null,
            aadhar_bk_doc: empproffesionaldata?.aadhar_card_back || null,
            pan_fr_doc: empproffesionaldata?.pan_card_front || null,
            pan_bk_doc: empproffesionaldata?.pan_card_back || null,
            // other_doc: empproffesionaldata?.msme_doc || null,
            // edu_cer_doc: empproffesionaldata?.msme_doc || null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          // onSubmit={(values)=>{
          //   handleSubmit(values)
          //   console.log(values,);

          // }}
          enableReinitialize
        >
          {({ isSubmitting, isValid, setFieldValue, values, handleChange }) => (
            <Form>
              <div className="gap-y-[1.5vw] flex-col flex">
                <div className="grid grid-cols-2 w-full gap-x-[2vw]">
                  <div className="col-span-1 relative">
                    <label className="text-[#1F4B7F] text-[1.1vw] ">
                      Aadhar Card Number
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      type="text"
                      name="aadhar_number"
                      placeholder="Enter Aadhar Number"
                      value={values.aadhar_number}
                      className={` ${
                        PartnerID || addressback
                          ? enable == false
                            ? " cursor-not-allowed"
                            : ""
                          : ""
                      } border-r-[0.3vw] mt-[0.2vw] border-l-[0.1vw] border-t-[0.1vw] border-b-[0.3vw] placeholder-blue border-[#1F487C] text-[#1F487C] text-[1vw] h-[3vw] w-[100%] rounded-[0.5vw] outline-none px-[1vw]`}
                      disabled={
                        PartnerID || addressback
                          ? enable
                            ? false
                            : true
                          : false
                      }
                    />
                    <ErrorMessage
                      name="aadhar_number"
                      component="div"
                      className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw] left-[.3vw]"
                    />
                  </div>
                  <div className="col-span-1 relative">
                    <label className="text-[#1F4B7F] text-[1.1vw] ">
                      Pan Card Number
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <Field
                      type="text"
                      name="pan_number"
                      placeholder="Enter Pan Number"
                      value={values.pan_number}
                      className={` ${
                        PartnerID || addressback
                          ? enable == false
                            ? " cursor-not-allowed"
                            : ""
                          : ""
                      } border-r-[0.3vw] mt-[0.2vw] border-l-[0.1vw] border-t-[0.1vw] border-b-[0.3vw] placeholder-blue border-[#1F487C] text-[#1F487C] text-[1vw] h-[3vw] w-[100%] rounded-[0.5vw] outline-none px-[1vw]`}
                      disabled={
                        PartnerID || addressback
                          ? enable
                            ? false
                            : true
                          : false
                      }
                    />
                    <ErrorMessage
                      name="pan_number"
                      component="div"
                      className="text-red-500 text-[0.8vw] absolute bottom-[-1.2vw] left-[.3vw]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-[1.5vw] w-full gap-x-[1.5vw]">
                  <div className="col-span-1 relative">
                    <label className="text-[#1F4B7F] text-[1.1vw]">
                      Aadhar Card Front Doc
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <div>
                      <input
                        id="aadhar_fr_doc"
                        name="aadhar_fr_doc"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const files = Array.from(event.target.files);
                          console.log(files, event, "filesfiles");
                          setFieldValue(
                            "aadhar_fr_doc",
                            event.currentTarget.files[0]
                          );
                          handlePreview(files[0]);
                        }}
                      disabled={
                        PartnerID || addressback
                          ? enable
                            ? false
                            : true
                          : false
                      }
                      
                      />
                      <button
                        type="button"
                        className={` ${
                          PartnerID || addressback
                            ? enable == false
                              ? " cursor-not-allowed"
                              : ""
                            : ""
                        } border-r-[0.3vw] relative flex items-center justify-between px-[1vw] mt-[0.2vw] border-l-[0.1vw] border-t-[0.1vw] border-b-[0.3vw] placeholder-blue border-[#1F487C] text-[#1F487C] text-[1vw] h-[3vw] w-[100%] rounded-[0.5vw] outline-none`}
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById("aadhar_fr_doc").click();
                          handlePreview(document.getElementById("aadhar_fr_doc").value[0])
                        }}
                      >
                        <span className="opacity-50 text-[1vw]">
                          Upload Aadhar Front Doc
                        </span>
                        <FaCloudUploadAlt
                          color="#1F487C"
                          size={"2vw"}
                          className="absolute right-[1vw]"
                        />
                      </button>
                      {values.aadhar_fr_doc && (
                        <div
                          onClick={() => {setPreviewOpen(true)
                            setViewImg(empproffesionaldata?.aadhar_card_front)
                          }}
                          className="cursor-pointer underline-offset-1 underline text-[#1F4B7F] text-[0.8vw]"
                        >
                          {values.aadhar_fr_doc.name
                            ? values.aadhar_fr_doc.name
                            : values.aadhar_fr_doc}
                        </div>
                      )}
                      <ErrorMessage
                        name="aadhar_fr_doc"
                        component="div"
                        style={{ color: "red" }}
                        className="text-[0.8vw] absolute bottom-[-1.2vw] left-[.3vw]"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 relative">
                    <label className="text-[#1F4B7F] text-[1.1vw]">
                      Aadhar Card Back Doc
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <div>
                      <input
                        id="aadhar_bk_doc"
                        name="aadhar_bk_doc"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const files = Array.from(event.target.files);
                          console.log(files, "filesfiles");
                          // setFieldValue("pan_front", files);
                          setFieldValue(
                            "aadhar_bk_doc",
                            event.currentTarget.files[0]
                          );
                          handlePreview(files[0]);
                        }}
                        disabled={
                          PartnerID || addressback
                            ? enable
                              ? false
                              : true
                            : false
                        }
                      />
                      <button
                        type="button"
                        className={` ${
                          PartnerID || addressback
                            ? enable == false
                              ? " cursor-not-allowed"
                              : ""
                            : ""
                        } border-r-[0.3vw] relative flex items-center justify-between px-[1vw] mt-[0.2vw] border-l-[0.1vw] border-t-[0.1vw] border-b-[0.3vw] placeholder-blue border-[#1F487C] text-[#1F487C] text-[1vw] h-[3vw] w-[100%] rounded-[0.5vw] outline-none`}
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById("aadhar_bk_doc").click();
                        }}
                      >
                        <span className="opacity-50">
                          Upload Aadar Back Doc
                        </span>
                        <FaCloudUploadAlt
                          color="#1F487C"
                          size={"2vw"}
                          className="absolute right-[1vw]"
                        />
                      </button>
                      {values.aadhar_bk_doc && (
                        <div
                          onClick={() => {setPreviewOpen(true)
                            setViewImg(empproffesionaldata?.aadhar_card_back)
                          }}
                          className="cursor-pointer underline-offset-1 underline text-[#1F4B7F] text-[0.8vw]"
                        >
                          {values.aadhar_bk_doc.name
                            ? values.aadhar_bk_doc.name
                            : values.aadhar_bk_doc}
                        </div>
                      )}
                      <ErrorMessage
                        name="aadhar_bk_doc"
                        component="div"
                        style={{ color: "red" }}
                        className="text-[0.8vw] absolute bottom-[-1.2vw] left-[.3vw]"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 relative">
                    <label className="text-[#1F4B7F] text-[1.1vw]">
                      Pan Card Front Document
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <div>
                      <input
                        id="pan_fr_doc"
                        name="pan_fr_doc"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const files = Array.from(event.target.files);
                          // setFieldValue("aadhar_back", files);
                          setFieldValue(
                            "pan_fr_doc",
                            event.currentTarget.files[0]
                          );
                          handlePreview(files[0]);
                        }}
                        disabled={
                          PartnerID || addressback
                            ? enable
                              ? false
                              : true
                            : false
                        }
                      />
                      <button
                        type="button"
                        className={` ${
                          PartnerID || addressback
                            ? enable == false
                              ? " cursor-not-allowed"
                              : ""
                            : ""
                        } border-r-[0.3vw] relative flex items-center justify-between px-[1vw] mt-[0.2vw] border-l-[0.1vw] border-t-[0.1vw] border-b-[0.3vw] placeholder-blue border-[#1F487C] text-[#1F487C] text-[1vw] h-[3vw] w-[100%] rounded-[0.5vw] outline-none`}
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById("pan_fr_doc").click();
                        }}
                      >
                        <span className="opacity-50">Upload Pan Front Doc</span>
                        <FaCloudUploadAlt
                          color="#1F487C"
                          size={"2vw"}
                          className="absolute right-[1vw]"
                        />
                      </button>
                      {values.pan_fr_doc && (
                        <div
                          onClick={() => {setPreviewOpen(true)
                            setViewImg(empproffesionaldata?.pan_card_front)
                          }}
                          className="cursor-pointer underline-offset-1 underline text-[#1F4B7F] text-[0.8vw]"
                        >
                          {values.pan_fr_doc.name
                            ? values.pan_fr_doc.name
                            : values.pan_fr_doc}
                        </div>
                      )}
                      <ErrorMessage
                        name="pan_fr_doc"
                        component="div"
                        style={{ color: "red" }}
                        className="text-[0.8vw] absolute bottom-[-1.2vw] left-[.3vw]"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 relative">
                    <label className="text-[#1F4B7F] text-[1.1vw]">
                      Pan Card Back Doc
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <div>
                      <input
                        id="pan_bk_doc"
                        name="pan_bk_doc"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const files = Array.from(event.target.files);
                          console.log(files, "filesfiles");
                          // setFieldValue("pan_back", files);
                          setFieldValue(
                            "pan_bk_doc",
                            event.currentTarget.files[0]
                          );
                          handlePreview(files[0]);
                        }}
                        disabled={
                          PartnerID || addressback
                            ? enable
                              ? false
                              : true
                            : false
                        }
                      />
                      <button
                        type="button"
                        className={` ${
                          PartnerID || addressback
                            ? enable == false
                              ? " cursor-not-allowed"
                              : ""
                            : ""
                        } border-r-[0.3vw] relative flex items-center justify-between px-[1vw] mt-[0.2vw] border-l-[0.1vw] border-t-[0.1vw] border-b-[0.3vw] placeholder-blue border-[#1F487C] text-[#1F487C] text-[1vw] h-[3vw] w-[100%] rounded-[0.5vw] outline-none`}
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById("pan_bk_doc").click();
                        }}
                      >
                        <span className="opacity-50">Upload Pan Back Doc</span>
                        <FaCloudUploadAlt
                          color="#1F487C"
                          size={"2vw"}
                          className="absolute right-[1vw]"
                        />
                      </button>
                      {values.pan_bk_doc && (
                        <div
                          onClick={() => {setPreviewOpen(true)
                            setViewImg(empproffesionaldata?.pan_card_back)
                          }}
                          className="cursor-pointer underline-offset-1 underline text-[#1F4B7F] text-[0.8vw]"
                        >
                          {values.pan_bk_doc.name
                            ? values.pan_bk_doc.name
                            : values.pan_bk_doc}
                        </div>
                      )}
                      <ErrorMessage
                        name="pan_bk_doc"
                        component="div"
                        style={{ color: "red" }}
                        className="text-[0.8vw] absolute bottom-[-1.2vw] left-[.3vw]"
                      />
                    </div>
                  </div>
                  {/* <div className="col-span-1">
                    <label className="text-[#1F4B7F] text-[1.1vw]">
                      Educational Certificate
                      <span className="text-[1vw] text-red-600 pl-[0.2vw]">
                        *
                      </span>
                    </label>
                    <div>
                      <input
                        id="edu_cer_doc"
                        name="edu_cer_doc"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const files = Array.from(event.target.files);
                          console.log(files, "filesfiles");
                          // setFieldValue("msme_doc", files);
                          setFieldValue(
                            "edu_cer_doc",
                            event.currentTarget.files[0]
                          );
                          handlePreview(files[0]);
                        }}
                      />
                      <button
                        type="button"
                        className="border-r-[0.3vw] relative flex items-center justify-between px-[1vw] mt-[0.2vw] border-l-[0.1vw] border-t-[0.1vw] border-b-[0.3vw] placeholder-blue border-[#1F487C] text-[#1F487C] text-[1vw] h-[3vw] w-[100%] rounded-[0.5vw] outline-none"
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById("edu_cer_doc").click();
                        }}
                      >
                        <span className="opacity-50">
                          Upload Education Certificate
                        </span>
                        <FaCloudUploadAlt
                          color="#1F487C"
                          size={"2vw"}
                          className="absolute right-[1vw]"
                        />
                      </button>
                      {values.edu_cer_doc && (
                        <div
                          onClick={() => setPreviewOpen(true)}
                          className="cursor-pointer underline-offset-1 underline text-[#1F4B7F] text-[0.8vw]"
                        >
                          {values.edu_cer_doc.name
                            ? values.edu_cer_doc.name
                            : values.edu_cer_doc}
                        </div>
                      )}
                      <ErrorMessage
                        name="edu_cer_doc"
                        component="div"
                        style={{ color: "red" }}
                        className="text-[0.8vw]"
                      />
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="flex items-center  w-full justify-between pb-[1vw] pt-[2vw]">
                <div>
                  <h1 className="text-[#1F4B7F] text-[0.8vw] font-semibold">
                    *You must fill in all fields to be able to continue
                  </h1>
                </div>
                <div className="flex items-center gap-x-[1vw]">
                  <button
                    className="border-[#1F487C] w-[5vw] font-semibold text-[1vw] h-[2vw] rounded-full border-r-[0.2vw]  border-l-[0.1vw] border-t-[0.1vw] border-b-[0.2vw]"
                    onClick={() => {
                      setCurrentpage(2);
                      setDocumentBack(true);
                    }}
                  >
                    Back
                  </button>
                  <button
                    className="bg-[#1F487C] font-semibold rounded-full w-[10vw] h-[2vw] text-[1vw] text-white"
                    type="submit"
                    // onClick={() => setCurrentpage(4)}
                  >
                     {PartnerID || addressback ? enable
                          ? "Update & Continue"
                          : "Continue"
                          : "Continue"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <Modal
        open={previewOpen}
        // open={true}
        // title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        {/* <img alt="example" style={{ width: "100%" ,height:"15vw" }} src={`http://192.168.90.47:4000${viewImg}`|| `${previewImage}`} /> */}
        <img alt="example" style={{ width: "100%" ,height:"15vw" }} src={ `${previewImage}`|| `http://192.168.90.47:4000${viewImg}`} />
      </Modal>
    </div>
  );
}
