import { useDispatch, useSelector } from "react-redux";
import AuthUserNavbar from "../../Components/AuthUserNavbar/AuthUserNavbar";
import "./ProfilePage.css";
import { useEffect, useRef, useState } from "react";
import { app } from "../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { updateUserFailure, updateUserStart, updateUserSuccess } from "../../redux/user/userslice";
import Spinner from "../../Components/Helpers/Spinner/Spinner";
import { apiUrl } from "../../Utils/api";
import toast from "react-hot-toast";

function ProfilePage() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const user = currentUser?.data;
  const [image, setImage] = useState(undefined);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const fileRef = useRef(null);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        const progress =
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setImageUploadProgress(Math.round(progress));
      },
      (error) => {
        //console.log('ERROR', error)
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profileImg: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        dispatch(updateUserStart())
        const res = await fetch(apiUrl(`/api/user/update/${user._id}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData),                

        })
        const data = await res?.json()
        console.log('UPDATE DATA', data)
        if(!data.success){
            dispatch(updateUserFailure(data?.data))
            return;
        } else {
            toast.success('User profile updated successful')
            dispatch(updateUserSuccess(data))
        }
        
    } catch (error) {
        const errorMsg = 'Something went wrong'
        dispatch(updateUserFailure(errorMsg))
        console.log('ERROR UPDATING USER', error)
    }
}

  return (
    <div className="profilePage">
      <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
      <div className="profileHero">
        <div className="content">
          <h1>My profile</h1>
          <p>
            Impress your audience with interesting short stories created with
            StoryFony AI like pro
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <p>Edit Profile</p>

        <p className="">
          {imageError ? (
            <span className="textRed">
              Error Uploading Image (file size must be less than 2 MB)
            </span>
          ) : imageUploadProgress > 0 && imageUploadProgress < 100 ? (
            <span className="textGray">{`Uploading: ${imageUploadProgress}% complete`}</span>
          ) : imageUploadProgress === 100 ? (
            <span className="textGreen">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>

        <div className="profileImgCard">
          <input
            type="file"
            hidden
            ref={fileRef}
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <img
            className="profileImg"
            src={formData.profileImg || user?.profileImg}
            alt={`profile picture of ${user?.name}`}
          />
          <button onClick={() => fileRef.current.click()}>
            Change profile
          </button>
        </div>

        <div className="formInputs">
            <div className="formInput">
              <label>Name</label>
              <input onChange={handleChange} id="name" defaultValue={user?.name} type="text" placeholder="Full Name" />
            </div>
            <div className="formInput">
              <label>Email</label>
              <input disabled onChange={handleChange} id="email" defaultValue={user?.email} type="text" placeholder="Email Address" />
            </div>
            <div className="formInput">
              <label>PenName</label>
              <input onChange={handleChange} id="penName" defaultValue={user?.penName} type="text" placeholder="PenName" />
            </div>
            <div className="formInput">
              <label>Country</label>
              <input onChange={handleChange} id="country" defaultValue={user?.country} type="text" placeholder="Country" />
            </div>
            <div className="formInput">
              <label>State</label>
              <input onChange={handleChange} id="state" defaultValue={user?.state} type="text" placeholder="state" />
            </div>
            <div className="formInput">
              <label>Occupation</label>
              <input onChange={handleChange} id="occupation" defaultValue={user?.occupation} type="text" placeholder="Occupation" />
            </div>
        </div>

        <button>{loading ? (<Spinner />) : ('Update Profile')}</button>
      </form>
    </div>
  );
}

export default ProfilePage;
