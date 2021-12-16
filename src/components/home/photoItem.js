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
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Photo = styled.img`
  max-width: 100%;
  height: auto;
`;

const DescriptionBox = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;
const CategoryTitle = styled.div``;
const CategoryText = styled.div`
  margin-top: 10px;
`;

function PhotoItem({ urlArr }) {
  return (
    <PhotoBoxContainer>
      {urlArr.map((url) => (
        <>
          <PhotoBox>
            <Photo src={url} />
          </PhotoBox>
          <DescriptionBox>
            <CategoryTitle>Category</CategoryTitle>
            <CategoryText>#123 #123</CategoryText>
          </DescriptionBox>
        </>
      ))}
    </PhotoBoxContainer>
  );
}
export default PhotoItem;
