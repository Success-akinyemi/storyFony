import { useEffect, useState } from "react";
import AuthUserNavbar from "../../Components/AuthUserNavbar/AuthUserNavbar";
import Spinner from "../../Components/Helpers/Spinner/Spinner";
import StoryCard from "../../Components/Helpers/StoryCard/StoryCard";
import { publicStoryBook } from "../../hooks/fetch.hooks";
import "./PublicShelf.css";
import ShareOnSocialMedia from "../../Components/Helpers/ShareOnSocialMedia/ShareOnSocialMedia";

function PublicShelf() {
  const { apiPublicStoryData, isLoadingStory, storyServerError } =
    publicStoryBook();
  const data = apiPublicStoryData?.data;
  const [ searchQuery, setSearchQuery ] = useState('')  
  const [ initialData, setInitialData ] = useState(data || [])
  const [selectedCard, setSelectedCard] = useState(null);
  const [shareStoryId, setShareStoryId] = useState("");
  console.log(initialData);
  console.log(data);
  useEffect(() => {
    if (data) {
      setInitialData(data);
    }
  }, [data]);


  //search functions
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterData(query);
};

const filterData = (query) => {
    const filteredData = query.trim() === '' ? data : initialData.filter((item) =>
        Object.values(item).some(
            (value) =>
                value &&
                value
                    .toString()
                    .toLowerCase()
                    .includes(query.toLowerCase())
        )
    );
    setInitialData(filteredData);
};




//popup functions
  const renderPopupComponent = () => {
    switch (selectedCard) {
      case "uploadProfile":
        return <UploadProfilePhoto />;
      case "shareStoryToSocialMedia":
        return <ShareOnSocialMedia shareStoryId={shareStoryId} />;
    }
  };

  const closePopup = () => {
    setSelectedCard(null);
  };

  //pagination
  const itemsPerPage = 24;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = initialData?.slice(indexOfFirstItem, indexOfLastItem);

  const totalNumberOfPages = Math.ceil(initialData?.length / itemsPerPage);

  return (
    <div className="publicShelf">
      {selectedCard && (
        <>
          <div className="popup-overlay"></div>
          <div className={`popup active`}>
            <span className="popup-close" onClick={closePopup}>
              X
            </span>
            <div className="popup-content">{renderPopupComponent()}</div>
          </div>
        </>
      )}
      <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
      <div className="publicShelfHero">
        <div className="container">
          <div className="top">
            <h2>Welcome to StoryFony public story shelf</h2>
            <p>
              Discover amazing story that captures the essence of their
              extraordinary journey, humor, and budding romance
            </p>
          </div>
          <div className="search">
            <input type="text" placeholder="Enter story title, author penName, email" value={searchQuery} onChange={handleSearchChange} />
            <div className="btn">Search for story</div>
          </div>
        </div>
      </div>

      <div className="container2">
        <h1>Stories in public domain</h1>
        {isLoadingStory ? (
          <Spinner />
        ) : (
          <div className="content">
            {
                currentItems?.length === 0 ? (
                    <div className="errorText">No Story Found</div>
                ) : (
                    <div className="cards">
                    {currentItems?.map((item, idx) => (
                        <div className="card card-2" key={idx}>
                        <div className="overlay"></div>
                        <StoryCard
                            data={item}
                            setSelectedCard={setSelectedCard}
                            setShareStoryId={setShareStoryId}
                        />
                        </div>
                    ))}
                    </div>
                )
            }
            <div className="paginationBtn">
              {data?.length > 0 ? (
                <span>
                  page {currentPage} of {totalNumberOfPages}{" "}
                </span>
              ) : (
                ""
              )}
              <div className="btn">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn1"
                  >
                    Back
                  </button>
                )}
                {totalNumberOfPages > 1 && currentPage < totalNumberOfPages ? (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastItem >= data?.length}
                    className="btn2"
                  >
                    Next
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicShelf;
