import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import PhotoItem from '../../components/home/photoItem';
import { Background, BaseBox, Wrapper } from './styles';

const SEE_COFFEE_SHOPS = gql`
  query seeCoffeeShops($page: Int!) {
    seeCoffeeShops(page: $page) {
      coffeeShops {
        id
        name
        photos {
          id
          url
        }
      }
    }
  }
`;
function Home() {
  const [page, setPage] = useState(0);
  const { data, loading, refetch, fetchMore } = useQuery(SEE_COFFEE_SHOPS, {
    variables: {
      page: 1,
    },
  });
  console.log(data);

  return (
    <Background>
      <Wrapper>
        {loading
          ? ''
          : data &&
            data.seeCoffeeShops &&
            data.seeCoffeeShops.coffeeShops.map((coffeeShop) => (
              <PhotoItem
                key={coffeeShop.id}
                urlArr={coffeeShop.photos.map((photo) => photo.url)}
              />
            ))}
      </Wrapper>
    </Background>
  );
}
export default Home;
