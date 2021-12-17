import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PhotoItem from '../../components/home/photoItem';
import routes from '../../routes';
import { Background, Wrapper } from './styles';
import { logUserOut } from '../../apollo';

const SEE_COFFEE_SHOPS = gql`
  query seeCoffeeShops($lastId: Int) {
    seeCoffeeShops(lastId: $lastId) {
      coffeeShops {
        id
        isMine
        user {
          id
        }
        name
        categorys {
          id
          name
        }
        caption
        photos {
          id
          url
        }
      }
    }
  }
`;

const AddButton = styled.button`
  position: fixed;
  top: 40px;
  right: 40px;
`;

const LogoutButton = styled.button`
  position: fixed;
  top: 70px;
  right: 40px;
`;

function Home() {
  const [lastId] = useState(undefined);
  const { data, loading } = useQuery(SEE_COFFEE_SHOPS, {
    variables: { lastId },
    // onCompleted: (data) =>
    //   setLastId(
    //     data.seeCoffeeShops.coffeeShops[
    //       data.seeCoffeeShops.coffeeShops.length - 1
    //     ].id
    //   ),
  });

  return (
    <Background>
      <AddButton>
        <Link to={routes.add}>추가</Link>
      </AddButton>
      <LogoutButton onClick={logUserOut}>로그아웃</LogoutButton>
      <Wrapper>
        {loading
          ? ''
          : data &&
            data.seeCoffeeShops &&
            data.seeCoffeeShops.coffeeShops.map((coffeeShop) => (
              <PhotoItem
                key={coffeeShop.id}
                urlArr={coffeeShop.photos.map((photo) => photo.url)}
                categories={coffeeShop.categorys.map(
                  (category) => category.name
                )}
                caption={coffeeShop.caption}
                userId={coffeeShop.userId}
                isMine={coffeeShop.isMine}
                coffeeShopId={coffeeShop.id}
              />
            ))}
      </Wrapper>
    </Background>
  );
}
export default Home;
