import { Link } from 'react-router-dom';
import styled from 'styled-components';
const PhotoBoxContainer = styled.div`
  background-color: white;
  padding: 30px;
  margin-top: 35px;
  border-radius: 3px;
  border-radius: 3px;
`;
const PhotoBox = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Photo = styled.img`
  max-width: 100%;
`;

const DescriptionBox = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;
const CategoryTitle = styled.div``;
const CategoryText = styled.div`
  margin-top: 10px;
`;

const EditButton = styled.button`
  top: 40px;
  right: 40px;
`;

function PhotoItem({ urlArr, categories, caption, isMine, coffeeShopId }) {
  return (
    <PhotoBoxContainer>
      {urlArr.map((url) => (
        <div key={url}>
          <PhotoBox>
            <Photo src={url} />
          </PhotoBox>
        </div>
      ))}
      <DescriptionBox>
        <CategoryText>
          {categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </CategoryText>
        <CategoryTitle>{caption}</CategoryTitle>
        <EditButton>
          {isMine && <Link to={`/edit/${coffeeShopId}`}>수정</Link>}
        </EditButton>
      </DescriptionBox>
    </PhotoBoxContainer>
  );
}
export default PhotoItem;
