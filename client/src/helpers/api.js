import axios from 'axios'
import jwt_decode from 'jwt-decode'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

//axios.defaults.baseURL = import.meta.env.VITE_LOCALHOST_SERVER_API
axios.defaults.baseURL = import.meta.env.VITE_LIVE_SERVER_API



const token = localStorage.getItem('accessToken')

export async function getUser(){
    if(!token) return Promise.reject('Cannot get Token')
    try {
        const decoded = jwt_decode(token);
        //console.log('decoded>>', decoded);
        
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        return Promise.reject('Error decoding token');
      }
}

export async function resgisterUser({ fisrtName, lastName, email, penName ,password }){
    try {
        const res = await axios.post('/api/register', { fisrtName, lastName, email, penName ,password })

        console.log('respones', res)
        if(res.data.success){
            return res        
        }
    } catch (error) {
        console.log('ERROR REGISTERING USER', error)
        const errorMsg = error.res.data.data
        return errorMsg
    }
}

export async function loginUser({ email, password }){
    try {
        const res = await axios.post('/api/login', { email, password }, 
            {
                credentials: 'include',
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                }
            } 
        )
        console.log('respones', res)
        if(res.data){
            return res        
        }
    } catch (error) {
        console.log('ERROR REGISTERING USER API', error)
        if (error.response) {
            const errorMsg = error.response.data.data;
            console.log('MSGS', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function verifyUser({ id, token}){
    try {
        const res = await axios.post(`/api/${id}/verify/${token}`, { withCredentials: true })
        
        if(res.data.success){
            localStorage.setItem('accessToken', res.data.token)
            toast.success('Email Verified')
            return res
        }
    } catch (error) {
        console.log('ERROR VERIFYING USER API', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function resetPassword ({ email }){
    try {
        const res = await axios.post('/api/forgotPassword', { email })
        console.log('RES FROM FORGOT PASSWROD', res)
        if(res.data.success){
            return res
        }
    } catch (error) {
        console.log('ERROR VERIFYING USER API', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function newPassword({ resetToken, password }){
    try {
        const res = await axios.put(`/api/resetPassword/${resetToken}`, {password})

        if(res.data.success){
            toast.success(res.data.data)
            return res
        }
    } catch (error) {
        console.log('ERROR VERIFYING USER API', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function createStory({title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded}){
    try {
        const res = await axios.post('/api/create-story', {title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded}, { withCredentials: true })
        console.log('CREATE STORY RES', res)
        if(res?.data.success){
            toast.success('Story Generated')
            return res
        }
    } catch (error) {
        console.log('ERROR CREATING USER STORY', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            const errorStatus = error.response.status;
            console.log('MSG', errorMsg)
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function handlePrivateStory({id, userId}){
    try {
        const res = await axios.post(`/api/user/story/handlePrivateStory`, {id, userId}, { withCredentials: true })
        if(res?.data.success){
            toast.success(res?.data.data ? res?.data.data : 'Story Updated')
            return res
        }
    } catch (error) {
        console.log('ERROR HANDLING USER PRIVATE STORY', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function handlePublishedToCommunity({id, userId}){
    try {
        const res = await axios.post(`/api/user/story/handlePublishedToCommunity`, {id, userId}, { withCredentials: true })
        if(res?.data.success){
            toast.success(res?.data.data ? res?.data.data : 'Story Updated')
            return res
        }
    } catch (error) {
        console.log('ERROR HANDLING USER PRIVATE STORY', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function generateNewStoryDesc({desc, storyId, userId}){
    try {
        const res = await axios.post('/api/user/story/handleNewStoryDesc', {desc, storyId, userId}, {withCredentials: true})
        console.log('HANDLE NEW STORY DESC', res)
        if(res?.data.success){
            toast.success(res?.data.data || 'Story Description Updated')
            window.location.reload()
        }
    } catch (error) {
        console.log('ERROR HANDLING USER NEW STORY DESC', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to upload Story';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function saveStoryDesc({desc, storyId, userId}){
    try {
        const res = await axios.post('/api/user/story/saveDesc', {desc, storyId, userId}, {withCredentials: true})
        if(res?.data.success){
            toast.success(res?.data.data || 'Story Description Saved')
            window.location.reload()
        }
    } catch (error) {
        console.log('ERROR SAVING USER STORY DESC', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to upload Story';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function createNewStory({ storyId, userId }){
    try {
        const res = await axios.post('/api/user/story/recreateStory', {storyId, userId}, {withCredentials: true})
        if(res?.data.success){
            toast.success(res?.data.data || 'New story created')
            //window.location.reload()
            return res
        }
    }
     catch (error) {
        console.log('ERROR SAVING USER STORY DESC', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to upload Story';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function rewriteChapter({ text, userId, storyId, chapterId }){
    try {
        const res =  await axios.post('/api/user/story/rewriteChapter', {text, userId, storyId, chapterId}, {withCredentials: true})
        if(res?.data.success){
            toast.success('Chapter Updated')
            return res
            //window.location.reload()
            
        }
    } catch (error) {
        console.log('ERROR RECREATING CHAPTER STORY ', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to upload Story';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function generateChapterImage({ text, userId, storyId, chapterId }){
    try {
        const res =  await axios.post('/api/user/story/generateChapterImage', {text, userId, storyId, chapterId}, {withCredentials: true})
        if(res?.data.success){
            toast.success('Image Generated')
            //window.location.reload()
            return res
        }
    } catch (error) {
        console.log('ERROR RECREATING CHAPTER STORY ', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to upload Story';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function updateStoryChapterContent({userId, storyId, chapterId, currentChapterContent}){
    try {
        const res = await axios.post('/api/user/story/updateStoryChapterContent', {userId, storyId, chapterId, currentChapterContent}, { withCredentials: true})
        if(res?.data.success){
            toast.success('Changes saved')
        }
    } catch (error) {
        console.log('ERROR RECREATING CHAPTER STORY ', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to save chapter';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function generateCoverStoryImage({desc, storyId, userId}){
    try {
        const res = await axios.post('/api/user/story/generateCoverStoryImage', {desc, storyId, userId}, { withCredentials: true})
        if(res?.data.success){
            toast.success('Cover Image Generated')
            window.location.reload()
        } 
    } catch (error) {
        console.log('ERROR RECREATING CHAPTER STORY ', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to save chapter';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function uploadCoverImg(formData){
    try {
        const res = await axios.post('/api/user/story/uploadCoverImg', formData, {withCredentials: true})
        if(res?.data.success){
            toast.success('Cover Image Saved')
            window.location.reload()
        } 
    } catch (error) {
        console.log('ERROR RECREATING CHAPTER STORY ', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to save cover image';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function addNewChapters({storyId, userId, newChapter, chapterImg}){
    try {
        const res = await axios.post('/api/user/story/addNewChapters', {storyId, userId, newChapter, chapterImg}, {withCredentials: true})
        if(res?.data.success){
            toast.success('Chapters added')
            //window.location.reload()
            return res
        }
    } catch (error) {
        console.log('ERROR RECREATING CHAPTER STORY ', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to save chapter';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function likeStory({userId, storyId, plan}){
    try {
        const res = await axios.post('/api/user/story/likeStory', {userId, storyId, plan}, {withCredentials: true})
        if(res.status.success){
            toast.success('Liked')
            window.location.reload()
            return res;
        }
    } catch (error) {
        console.log('ERROR RECREATING CHAPTER STORY ', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to like chapter';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function generateAiDesc({userId, genreValue}){
    try {
        const res = await axios.post('/api/user/story/generateAiDesc', {userId, genreValue}, {withCredentials: true})
        if(res?.data.success){
            return res
        }
    } catch (error) {
        console.log('ERROR RECREATING CHAPTER STORY ', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to generate description';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function subscriptionSession({userId, priceId}){
    try {
        const res = await axios.post('/api/subscription/paymentSession', {userId, priceId}, {withCredentials: true})
        //console.log('RESS', res?.data.url)
        const sessionUrl = res?.data.url
        window.location.href = sessionUrl
    } catch (error) {
        console.log('ERROR RECREATING CHAPTER STORY ', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data || 'Failed to generate subscription';
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            const errorStatus = error.response.status;
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

 export async function createStoryPdf({ id, userId }) {
    try {
      const response = await axios.post('/api/user/story/generatePdf', { id, userId }, { responseType: 'blob', withCredentials: true });
      
      // Check if the response contains data
      if (response.data) {
        // Create a Blob directly from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' });
  
        // Use window.open to open a new window with the PDF content
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        console.error('PDF data not received from the server');
        // Handle the case where the server did not provide the PDF data
      }
  
      return null;
    } catch (error) {
      console.error('Error creating or opening PDF:', error);
      // Handle errors, for example, show an error message to the user
      return 'An error occurred during PDF creation or retrieval.';
    }
  }
  